import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isValidEmail } from '../lib/authErrors'
import { useAuth } from '../lib/AuthContext'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'

export function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Forgot Password | LovethDev Playground'
  }, [])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email.trim()) {
      setFieldError('Email is required.')
      return
    }
    if (!isValidEmail(email)) {
      setFieldError('Enter a valid email address.')
      return
    }
    setFieldError(undefined)

    setSubmitting(true)
    const result = await resetPasswordForEmail(email)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess(true)
  }

  return (
    <AuthLayout
      title="Forgot Your Password?"
      subtitle="Enter your email and we'll send you a password reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-cyan-300 transition hover:text-cyan-200">
            Sign In
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
          error={fieldError}
          placeholder="you@example.com"
          required
        />

        {error ? (
          <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200" role="status">
            Check your email for the password reset link.
          </p>
        ) : null}

        <Button type="submit" variant="aurora" className="w-full" disabled={submitting}>
          {submitting ? 'Sending reset link...' : 'Send Reset Link'}
        </Button>
      </form>
    </AuthLayout>
  )
}
