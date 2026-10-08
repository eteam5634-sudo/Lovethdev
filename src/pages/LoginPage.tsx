import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../lib/authErrors'
import { useAuth } from '../lib/AuthContext'
import { Button } from '../components/ui/Button'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthLayout } from '../components/auth/AuthLayout'
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton'
import { DiscordAuthButton } from '../components/auth/DiscordAuthButton'

export function LoginPage() {
  const { signIn, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string; message?: string } | null)?.from ?? '/dashboard'
  const flashMessage = (location.state as { message?: string } | null)?.message

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(flashMessage ?? null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Sign In | LovethDev Playground'
  }, [])

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [authLoading, user, navigate])

  const validate = () => {
    const next: { email?: string; password?: string } = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    if (!validate()) return

    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess("You're signed in successfully.")
    navigate(from.startsWith('/') ? from : '/dashboard', { replace: true })
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue exploring LovethDev Playground."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-cyan-300 transition hover:text-cyan-200">
            Create Account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthInput
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          placeholder="you@example.com"
          required
        />
        <AuthInput
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          placeholder="Your password"
          required
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-slate-400 transition hover:text-cyan-300"
          >
            Forgot Password?
          </Link>
        </div>

        {error ? (
          <div
            className="space-y-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            <p>{error}</p>
            <p className="text-xs text-rose-100/80">
              New email?{' '}
              <Link to="/signup" className="font-medium text-cyan-300 underline-offset-2 hover:underline">
                Create Account
              </Link>
              {' · '}
              <Link
                to="/forgot-password"
                className="font-medium text-cyan-300 underline-offset-2 hover:underline"
              >
                Forgot Password
              </Link>
              {' · '}
              or use Continue with Google below.
            </p>
          </div>
        ) : null}
        {success ? (
          <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200" role="status">
            {success}
          </p>
        ) : null}

        <Button type="submit" variant="aurora" className="w-full" disabled={submitting}>
          {submitting ? 'Signing you in...' : 'Sign In'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs tracking-[0.14em] text-slate-500 uppercase">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-2">
        <GoogleAuthButton
          label="Continue with Google"
          redirectTo={from.startsWith('/') ? from : '/dashboard'}
          disabled={submitting}
        />
        <DiscordAuthButton
          label="Continue with Discord"
          redirectTo={from.startsWith('/') ? from : '/dashboard'}
          disabled={submitting}
        />
      </div>
    </AuthLayout>
  )
}
