import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'

const NEXT_KEY = 'lovethdev_auth_next'

function resolveNext(searchParams: URLSearchParams): string {
  const fromQuery = searchParams.get('next')
  if (fromQuery?.startsWith('/')) return fromQuery

  try {
    const stored = sessionStorage.getItem(NEXT_KEY)
    if (stored?.startsWith('/')) return stored
  } catch {
    // ignore storage errors
  }

  return '/dashboard'
}

function clearStoredNext() {
  try {
    sessionStorage.removeItem(NEXT_KEY)
  } catch {
    // ignore
  }
}

async function waitForSession(
  supabase: SupabaseClient,
  timeoutMs = 4000,
): Promise<Session | null> {
  const existing = (await supabase.auth.getSession()).data.session
  if (existing) return existing

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      subscription.unsubscribe()
      void supabase.auth.getSession().then(({ data }) => resolve(data.session ?? null))
    }, timeoutMs)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || session) {
        window.clearTimeout(timer)
        subscription.unsubscribe()
        resolve(session)
      }
    })
  })
}

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Signing in | LovethDev Playground'
  }, [])

  useEffect(() => {
    let cancelled = false

    async function finishAuth() {
      const next = resolveNext(searchParams)
      const oauthError =
        searchParams.get('error_description') ||
        searchParams.get('error') ||
        new URLSearchParams(window.location.hash.replace(/^#/, '')).get('error')

      if (oauthError) {
        if (!cancelled) {
          setError('Social sign-in was cancelled or failed. Please try again.')
        }
        clearStoredNext()
        return
      }

      if (!isSupabaseConfigured) {
        if (!cancelled) setError('Authentication is not configured.')
        return
      }

      try {
        const supabase = getSupabaseClient()
        const code = searchParams.get('code')

        // Prefer an existing session (e.g. auto-detected) before exchanging again.
        let session = (await supabase.auth.getSession()).data.session

        if (!session && code) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            // Code may already have been consumed — check session again.
            session = (await waitForSession(supabase, 2500)) ?? null
            if (!session && !cancelled) {
              const msg = exchangeError.message?.toLowerCase() ?? ''
              if (msg.includes('redirect') || msg.includes('url')) {
                setError(
                  'OAuth redirect URL is not allowed. Add this site’s /auth/callback URL in Supabase Auth settings.',
                )
              } else if (msg.includes('verifier') || msg.includes('pkce')) {
                setError(
                  'Sign-in session expired. Close this tab, open Sign In again, and retry.',
                )
              } else {
                setError('Could not complete social sign-in. Please try again.')
              }
              clearStoredNext()
              return
            }
          } else {
            session = data.session
          }
        }

        if (!session) {
          session = await waitForSession(supabase, 4000)
        }

        if (!session) {
          if (!cancelled) {
            setError(
              'No sign-in session was found. Confirm the provider is enabled in Supabase and this site’s /auth/callback URL is allowlisted.',
            )
          }
          clearStoredNext()
          return
        }

        clearStoredNext()
        if (!cancelled) navigate(next, { replace: true })
      } catch {
        if (!cancelled) setError('Could not complete social sign-in. Please try again.')
        clearStoredNext()
      }
    }

    void finishAuth()
    return () => {
      cancelled = true
    }
  }, [navigate, searchParams])

  return (
    <AuthLayout
      title="Completing sign-in"
      subtitle="Finishing your social authentication..."
      footer={
        error ? (
          <>
            Having trouble?{' '}
            <Link to="/login" className="font-medium text-cyan-300 transition hover:text-cyan-200">
              Back to Sign In
            </Link>
          </>
        ) : null
      }
    >
      {error ? (
        <div className="space-y-4">
          <p
            className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            {error}
          </p>
          <Link to="/login">
            <Button variant="aurora" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <p className="text-center text-sm text-slate-400" role="status">
          Signing you in...
        </p>
      )}
    </AuthLayout>
  )
}

export { NEXT_KEY as AUTH_NEXT_STORAGE_KEY }
