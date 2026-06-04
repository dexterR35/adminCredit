-- Fix broken regex in storage upload policy (double-escaped dot never matched .pdf paths).

drop policy if exists "Allow public contract file uploads" on storage.objects;

create policy "Allow public contract file uploads"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'creditimg'
    and name ~ '^contracts/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+[.](pdf|jpg|jpeg|png|webp)$'
  );
