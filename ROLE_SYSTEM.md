# LovethDev Role & Profile System

Shared by:

- LovethDev Developer Playground (`main`)
- LovethDev Developer Portfolio (`master`)

Use the **same Supabase project** for both websites.

## Roles

| Role | Internal value | Default |
|------|----------------|---------|
| Member | `member` | Yes (every signup) |
| Admin | `admin` | No |
| Super Admin | `super_admin` | No |

Users cannot choose or change roles in the UI.

## Profiles table

`public.profiles`

- `id` UUID PK
- `user_id` UUID unique → `auth.users(id)`
- `full_name`, `email`, `bio`, `avatar_url` (private storage path)
- `role` constrained to `member | admin | super_admin`
- `created_at`, `updated_at`

Signup trigger creates a profile with `role = member`.

## RLS

- SELECT: authenticated (community directory)
- INSERT: own row only (`auth.uid() = user_id`), forced `member`
- UPDATE: own row only; `role` / `user_id` / `id` protected by trigger
- DELETE: own row only

## Image permission matrix

Bucket: `profile-images` (private)  
Path: `{user_id}/avatar.{ext}`

| Viewer \ Owner image | Member | Admin | Super Admin |
|----------------------|--------|-------|-------------|
| Member | YES | YES | YES |
| Admin | YES | YES | **NO** |
| Super Admin | YES | YES | YES |

Signed URLs are created only after Storage RLS allows the read. Admins see **Private** for Super Admin images.

## Apply migration (required once per Supabase project)

In Supabase SQL Editor, run:

`supabase/migrations/20260930120000_create_profiles_and_roles.sql`

## Create the 3 test accounts (server-side)

1. Add to `.env.local` (never commit):

```env
SUPABASE_SERVICE_ROLE_KEY=...
TEST_MEMBER_EMAIL=...
TEST_MEMBER_PASSWORD=...
TEST_ADMIN_EMAIL=...
TEST_ADMIN_PASSWORD=...
TEST_SUPER_ADMIN_EMAIL=...
TEST_SUPER_ADMIN_PASSWORD=...
```

2. Run:

```bash
node scripts/setup-test-accounts.mjs
```

This uses the Admin API + `promote_user_role` (not granted to browser clients).

## Promote a user safely

```sql
SELECT public.promote_user_role('USER_UUID_HERE', 'admin');
SELECT public.promote_user_role('USER_UUID_HERE', 'super_admin');
```

## Frontend routes (both sites)

- `/users` — Community
- `/users/[id]` — Profile detail (`id` = auth `user_id`)
- `/profile` — Own settings

## Security notes

- Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend env / client bundles
- Do not commit `.env` / `.env.local`
- Frontend role helpers are UX only; RLS + Storage policies enforce security
