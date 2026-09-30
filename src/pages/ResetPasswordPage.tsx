import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MIN_PASSWORD_LENGTH } from '../lib/authErrors'
import { useAuth } from '../lib/AuthContext'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase'
import { AuthInput } from '../components/auth/AuthInput'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'

export function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [ready, setReady] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)

  useEffect(() => {
    document.title = 'Reset Password | LovethDev Playground'
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInvalidLink(true)
      return
    }

    const supabase = getSupabaseClient()
    let settled = false

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
        settled = true
        setReady(true)
        setInvalidLink(false)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        settled = true
        setReady(true)
        return
      }

      window.setTimeout(() => {
        if (!settled) {
          setInvalidLink(true)
          setReady(false)
        }
      }, 2500)
    })

    return () => subscription.unsubscribe()
  }, [])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!password) next.password = 'New password is required.'
    else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (!confirmPassword) next.confirmPassword = 'Please confirm your new password.'
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!validate()) return

    setSubmitting(true)
    const result = await updatePassword(password)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    navigate('/login', {
      replace: true,
      state: { message: 'Password updated successfully. Sign in with your new password.' },
    })
  }

  if (invalidLink && !ready) {
    return (
      <AuthLayout
        title="Reset Link Unavailable"
        subtitle="This password reset link is invalid or has expired."
        footer={
          <Link to="/forgot-password" className="font-medium text-cyan-300 hover:text-cyan-200">
            Request a new reset link
          </Link>
        }
      >
        <p className="text-center text-sm text-slate-400">
          For security, reset links can only be used once and expire after a short time.
        </p>
      </AuthLayout>
    )
  }

  if (!ready) {
    return (
      <AuthLayout title="Create a New Password" subtitle="Verifying your recovery session...">
        <p className="text-center text-sm text-slate-400" role="status">
          Preparing secure password reset...
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create a New Password"
      subtitle="Choose a strong new password for your LovethDev account."
      footer={
        <Link to="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
          Back to Sign In
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthInput
          label="New Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          placeholder="New password"
          required
        />
        <AuthInput
          label="Confirm New Password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          placeholder="Confirm new password"
          required
        />

        {error ? (
          <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="aurora" className="w-full" disabled={submitting}>
          {submitting ? 'Updating password...' : 'Update Password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
