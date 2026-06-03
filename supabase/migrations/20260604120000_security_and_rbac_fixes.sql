-- Security fixes: RLS scoping, profile role protection, fisa admin insert, contracts read

-- Prevent non-admins from escalating role on their own profile
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

-- Web clients: admin sees all; consultants see unassigned or assigned to them
drop policy if exists "web clients read all authenticated" on public.credit_applications;
drop policy if exists "web clients read scoped" on public.credit_applications;
create policy "web clients read scoped"
  on public.credit_applications for select to authenticated
  using (
    public.is_admin()
    or assigned_user_id = auth.uid()
    or assigned_user_id is null
  );

-- Institutions follow parent application visibility
drop policy if exists "institutions read authenticated" on public.credit_application_institutions;
drop policy if exists "institutions read scoped" on public.credit_application_institutions;
create policy "institutions read scoped"
  on public.credit_application_institutions for select to authenticated
  using (
    exists (
      select 1
      from public.credit_applications ca
      where ca.id = application_id
        and (
          public.is_admin()
          or ca.assigned_user_id = auth.uid()
          or ca.assigned_user_id is null
        )
    )
  );

-- Contracts: consultants only see their own rows (not orphan null user_id rows)
drop policy if exists "contracts read own or admin" on public.contracts;
create policy "contracts read own or admin"
  on public.contracts for select to authenticated
  using (public.is_admin() or user_id = auth.uid());

-- Fisa: admin may insert on behalf of consultants/admins
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
