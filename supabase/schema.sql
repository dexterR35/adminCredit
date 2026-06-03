-- Run in Supabase SQL Editor if tables/policies are missing.
-- Safe to re-run: uses IF NOT EXISTS where possible.

create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  role text not null default 'consultant' check (role in ('admin', 'consultant')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.credit_applications
  add column if not exists form_data jsonb not null default '{}'::jsonb,
  add column if not exists assigned_user_id uuid references auth.users(id),
  add column if not exists updated_at timestamptz default now();

alter table public.contracts
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists updated_at timestamptz default now();

create table if not exists public.fisa_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  form_data jsonb not null default '{}'::jsonb,
  client_full_name text,
  client_cnp text,
  phone text,
  email text,
  today_date text,
  pdf_url text,
  photo_url text,
  user_status text not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_assignments (
  id uuid primary key default gen_random_uuid(),
  credit_application_id uuid not null references public.credit_applications(id) on delete cascade,
  assigned_user_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (credit_application_id)
);

create index if not exists idx_fisa_reports_user_id on public.fisa_reports(user_id);
create index if not exists idx_fisa_reports_created_at on public.fisa_reports(created_at desc);
create index if not exists idx_contracts_user_id on public.contracts(user_id);
create index if not exists idx_contracts_created_at on public.contracts(created_at desc);
create index if not exists idx_credit_applications_created_at on public.credit_applications(created_at desc);
create index if not exists idx_credit_applications_assigned_user_id on public.credit_applications(assigned_user_id);

alter table public.profiles enable row level security;
alter table public.credit_applications enable row level security;
alter table public.contracts enable row level security;
alter table public.fisa_reports enable row level security;
alter table public.client_assignments enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.credit_applications to authenticated;
grant select, insert, update, delete on public.contracts to authenticated;
grant select, insert, update, delete on public.fisa_reports to authenticated;
grant select, insert, update, delete on public.client_assignments to authenticated;

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles insert admin" on public.profiles;
create policy "profiles insert admin"
  on public.profiles for insert to authenticated
  with check (public.is_admin() or id = auth.uid());

drop policy if exists "web clients read all authenticated" on public.credit_applications;
drop policy if exists "web clients read scoped" on public.credit_applications;
create policy "web clients read scoped"
  on public.credit_applications for select to authenticated
  using (
    public.is_admin()
    or assigned_user_id = auth.uid()
    or assigned_user_id is null
  );

drop policy if exists "web clients update admin" on public.credit_applications;
create policy "web clients update admin"
  on public.credit_applications for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "web clients delete admin" on public.credit_applications;
create policy "web clients delete admin"
  on public.credit_applications for delete to authenticated
  using (public.is_admin());

drop policy if exists "institutions read authenticated" on public.credit_application_institutions;
drop policy if exists "institutions read scoped" on public.credit_application_institutions;
create policy "institutions read scoped"
  on public.credit_application_institutions for select to authenticated
  using (
    exists (
      select 1
      from public.credit_applications ca
      where ca.id = credit_application_id
        and (
          public.is_admin()
          or ca.assigned_user_id = auth.uid()
          or ca.assigned_user_id is null
        )
    )
  );

alter table public.credit_application_institutions enable row level security;
grant select on public.credit_application_institutions to authenticated;

drop policy if exists "contracts read own or admin" on public.contracts;
create policy "contracts read own or admin"
  on public.contracts for select to authenticated
  using (public.is_admin() or user_id = auth.uid());

drop policy if exists "contracts delete admin" on public.contracts;
create policy "contracts delete admin"
  on public.contracts for delete to authenticated
  using (public.is_admin());

drop policy if exists "fisa read own or admin" on public.fisa_reports;
create policy "fisa read own or admin"
  on public.fisa_reports for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "fisa insert own" on public.fisa_reports;
drop policy if exists "fisa insert own or admin" on public.fisa_reports;
create policy "fisa insert own or admin"
  on public.fisa_reports for insert to authenticated
  with check (
    user_id = auth.uid()
    or (
      public.is_admin()
      and exists (
        select 1 from public.profiles p
        where p.id = user_id
          and p.role in ('admin', 'consultant')
      )
    )
  );

drop policy if exists "fisa update own or admin" on public.fisa_reports;
create policy "fisa update own or admin"
  on public.fisa_reports for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "fisa delete own or admin" on public.fisa_reports;
create policy "fisa delete own or admin"
  on public.fisa_reports for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "assignments read relevant" on public.client_assignments;
create policy "assignments read relevant"
  on public.client_assignments for select to authenticated
  using (assigned_user_id = auth.uid() or public.is_admin());

drop policy if exists "assignments admin manage" on public.client_assignments;
create policy "assignments admin manage"
  on public.client_assignments for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_app_meta_data ->> 'role', 'consultant')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and new.role is distinct from old.role then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trigger on public.profiles;
create trigger protect_profile_role_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_role();

alter publication supabase_realtime add table public.fisa_reports;
alter publication supabase_realtime add table public.credit_applications;
alter publication supabase_realtime add table public.contracts;
alter publication supabase_realtime add table public.client_assignments;
