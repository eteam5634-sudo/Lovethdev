# LovethDev

Premium personal developer portfolio for **LovethDev** — a modern full-stack developer focused on building beautiful, functional, responsive websites.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React
- Lucide React
- Supabase Auth

## Getting Started

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Fill in your Supabase project URL and publishable (anon) key in `.env.local`, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Authentication

Auth is powered by **Supabase Auth** (email/password):

- `/signup` — create account
- `/login` — sign in
- `/forgot-password` — request reset email
- `/reset-password` — set a new password
- `/dashboard` — protected account area

Never put a Supabase service-role key in frontend code or `NEXT_PUBLIC_` variables.

In the Supabase dashboard, add your site URL and redirect URL:

- Site URL: your deployed origin (e.g. `https://your-app.vercel.app`)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-app.vercel.app/auth/callback`
  - `http://localhost:3000/reset-password`
  - `https://your-app.vercel.app/reset-password`

On Vercel, set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm start` — start production server
- `npm run lint` — run ESLint

## Deploy notes

Use Next.js **15.5.7+** (or the version pinned in `package.json`). Older `15.2.4` builds can fail on Vercel due to a known vulnerability/deprecation and incomplete installs.
