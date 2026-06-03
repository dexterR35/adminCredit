-- Fisa report status: Pending, Approved, Denied (migrate legacy "New")

alter table public.fisa_reports
  alter column user_status set default 'Pending';

update public.fisa_reports
set user_status = 'Pending'
where lower(trim(user_status)) in ('new', '');

update public.fisa_reports
set user_status = 'Approved'
where lower(trim(user_status)) in ('approved', 'approve', 'completed');

update public.fisa_reports
set user_status = 'Denied'
where lower(trim(user_status)) in ('denied', 'deny', 'rejected', 'cancelled');

update public.fisa_reports
set user_status = 'Pending'
where lower(trim(user_status)) = 'pending'
  and user_status <> 'Pending';

update public.fisa_reports fr
set form_data = jsonb_set(
  coalesce(fr.form_data, '{}'::jsonb),
  '{userStatus}',
  to_jsonb(fr.user_status),
  true
);

-- Web client status normalization
alter table public.credit_applications
  alter column status set default 'Pending';

update public.credit_applications
set status = 'Pending'
where status is null or lower(trim(status)) in ('new', '');

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
