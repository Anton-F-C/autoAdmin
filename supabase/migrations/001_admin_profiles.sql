-- AutoAdmin staff identities are authenticated by Supabase Auth.
-- This table stores dashboard-specific identity, role, avatar and presence metadata.
-- Run this in the SAME Supabase project used by AutoApp.

begin;

-- -----------------------------------------------------------------------------
-- Role enum
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'admin_role') then
    create type public.admin_role as enum ('owner', 'admin', 'moderator');
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Admin profiles
-- -----------------------------------------------------------------------------

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  avatar_url text,
  role public.admin_role not null default 'moderator',
  is_active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_profiles_role_idx
  on public.admin_profiles(role);

create index if not exists admin_profiles_active_idx
  on public.admin_profiles(is_active);

alter table public.admin_profiles enable row level security;

-- -----------------------------------------------------------------------------
-- Helper: determine whether a Supabase Auth user is an enabled AutoAdmin user.
-- SECURITY DEFINER lets the function inspect admin_profiles without triggering
-- recursive RLS evaluation. The browser cannot choose a different user id.
-- -----------------------------------------------------------------------------

create or replace function public.is_auto_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = check_user_id
      and ap.is_active = true
  );
$$;

revoke all on function public.is_auto_admin(uuid) from public;
grant execute on function public.is_auto_admin(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- RLS: any ACTIVE AutoAdmin user may see the admin team roster.
-- There are intentionally NO client insert/update/delete policies for role or
-- account management. Those operations belong on the trusted Render backend
-- using the service-role key.
-- -----------------------------------------------------------------------------

drop policy if exists "admin_profiles_read_team" on public.admin_profiles;
create policy "admin_profiles_read_team"
on public.admin_profiles
for select
to authenticated
using (public.is_auto_admin(auth.uid()));

-- -----------------------------------------------------------------------------
-- Presence helper: lets an authenticated AutoAdmin user update only their own
-- last_seen_at timestamp without granting general UPDATE access to the table.
-- Realtime Presence is used for live online/offline state; last_seen_at is the
-- durable fallback after a user disconnects.
-- -----------------------------------------------------------------------------

create or replace function public.touch_admin_last_seen()
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  touched_at timestamptz := now();
begin
  if not public.is_auto_admin(auth.uid()) then
    raise exception 'Not authorized for AutoAdmin';
  end if;

  update public.admin_profiles
  set last_seen_at = touched_at,
      updated_at = touched_at
  where user_id = auth.uid();

  return touched_at;
end;
$$;

revoke all on function public.touch_admin_last_seen() from public;
grant execute on function public.touch_admin_last_seen() to authenticated;

-- -----------------------------------------------------------------------------
-- Keep updated_at correct for trusted backend changes.
-- -----------------------------------------------------------------------------

create or replace function public.set_admin_profile_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_admin_profile_updated_at();

comment on table public.admin_profiles is
  'AutoAdmin staff metadata. Authentication is handled by Supabase Auth. Owner/admin/moderator authorization is stored here.';

commit;

-- -----------------------------------------------------------------------------
-- AFTER creating the two users in Supabase Auth, add their profiles.
-- Replace the UUIDs/emails/names below with the real values from Authentication
-- > Users. Do not store passwords in this table.
-- -----------------------------------------------------------------------------
--
-- insert into public.admin_profiles (user_id, email, display_name, role)
-- values
--   ('YOUR-AUTH-USER-UUID'::uuid, 'your-company-email@faalautos.com', 'Your Name', 'owner'),
--   ('IDAS-AUTH-USER-UUID'::uuid, 'idas-company-email@faalautos.com', 'Ida', 'admin');
