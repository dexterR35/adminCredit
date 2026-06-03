-- Web client status: align DB with admin app (Pending / Approved / Denied)
-- Replaces public-form constraint that only allowed 'submitted'

alter table public.credit_applications
  drop constraint if exists credit_applications_status_check;

update public.credit_applications
set status = 'Pending'
where status is null
   or lower(trim(status)) in ('new', 'submitted', '');

update public.credit_applications
set status = 'Approved'
where lower(trim(status)) in ('approved', 'approve', 'completed');

update public.credit_applications
set status = 'Denied'
where lower(trim(status)) in ('denied', 'deny', 'rejected', 'cancelled');

update public.credit_applications
set status = 'Pending'
where lower(trim(status)) = 'pending'
  and status <> 'Pending';

alter table public.credit_applications
  alter column status set default 'Pending';

-- Keep 'submitted' for new rows from obtinecredit.ro/formular
alter table public.credit_applications
  add constraint credit_applications_status_check
  check (status in ('Pending', 'Approved', 'Denied', 'submitted'));
