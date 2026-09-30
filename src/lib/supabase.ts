import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL ?? ''

const supabasePublishableKey =
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  ''

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabasePublishableKey) &&
  !supabaseUrl.includes('your_supabase') &&
  !supabasePublishableKey.includes('your_supabase')

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local',
    )
  }

  if (!client) {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  }

  return client
}
