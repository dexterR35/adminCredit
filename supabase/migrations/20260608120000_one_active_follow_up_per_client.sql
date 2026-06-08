-- One active (non-dismissed) reminder per client

-- Remove duplicate active rows — keep the latest scheduled time per client
delete from public.client_follow_ups cf
where cf.id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by credit_application_id
        order by follow_up_at desc, created_at desc
      ) as rn
    from public.client_follow_ups
    where dismissed_at is null
      and credit_application_id is not null
  ) ranked
  where rn > 1
);

delete from public.client_follow_ups cf
where cf.id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by fisa_report_id
        order by follow_up_at desc, created_at desc
      ) as rn
    from public.client_follow_ups
    where dismissed_at is null
      and fisa_report_id is not null
  ) ranked
  where rn > 1
);

create unique index if not exists idx_client_follow_ups_one_active_credit_app
  on public.client_follow_ups (credit_application_id)
  where dismissed_at is null and credit_application_id is not null;

create unique index if not exists idx_client_follow_ups_one_active_fisa_report
  on public.client_follow_ups (fisa_report_id)
  where dismissed_at is null and fisa_report_id is not null;
