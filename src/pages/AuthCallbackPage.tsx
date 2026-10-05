import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'

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
      const nextParam = searchParams.get('next') || '/dashboard'
      const next = nextParam.startsWith('/') ? nextParam : '/dashboard'
      const oauthError = searchParams.get('error_description') || searchParams.get('error')

      if (oauthError) {
        if (!cancelled) {
          setError('Google sign-in was cancelled or failed. Please try again.')
        }
        return
      }

      if (!isSupabaseConfigured) {
        if (!cancelled) setError('Authentication is not configured.')
        return
      }

      try {
        const supabase = getSupabaseClient()
        const code = searchParams.get('code')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            if (!cancelled) {
              setError('Could not complete Google sign-in. Please try again.')
            }
            return
          }
        } else {
          const { data } = await supabase.auth.getSession()
          if (!data.session) {
            if (!cancelled) {
              setError('No sign-in session was found. Please try Google sign-in again.')
            }
            return
          }
        }

        if (!cancelled) navigate(next, { replace: true })
      } catch {
        if (!cancelled) setError('Could not complete Google sign-in. Please try again.')
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
      subtitle="Finishing your Google authentication..."
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
