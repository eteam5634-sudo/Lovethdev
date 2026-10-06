import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, UserRound, Crown } from 'lucide-react'
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../lib/authErrors'
import { useAuth } from '../lib/AuthContext'
import { Button } from '../components/ui/Button'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthLayout } from '../components/auth/AuthLayout'
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton'
import { DiscordAuthButton } from '../components/auth/DiscordAuthButton'

type TestRole = 'member' | 'admin' | 'super_admin'

function testEmailForRole(role: TestRole): string {
  if (role === 'member') return import.meta.env.VITE_TEST_MEMBER_EMAIL?.trim() ?? ''
  if (role === 'admin') return import.meta.env.VITE_TEST_ADMIN_EMAIL?.trim() ?? ''
  return import.meta.env.VITE_TEST_SUPER_ADMIN_EMAIL?.trim() ?? ''
}

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
  const [testHint, setTestHint] = useState<string | null>(null)

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
    setTestHint(null)
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

  const prefillsTestAccount = (role: TestRole) => {
    const nextEmail = testEmailForRole(role)
    setPassword('')
    setError(null)
    setSuccess(null)
    if (!nextEmail) {
      setTestHint(
        `Add VITE_TEST_${role === 'super_admin' ? 'SUPER_ADMIN' : role.toUpperCase()}_EMAIL to .env (email only — never put passwords in VITE_ vars).`,
      )
      return
    }
    setEmail(nextEmail)
    setTestHint(
      `Test email filled for ${role === 'super_admin' ? 'Super Admin' : role}. Enter the password manually — passwords are never stored in the frontend.`,
    )
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
          <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
            {error}
          </p>
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

      <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-amber-200 uppercase">
          Development / Test Accounts
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          These buttons only prefill the test account email. Passwords stay in your secure env /
          password manager — never in the browser bundle.
        </p>
        <div className="mt-4 grid gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-start"
            onClick={() => prefillsTestAccount('member')}
            aria-label="Prefill member test account email"
          >
            <UserRound className="h-4 w-4" />
            Sign in as Member
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-start"
            onClick={() => prefillsTestAccount('admin')}
            aria-label="Prefill admin test account email"
          >
            <Shield className="h-4 w-4" />
            Sign in as Admin
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full justify-start"
            onClick={() => prefillsTestAccount('super_admin')}
            aria-label="Prefill Super Admin test account email"
          >
            <Crown className="h-4 w-4" />
            Sign in as Super Admin
          </Button>
        </div>
        {testHint ? (
          <p className="mt-3 text-xs text-amber-100/90" role="status">
            {testHint}
          </p>
        ) : null}
      </div>
    </AuthLayout>
  )
}
