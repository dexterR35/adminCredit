-- Harden admin auth boundaries without removing intended consultant workflows.

drop policy if exists "profiles insert admin" on public.profiles;
drop policy if exists "profiles insert own consultant or admin" on public.profiles;
create policy "profiles insert own consultant or admin"
  on public.profiles for insert to authenticated
  with check (
    public.is_admin()
    or (
      id = auth.uid()
      and role = 'consultant'
    )
  );

create or replace function public.protect_credit_application_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin()
    and new.assigned_user_id is distinct from old.assigned_user_id then
    new.assigned_user_id := old.assigned_user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_credit_application_assignment_trigger
  on public.credit_applications;
create trigger protect_credit_application_assignment_trigger
  before update on public.credit_applications
  for each row execute function public.protect_credit_application_assignment();

grant insert on table public.contracts to anon;
grant insert on table public.contracts to authenticated;

drop policy if exists "Allow public contract submissions" on public.contracts;
create policy "Allow public contract submissions"
  on public.contracts
  for insert
  to anon
  with check (
    user_id is null
    and btrim(first_name) <> ''
    and btrim(last_name) <> ''
    and btrim(phone) <> ''
    and btrim(email) <> ''
    and pdf_url like 'https://%'
    and photo_url like 'https://%'
    and signature_url like 'https://%'
    and storage_paths ? 'pdf'
    and storage_paths ? 'photo'
    and storage_paths ? 'signature'
  );

drop policy if exists "Allow authenticated contract submissions" on public.contracts;
create policy "Allow authenticated contract submissions"
  on public.contracts
  for insert
  to authenticated
  with check (
    (user_id is null or user_id = auth.uid())
    and btrim(first_name) <> ''
    and btrim(last_name) <> ''
    and btrim(phone) <> ''
    and btrim(email) <> ''
    and pdf_url like 'https://%'
    and photo_url like 'https://%'
    and signature_url like 'https://%'
    and storage_paths ? 'pdf'
    and storage_paths ? 'photo'
    and storage_paths ? 'signature'
  );
