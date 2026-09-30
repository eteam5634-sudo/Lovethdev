# LovethDev Playground

A creative developer playground showcasing frontend projects, UI experiments, reusable components, mini applications, and design experiments by **LovethDev**.

Includes Supabase Authentication for sign up, sign in, password reset, and a protected dashboard.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React
- React Router
- Supabase Auth

## Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL and publishable (anon) key
3. In the Supabase dashboard, set Auth redirect URLs to include:
   - `http://localhost:5173/reset-password`
   - `http://localhost:5173/login`
   - your production equivalents

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Auth routes

- `/` — public Playground
- `/login` — Sign in
- `/signup` — Create account
- `/forgot-password` — Request reset link
- `/reset-password` — Set new password
- `/dashboard` — protected account hub

Never put the Supabase service-role key in frontend code.
