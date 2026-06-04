-- Allow authenticated users (e.g. staff testing the form while logged into /admin)
-- to upload contract files under the same path rules as anonymous submissions.

drop policy if exists "Allow authenticated contract file uploads" on storage.objects;

create policy "Allow authenticated contract file uploads"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'creditimg'
    and name ~ '^contracts/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+[.](pdf|jpg|jpeg|png|webp)$'
  );
