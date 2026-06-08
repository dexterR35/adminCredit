-- Follow-up reminders: date+time, Pending merged into In Progress

update public.credit_applications
set status = 'In Progress'
where status in ('Pending', 'pending', 'new', 'submitted')
   or status is null
   or trim(status) = '';

update public.fisa_reports
set user_status = 'In Progress'
where user_status in ('Pending', 'pending', 'new', '')
   or user_status is null
   or trim(user_status) = '';

alter table public.credit_applications
  drop constraint if exists credit_applications_status_check;

alter table public.credit_applications
  alter column status set default 'In Progress';

alter table public.credit_applications
  add constraint credit_applications_status_check
  check (status in ('In Progress', 'Approved', 'Denied', 'submitted'));

alter table public.fisa_reports
  alter column user_status set default 'In Progress';

alter table public.client_follow_ups
  add column if not exists follow_up_at timestamptz;

update public.client_follow_ups
set follow_up_at = (follow_up_date::text || 'T09:00:00')::timestamptz
where follow_up_at is null
  and follow_up_date is not null;

alter table public.client_follow_ups
  alter column follow_up_at set not null;

alter table public.client_follow_ups
  drop column if exists follow_up_date;

drop index if exists idx_client_follow_ups_user_date;
create index if not exists idx_client_follow_ups_user_at
  on public.client_follow_ups (user_id, follow_up_at)
  where dismissed_at is null;
