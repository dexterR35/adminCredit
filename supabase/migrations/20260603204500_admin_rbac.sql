-- Applied to project uirnidboaxobewlchfut via Supabase MCP
-- Admin dashboard: profiles, fisa_reports, client_assignments, RLS, auth trigger

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  role text not null default 'consultant' check (role in ('admin', 'consultant')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

alter table public.credit_applications
  add column if not exists assigned_user_id uuid references auth.users(id),
  add column if not exists updated_at timestamptz default now();

alter table public.contracts
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists updated_at timestamptz default now();

create table if not exists public.fisa_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  form_data jsonb not null default '{}'::jsonb,
  client_full_name text,
  client_cnp text,
  phone text,
  email text,
  today_date text,
  pdf_url text,
  photo_url text,
  user_status text not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_assignments (
  id uuid primary key default gen_random_uuid(),
  credit_application_id uuid not null references public.credit_applications(id) on delete cascade,
  assigned_user_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (credit_application_id)
);

-- See supabase/schema.sql for full RLS policies and realtime publication setup
