/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  readonly NEXT_PUBLIC_SUPABASE_URL?: string
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string
  /** Email-only test prefills — never store passwords in VITE_ vars */
  readonly VITE_TEST_MEMBER_EMAIL?: string
  readonly VITE_TEST_ADMIN_EMAIL?: string
  readonly VITE_TEST_SUPER_ADMIN_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
