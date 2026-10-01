-- LovethDev role-based profiles + secure profile-image storage
-- Roles: member | admin | super_admin
-- Default signup role: member

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'member'
    check (role in ('member', 'admin', 'super_admin')),
  avatar_path text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_id_matches_user_id check (id = user_id)
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, user_id, full_name, email, role)
  values (
    new.id,
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.email,
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

create or replace function public.force_member_role_on_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.id is null then
    new.id := auth.uid();
  end if;
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;

  if auth.uid() is not null and (new.id <> auth.uid() or new.user_id <> auth.uid()) then
    raise exception 'You can only create your own profile';
  end if;

  new.role := 'member';
  return new;
end;
$$;

drop trigger if exists force_member_role_on_insert on public.profiles;
create trigger force_member_role_on_insert
before insert on public.profiles
for each row
execute function public.force_member_role_on_insert();

create or replace function public.protect_profile_security_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.id is distinct from old.id or new.user_id is distinct from old.user_id then
    raise exception 'Changing profile identity is not allowed';
  end if;

  if new.role is distinct from old.role then
    if coalesce(current_setting('app.allow_role_change', true), 'off') <> 'on' then
      raise exception 'Changing role is not allowed through client updates';
    end if;
  end if;

  if new.email is distinct from old.email and auth.uid() is not null then
    new.email := old.email;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_security_columns on public.profiles;
create trigger protect_profile_security_columns
before update on public.profiles
for each row
execute function public.protect_profile_security_columns();

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'member', false)
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'admin', false)
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'super_admin', false)
$$;

create or replace function public.is_owner(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null and auth.uid() = target_user_id
$$;

create or replace function public.can_view_profile_image(owner_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  viewer_role text;
  owner_role text;
begin
  if auth.uid() is null then
    return false;
  end if;

  if auth.uid() = owner_id then
    return true;
  end if;

  select role into viewer_role from public.profiles where id = auth.uid();
  select role into owner_role from public.profiles where id = owner_id;

  if viewer_role is null or owner_role is null then
    return false;
  end if;

  if viewer_role in ('member', 'super_admin') then
    return true;
  end if;

  if viewer_role = 'admin' then
    return owner_role in ('member', 'admin');
  end if;

  return false;
end;
$$;

create or replace function public.storage_owner_id(object_name text)
returns uuid
language plpgsql
immutable
as $$
declare
  folder text;
begin
  folder := split_part(object_name, '/', 1);
  if folder ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return folder::uuid;
  end if;
  return null;
end;
$$;

create or replace function public.set_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if new_role not in ('member', 'admin', 'super_admin') then
    raise exception 'Invalid role';
  end if;

  if auth.uid() is not null and not exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'super_admin'
  ) then
    raise exception 'Only a super_admin can change roles';
  end if;

  perform set_config('app.allow_role_change', 'on', true);

  update public.profiles
  set role = new_role,
      updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'Profile not found';
  end if;
end;
$$;

revoke all on function public.current_profile_role() from public;
revoke all on function public.is_member() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_super_admin() from public;
revoke all on function public.is_owner(uuid) from public;
revoke all on function public.can_view_profile_image(uuid) from public;
revoke all on function public.storage_owner_id(text) from public;
revoke all on function public.set_user_role(uuid, text) from public;

grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.is_member() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_super_admin() to authenticated;
grant execute on function public.is_owner(uuid) to authenticated;
grant execute on function public.can_view_profile_image(uuid) to authenticated;
grant execute on function public.storage_owner_id(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id and auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id and auth.uid() = user_id)
with check (auth.uid() = id and auth.uid() = user_id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
on public.profiles
for delete
to authenticated
using (auth.uid() = id and auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-images',
  'profile-images',
  false,
  2097152,
  array['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload own profile images" on storage.objects;
create policy "Users upload own profile images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-images'
  and auth.uid() = public.storage_owner_id(name)
);

drop policy if exists "Users update own profile images" on storage.objects;
create policy "Users update own profile images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-images'
  and auth.uid() = public.storage_owner_id(name)
)
with check (
  bucket_id = 'profile-images'
  and auth.uid() = public.storage_owner_id(name)
);

drop policy if exists "Users delete own profile images" on storage.objects;
create policy "Users delete own profile images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-images'
  and auth.uid() = public.storage_owner_id(name)
);

drop policy if exists "Role based profile image read" on storage.objects;
create policy "Role based profile image read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-images'
  and public.can_view_profile_image(public.storage_owner_id(name))
);
