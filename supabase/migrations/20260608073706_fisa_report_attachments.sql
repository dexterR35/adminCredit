-- Fisa report document attachments (edit flow for client records only).

create or replace function public.can_access_fisa_report(report_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.fisa_reports fr
    where fr.id = report_id
      and (fr.user_id = auth.uid() or public.is_admin())
  );
$$;

create or replace function public.can_access_fisa_doc_path(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  report_id uuid;
begin
  report_id := (regexp_match(
    object_name,
    '^fisa-docs/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/'
  ))[1]::uuid;

  return public.can_access_fisa_report(report_id);
exception
  when others then
    return false;
end;
$$;

create table if not exists public.fisa_report_attachments (
  id uuid primary key default gen_random_uuid(),
  fisa_report_id uuid not null references public.fisa_reports(id) on delete cascade,
  original_name text not null,
  storage_path text not null unique,
  content_type text not null,
  file_size bigint not null check (file_size > 0 and file_size <= 20971520),
  uploaded_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists idx_fisa_report_attachments_report_id
  on public.fisa_report_attachments (fisa_report_id, created_at desc);

alter table public.fisa_report_attachments enable row level security;

grant select, insert, delete on public.fisa_report_attachments to authenticated;

drop policy if exists "fisa attachments read scoped" on public.fisa_report_attachments;
create policy "fisa attachments read scoped"
  on public.fisa_report_attachments for select to authenticated
  using (public.can_access_fisa_report(fisa_report_id));

drop policy if exists "fisa attachments insert scoped" on public.fisa_report_attachments;
create policy "fisa attachments insert scoped"
  on public.fisa_report_attachments for insert to authenticated
  with check (
    public.can_access_fisa_report(fisa_report_id)
    and uploaded_by = auth.uid()
    and storage_path ~ (
      '^fisa-docs/'
      || fisa_report_id::text
      || '/'
      || id::text
      || '[.](webp|png|jpg|jpeg|pdf|docx)$'
    )
  );

drop policy if exists "fisa attachments delete scoped" on public.fisa_report_attachments;
create policy "fisa attachments delete scoped"
  on public.fisa_report_attachments for delete to authenticated
  using (
    public.is_admin()
    or uploaded_by = auth.uid()
    or public.can_access_fisa_report(fisa_report_id)
  );

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'creditimg',
  'creditimg',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Allow authenticated fisa doc uploads" on storage.objects;
create policy "Allow authenticated fisa doc uploads"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'creditimg'
    and name ~ '^fisa-docs/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](webp|png|jpg|jpeg|pdf|docx)$'
    and public.can_access_fisa_doc_path(name)
  );

drop policy if exists "Allow authenticated fisa doc reads" on storage.objects;
create policy "Allow authenticated fisa doc reads"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'creditimg'
    and name ~ '^fisa-docs/'
    and public.can_access_fisa_doc_path(name)
  );

drop policy if exists "Allow authenticated fisa doc deletes" on storage.objects;
create policy "Allow authenticated fisa doc deletes"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'creditimg'
    and name ~ '^fisa-docs/'
    and public.can_access_fisa_doc_path(name)
  );
