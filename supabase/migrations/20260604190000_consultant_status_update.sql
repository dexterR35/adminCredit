-- Allow consultants to update web client status (same scope as read)

drop policy if exists "web clients update admin" on public.credit_applications;
drop policy if exists "web clients update scoped" on public.credit_applications;

create policy "web clients update scoped"
  on public.credit_applications for update to authenticated
  using (
    public.is_admin()
    or assigned_user_id = auth.uid()
    or assigned_user_id is null
  )
  with check (
    public.is_admin()
    or assigned_user_id = auth.uid()
    or assigned_user_id is null
  );
