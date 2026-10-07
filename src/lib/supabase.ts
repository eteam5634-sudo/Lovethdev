import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function readEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

const supabaseUrl =
  readEnv('NEXT_PUBLIC_SUPABASE_URL') ||
  readEnv('VITE_SUPABASE_URL')

const supabasePublishableKey =
  readEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
  readEnv('VITE_SUPABASE_PUBLISHABLE_KEY')

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabasePublishableKey) &&
  !supabaseUrl.includes('your_supabase') &&
  !supabasePublishableKey.includes('your_supabase')

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) to .env, restart the local server, and for production add the same vars in Vercel then redeploy.',
    )
  }

  if (!client) {
    client = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Callback page exchanges the code explicitly to avoid double-exchange races.
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
    })
  }

  return client
}
