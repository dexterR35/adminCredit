-- Idempotent sync with supabase/schema.sql (indexes, realtime)

create index if not exists idx_credit_applications_created_at
  on public.credit_applications (created_at desc);

do $$
begin
  alter publication supabase_realtime add table public.fisa_reports;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.credit_applications;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.contracts;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.client_assignments;
exception when duplicate_object then null;
end $$;
