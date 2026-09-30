# LovethDev Role System

Shared role/profile model for LovethDev Portfolio (`master`) and Playground (`main`).

## Roles

| Role | Internal value | Notes |
|------|----------------|-------|
| Member | `member` | Default for every new signup |
| Admin | `admin` | Cannot view Super Admin profile images |
| Super Admin | `super_admin` | Full profile image visibility |

Users **cannot** self-select or self-promote roles in the app.

## Profiles table

`public.profiles`

- `id` UUID PK
- `user_id` UUID unique → `auth.users(id)`
- `full_name`, `email`, `bio`, `avatar_url`
- `role` constrained to `member | admin | super_admin`
- `created_at`, `updated_at`

A trigger on `auth.users` creates a profile with role `member` after signup.

## Profile RLS

- **SELECT**: any authenticated user (community directory)
- **INSERT**: own row only (`auth.uid() = user_id`) and role must be `member`
- **UPDATE**: own row only
- **DELETE**: own row only

Triggers block client changes to:

- `role`
- `user_id`
- `id`

## Helper functions

- `current_user_role()`
- `is_member()` / `is_admin()` / `is_super_admin()`
- `is_owner(uuid)`
- `can_view_profile_image(owner_user_id)`

These are `SECURITY DEFINER` with fixed `search_path` to avoid RLS recursion.

## Image visibility

Bucket: `profile-images` (private)

Path: `{user_id}/avatar.{ext}`

| Viewer | Member images | Admin images | Super Admin images |
|--------|---------------|--------------|--------------------|
| member | yes | yes | yes |
| admin | yes | yes | **no** |
| super_admin | yes | yes | yes |

Users may upload/replace/delete **only their own** image.

Frontend uses signed URLs only after `can_view_profile_image` allows access. Admins see a **Private** placeholder for Super Admin images.

## Promoting a user safely

Do **not** expose promotion in the UI.

In the Supabase SQL editor (service role / dashboard):

```sql
SELECT public.promote_user_role('USER_UUID_HERE', 'admin');
-- or
SELECT public.promote_user_role('USER_UUID_HERE', 'super_admin');
```

`promote_user_role` is **not** granted to `authenticated` or `anon`.

## Applying the migration

Run:

`supabase/migrations/20260930120000_create_profiles_and_roles.sql`

in the Supabase SQL editor (or via Supabase CLI).

Also add Storage redirect/host settings as needed for your project.

## App routes

- `/users` — community directory
- `/users/[id]` — profile detail (`id` = `user_id`)
- `/profile` — edit own profile + avatar

## Manual security checks

1. Sign up a new user → role is `member`
2. As member, attempt `update profiles set role = 'admin'` → fails
3. As admin, open Super Admin avatar → Storage deny / Private placeholder
4. As member/super_admin, Super Admin avatar loads via signed URL
5. Attempt update/delete of another user's profile → RLS deny
