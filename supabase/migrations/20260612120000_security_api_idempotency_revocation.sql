-- Security API helpers: token revocation denylist, idempotency ledger, and audit events.
-- Supabase Auth owns JWT issuing/refresh. These project tables provide app-level
-- controls that RLS policies and RPCs can reference.

create extension if not exists "pgcrypto";

create table if not exists public.revoked_auth_sessions (
  session_id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  revoked_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz not null default now(),
  reason text
);

create index if not exists idx_revoked_auth_sessions_user_id
  on public.revoked_auth_sessions (user_id, revoked_at desc);

create table if not exists public.api_idempotency_keys (
  key text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null,
  request_hash text,
  response jsonb,
  status text not null default 'processing'
    check (status in ('processing', 'completed', 'failed')),
  locked_until timestamptz not null default (now() + interval '5 minutes'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_api_idempotency_keys_user_scope
  on public.api_idempotency_keys (user_id, scope, created_at desc);

create table if not exists public.security_audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null default auth.uid(),
  event_type text not null,
  scope text,
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_security_audit_events_user_time
  on public.security_audit_events (user_id, created_at desc);

alter table public.revoked_auth_sessions enable row level security;
alter table public.api_idempotency_keys enable row level security;
alter table public.security_audit_events enable row level security;

grant select, insert on public.security_audit_events to authenticated;
grant select, insert, update on public.api_idempotency_keys to authenticated;
grant select on public.revoked_auth_sessions to authenticated;

create or replace function public.current_session_id()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt() ->> 'session_id',
    auth.jwt() ->> 'sid'
  );
$$;

create or replace function public.is_session_revoked()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.revoked_auth_sessions ras
    where ras.session_id = public.current_session_id()
  );
$$;

create or replace function public.auth_not_revoked()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null and not public.is_session_revoked();
$$;

create or replace function public.revoke_current_session(reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  sid text := public.current_session_id();
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if sid is null then
    raise exception 'Current JWT does not expose a session id';
  end if;

  insert into public.revoked_auth_sessions (session_id, user_id, revoked_by, reason)
  values (sid, auth.uid(), auth.uid(), reason)
  on conflict (session_id) do nothing;

  insert into public.security_audit_events (event_type, scope, metadata)
  values ('auth.session.revoked', 'auth:revoke', jsonb_build_object('reason', reason));
end;
$$;

create or replace function public.claim_idempotency_key(
  request_key text,
  request_scope text,
  request_hash text default null
)
returns public.api_idempotency_keys
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.api_idempotency_keys;
begin
  if not public.auth_not_revoked() then
    raise exception 'Not authenticated';
  end if;

  insert into public.api_idempotency_keys (key, user_id, scope, request_hash)
  values (request_key, auth.uid(), request_scope, request_hash)
  on conflict (key) do nothing;

  select *
    into row
    from public.api_idempotency_keys
   where key = request_key
     and user_id = auth.uid();

  if row.key is null then
    raise exception 'Idempotency key belongs to another user';
  end if;

  return row;
end;
$$;

drop policy if exists "audit insert own" on public.security_audit_events;
create policy "audit insert own"
  on public.security_audit_events for insert to authenticated
  with check (user_id = auth.uid() and public.auth_not_revoked());

drop policy if exists "audit read own or admin" on public.security_audit_events;
create policy "audit read own or admin"
  on public.security_audit_events for select to authenticated
  using ((user_id = auth.uid() or public.is_admin()) and public.auth_not_revoked());

drop policy if exists "idempotency read own" on public.api_idempotency_keys;
create policy "idempotency read own"
  on public.api_idempotency_keys for select to authenticated
  using (user_id = auth.uid() and public.auth_not_revoked());

drop policy if exists "idempotency insert own" on public.api_idempotency_keys;
create policy "idempotency insert own"
  on public.api_idempotency_keys for insert to authenticated
  with check (user_id = auth.uid() and public.auth_not_revoked());

drop policy if exists "idempotency update own" on public.api_idempotency_keys;
create policy "idempotency update own"
  on public.api_idempotency_keys for update to authenticated
  using (user_id = auth.uid() and public.auth_not_revoked())
  with check (user_id = auth.uid() and public.auth_not_revoked());

drop policy if exists "revoked sessions read own or admin" on public.revoked_auth_sessions;
create policy "revoked sessions read own or admin"
  on public.revoked_auth_sessions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
