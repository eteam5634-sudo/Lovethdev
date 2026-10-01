# LovethDev Role & Profile System

Reusable role-based profiles for LovethDev websites (Playground on `main`, Portfolio on `master`).

## Roles

| Role | Internal value | Notes |
|------|----------------|-------|
| Member | `member` | Default for every new signup |
| Admin | `admin` | Elevated; cannot view Super Admin images |
| Super Admin | `super_admin` | Highest; sees all profile images |

Users **cannot** choose or change roles in the UI. Role changes are blocked by database triggers.

## Profiles table

`public.profiles`

- `id` / `user_id` — both tied to `auth.users(id)` (`id = user_id = auth.uid()`)
- `full_name`, `email`, `bio`
- `role` — constrained to the three values above
- `avatar_path` — private Storage object path (not a public URL)
- `created_at`, `updated_at`

## Automatic member on signup

Trigger `on_auth_user_created_profile` inserts a profile with `role = 'member'` after each `auth.users` insert.

## RLS (profiles)

- **SELECT** — authenticated users can read profiles (community directory)
- **INSERT** — own profile only (`auth.uid() = id`)
- **UPDATE** — own profile only; `role` / `user_id` / `id` protected by trigger
- **DELETE** — own profile only

## Image visibility

Bucket: `profile-images` (private)

Path: `{user_id}/avatar.{png|jpg|webp}`

| Viewer | Can retrieve images for |
|--------|-------------------------|
| Member | Member + Admin + Super Admin |
| Admin | Member + Admin (**not** Super Admin) |
| Super Admin | Member + Admin + Super Admin |

Owners can always view their own image. Signed URLs are created only after Storage RLS allows the read; admins get no URL for Super Admin images.

## Storage policies

- Upload / update / delete: own folder only
- Select: `can_view_profile_image(owner_id)` helper

## Safe role promotion

Run in the Supabase SQL editor (service role / dashboard), **not** from the browser:

```sql
-- Promote by email (example)
select public.set_user_role(id, 'admin')
from public.profiles
where email = 'someone@example.com';

-- Or promote to super_admin
select public.set_user_role('USER_UUID_HERE', 'super_admin');
```

`set_user_role` is **not** granted to `anon` / `authenticated`.

## Apply migration

1. Open Supabase Dashboard → SQL Editor for the project used by this app (`.env`).
2. Paste and run:

`supabase/migrations/20260330120000_create_profiles_and_roles.sql`

3. Confirm Auth redirect URLs include your app origin.
4. Restart `npm run dev`.

## Frontend routes

- `/users` — Community directory
- `/users/:id` — Profile detail
- `/profile` — Own profile settings (name, bio, avatar)

## Testing matrix (manual)

Create three users, then promote two via SQL:

1. Sign up User A → stays `member`
2. Sign up User B → `select set_user_role(... ,'admin')`
3. Sign up User C → `select set_user_role(... ,'super_admin')`

Verify:

- Member sees all avatars
- Admin sees member/admin avatars; Super Admin shows **Private**
- Super Admin sees all avatars
- Direct `update profiles set role = 'admin'` from a member session fails
- Member cannot update another user's row

## Security notes

- Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend env files
- Do not commit `.env` / `.env.local`
- Frontend hiding is not enough — RLS + Storage policies enforce access
