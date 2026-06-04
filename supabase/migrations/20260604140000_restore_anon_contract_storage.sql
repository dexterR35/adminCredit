-- Restore public contract form access (storage uploads + DB insert) for anon users.
-- Required for contractCredit public form on the shared Supabase project.

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
    'image/webp'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

grant insert on table public.contracts to anon;
grant select on table public.contracts to authenticated;

drop policy if exists "Allow public contract submissions" on public.contracts;
create policy "Allow public contract submissions"
  on public.contracts
  for insert
  to anon
  with check (
    btrim(first_name) <> ''
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

drop policy if exists "Allow public contract file uploads" on storage.objects;
create policy "Allow public contract file uploads"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'creditimg'
    and name ~ '^contracts/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+[.](pdf|jpg|jpeg|png|webp)$'
  );

drop policy if exists "Allow signed contract file links" on storage.objects;
create policy "Allow signed contract file links"
  on storage.objects
  for select
  to anon
  using (
    bucket_id = 'creditimg'
    and name ~ '^contracts/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
  );

drop policy if exists "Allow authenticated contract file reads" on storage.objects;
create policy "Allow authenticated contract file reads"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'creditimg');
