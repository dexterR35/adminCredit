-- Client follow-up reminders for open cases (Pending / In Progress)

-- Extend status values
alter table public.credit_applications
  drop constraint if exists credit_applications_status_check;

alter table public.credit_applications
  add constraint credit_applications_status_check
  check (status in ('Pending', 'In Progress', 'Approved', 'Denied', 'submitted'));

create or replace function public.can_access_web_client(application_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.credit_applications ca
    where ca.id = application_id
      and (
        public.is_admin()
        or ca.assigned_user_id = auth.uid()
        or ca.assigned_user_id is null
      )
  );
$$;

create table if not exists public.client_follow_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  credit_application_id uuid references public.credit_applications(id) on delete cascade,
  fisa_report_id uuid references public.fisa_reports(id) on delete cascade,
  follow_up_date date not null,
  note text,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_follow_ups_target_check check (
    (credit_application_id is not null and fisa_report_id is null)
    or (credit_application_id is null and fisa_report_id is not null)
  )
);

create index if not exists idx_client_follow_ups_user_date
  on public.client_follow_ups (user_id, follow_up_date)
  where dismissed_at is null;

create index if not exists idx_client_follow_ups_credit_app
  on public.client_follow_ups (credit_application_id)
  where dismissed_at is null;

create index if not exists idx_client_follow_ups_fisa_report
  on public.client_follow_ups (fisa_report_id)
  where dismissed_at is null;

alter table public.client_follow_ups enable row level security;

grant select, insert, update, delete on public.client_follow_ups to authenticated;

drop policy if exists "follow ups read own" on public.client_follow_ups;
create policy "follow ups read own"
  on public.client_follow_ups for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "follow ups insert scoped" on public.client_follow_ups;
create policy "follow ups insert scoped"
  on public.client_follow_ups for insert to authenticated
  with check (
    user_id = auth.uid()
    and (
      (
        credit_application_id is not null
        and public.can_access_web_client(credit_application_id)
      )
      or (
        fisa_report_id is not null
        and public.can_access_fisa_report(fisa_report_id)
      )
    )
  );

drop policy if exists "follow ups update own" on public.client_follow_ups;
create policy "follow ups update own"
  on public.client_follow_ups for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "follow ups delete own" on public.client_follow_ups;
create policy "follow ups delete own"
  on public.client_follow_ups for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());
