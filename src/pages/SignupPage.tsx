import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../lib/authErrors'
import { useAuth } from '../lib/AuthContext'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'

export function SignupPage() {
  const { signUp, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Create Account | LovethDev Playground'
  }, [])

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [authLoading, user, navigate])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = 'Full name is required.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password.'
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    if (!validate()) return

    setSubmitting(true)
    const result = await signUp(email, password, fullName)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.needsEmailConfirmation) {
      setSuccess('Account created. Check your email to confirm your address before signing in.')
      return
    }

    setSuccess('Account created successfully.')
    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthLayout
      title="Create Your LovethDev Account"
      subtitle="Join the LovethDev Playground and explore the world of code, creativity and experimentation."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-300 transition hover:text-cyan-200">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthInput
          label="Full Name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={fieldErrors.fullName}
          placeholder="Your name"
          required
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          placeholder="Create a password"
          required
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          placeholder="Confirm your password"
          required
        />

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
          {submitting ? 'Creating your account...' : 'Create Account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
