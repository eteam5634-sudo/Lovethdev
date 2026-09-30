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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
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
