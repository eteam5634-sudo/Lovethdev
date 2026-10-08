import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getAuthErrorMessage } from './authErrors'
import { getSupabaseClient, isSupabaseConfigured } from './supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: string | null }>
  signInWithDiscord: (redirectTo?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
  displayName: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getDisplayName(user: User | null): string {
  if (!user) return 'Creator'
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const fullName =
    (typeof meta?.full_name === 'string' && meta.full_name.trim()) ||
    (typeof meta?.name === 'string' && meta.name.trim()) ||
    ''
  if (fullName) return fullName
  if (user.email) return user.email.split('@')[0] ?? 'Creator'
  return 'Creator'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const supabase = getSupabaseClient()
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) return { error: getAuthErrorMessage(error), needsEmailConfirmation: false }

      const needsEmailConfirmation = !data.session
      return { error: null, needsEmailConfirmation }
    } catch (error) {
      return { error: getAuthErrorMessage(error), needsEmailConfirmation: false }
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      const trimmedEmail = email.trim()
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })
      if (!error) return { error: null }

      const loginMessage = error.message?.toLowerCase() ?? ''
      if (!loginMessage.includes('invalid login credentials')) {
        return { error: getAuthErrorMessage(error) }
      }

      // New Gmail + password: create the account from the Sign In form so first-time
      // users are not blocked by "Incorrect email or password".
      const displayFromEmail = trimmedEmail.split('@')[0] || 'Creator'
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: displayFromEmail,
            name: displayFromEmail,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (signUpError) {
        const signUpMessage = signUpError.message.toLowerCase()
        if (
          signUpMessage.includes('already registered') ||
          signUpMessage.includes('already been registered')
        ) {
          return {
            error:
              'Incorrect email or password. If you used Google/Discord for this Gmail, use that button or Forgot Password to set a password.',
          }
        }
        return { error: getAuthErrorMessage(signUpError) }
      }

      if (data.session) return { error: null }

      // Confirmation may be required, or signup returned an obfuscated existing-user response.
      const { error: retryError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })
      if (!retryError) return { error: null }

      return {
        error:
          'Check your email to confirm this address, then sign in. If you already use Google for this Gmail, tap Continue with Google or use Forgot Password.',
      }
    } catch (error) {
      return { error: getAuthErrorMessage(error) }
    }
  }, [])

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    try {
      const supabase = getSupabaseClient()
      const next = redirectTo?.startsWith('/') ? redirectTo : '/dashboard'
      try {
        sessionStorage.setItem('lovethdev_auth_next', next)
      } catch {
        // ignore storage errors
      }

      // Keep redirectTo free of query params so it matches Supabase allowlist exactly.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })
      if (error) return { error: getAuthErrorMessage(error) }
      return { error: null }
    } catch (error) {
      return { error: getAuthErrorMessage(error) }
    }
  }, [])

  const signInWithDiscord = useCallback(async (redirectTo?: string) => {
    try {
      const supabase = getSupabaseClient()
      const next = redirectTo?.startsWith('/') ? redirectTo : '/dashboard'
      try {
        sessionStorage.setItem('lovethdev_auth_next', next)
      } catch {
        // ignore storage errors
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) return { error: getAuthErrorMessage(error) }
      return { error: null }
    } catch (error) {
      return { error: getAuthErrorMessage(error) }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) return { error: getAuthErrorMessage(error) }
      return { error: null }
    } catch (error) {
      return { error: getAuthErrorMessage(error) }
    }
  }, [])

  const resetPasswordForEmail = useCallback(async (email: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) return { error: getAuthErrorMessage(error) }
      return { error: null }
    } catch (error) {
      return { error: getAuthErrorMessage(error) }
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) return { error: getAuthErrorMessage(error) }
      return { error: null }
    } catch (error) {
      return { error: getAuthErrorMessage(error) }
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      configured: isSupabaseConfigured,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithDiscord,
      signOut,
      resetPasswordForEmail,
      updatePassword,
      displayName: getDisplayName(user),
    }),
    [
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithDiscord,
      signOut,
      resetPasswordForEmail,
      updatePassword,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
