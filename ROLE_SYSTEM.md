# LovethDev Role & Profile System

Shared by:

- LovethDev Developer Playground (`main`)
- LovethDev Developer Portfolio (`master`)

Use the **same Supabase project** for both websites.

## 1. Three roles

| UI label | Database value | Default |
|----------|----------------|---------|
| Member | `member` | Yes (every signup) |
| Admin | `admin` | No |
| Super Admin | `super_admin` | No |

- Users cannot choose a role at registration.
- Users cannot change their own role (or anyone else’s) from the client.
- Role spoofing via the browser is blocked by RLS + `protect_profile_security_fields`.

## 2. Three official test accounts

| Email | Role |
|-------|------|
| `iolawoyin62@gmail.com` | `member` |
| `eteam5634@gmail.com` | `admin` |
| `floravibe73@gmail.com` | `super_admin` |

These are real Supabase Auth users. Create/update them with the server-only setup script (passwords never in `VITE_` / `NEXT_PUBLIC_` / GitHub).

## 3. Profiles table

`public.profiles`

| Column | Notes |
|--------|--------|
| `id` | UUID PK |
| `user_id` | UUID unique → `auth.users(id)` |
| `full_name`, `email`, `bio` | Editable by owner |
| `avatar_url` | Private storage path (not a public URL) |
| `role` | `member \| admin \| super_admin` |
| `created_at`, `updated_at` | Timestamps |

Signup trigger `handle_new_user` inserts a profile with `role = member`.

## 4. RLS (profiles)

- **SELECT**:
  - `member` / `super_admin`: all profiles
  - `admin`: members + admins only (**cannot** see `super_admin` profiles)
  - own profile always visible
- **INSERT**: own row only (`auth.uid() = user_id`), forced `member`
- **UPDATE**: own row only; `role` / `user_id` / `id` protected by trigger
- **DELETE**: own row only

## 5. Storage (`profile-images`)

- Private bucket
- Path: `{user_id}/avatar.{ext}`
- Max size: 2MB
- MIME: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`
- Users may upload/replace/delete **only** their own folder

## 6. Directory + image visibility

| Viewer | Member profile | Admin profile | Super Admin profile | Super Admin image |
|--------|----------------|---------------|---------------------|-------------------|
| Member | YES | YES | YES | YES |
| Admin | YES | YES | **NO (hidden)** | N/A |
| Super Admin | YES | YES | YES | YES |

Admin cannot see Super Admin users in `/users` (RLS).  
Image rules still use Storage RLS via `can_view_profile_image`.

## 7. Login / logout

- Email + password via Supabase Auth (Google/Discord OAuth also supported where enabled)
- After login, role comes from `profiles.role`
- Sign out calls `supabase.auth.signOut()`, clears session, updates navbar, redirects to `/login`

## 8. New users → member

1. Auth user created  
2. Trigger creates profile  
3. Role = `member`

## 9. Create test accounts safely

1. Apply migration once in Supabase SQL Editor:

`supabase/migrations/20260930120000_create_profiles_and_roles.sql`

2. Create `.env.local` (never commit):

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TEST_MEMBER_PASSWORD=your_secure_password
TEST_ADMIN_PASSWORD=your_secure_password
TEST_SUPER_ADMIN_PASSWORD=your_secure_password
```

Optional email overrides (defaults are the three Gmails above):

```env
TEST_MEMBER_EMAIL=iolawoyin62@gmail.com
TEST_ADMIN_EMAIL=eteam5634@gmail.com
TEST_SUPER_ADMIN_EMAIL=floravibe73@gmail.com
```

3. Run:

```bash
npm run setup:test-accounts
```

Safe to re-run. Does not delete users.

## 10. Promote a user safely

```sql
SELECT public.promote_user_role('USER_UUID_HERE', 'admin');
SELECT public.promote_user_role('USER_UUID_HERE', 'super_admin');
```

Only via SQL editor / service role — not from the browser.

## 11. Security rules

- Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend env / client bundles
- Never put passwords in `VITE_*` or `NEXT_PUBLIC_*`
- Do not commit `.env` / `.env.local`
- Frontend role helpers are UX only; RLS + Storage enforce security

## 12. Environment variables

**Client-safe (both sites):**

- `NEXT_PUBLIC_SUPABASE_URL` / `VITE_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`

**Optional client email prefills (Playground):**

- `VITE_TEST_MEMBER_EMAIL=iolawoyin62@gmail.com`
- `VITE_TEST_ADMIN_EMAIL=eteam5634@gmail.com`
- `VITE_TEST_SUPER_ADMIN_EMAIL=floravibe73@gmail.com`

**Server-only (`.env.local`):**

- `SUPABASE_SERVICE_ROLE_KEY`
- `TEST_MEMBER_PASSWORD`, `TEST_ADMIN_PASSWORD`, `TEST_SUPER_ADMIN_PASSWORD`

## Frontend routes

| Route | Purpose |
|-------|---------|
| `/login` | Sign in |
| `/signup` | Sign up → member |
| `/dashboard` | Authenticated hub |
| `/users` or `/profiles` | User directory |
| `/users/:id` | Profile detail |
| `/profile` | Own profile settings |

## Git branches

| Site | Branch |
|------|--------|
| Playground | `main` |
| Portfolio | `master` |

Same Supabase backend for both.
