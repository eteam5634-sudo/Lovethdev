import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import {
  ensureCurrentProfile,
  getCurrentProfile,
} from './profiles'
import type { AppRole, Profile } from './roles'
import { isAdmin, isMember, isSuperAdmin } from './roles'

interface ProfileContextValue {
  profile: Profile | null
  role: AppRole | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
  isMember: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const ensured = await ensureCurrentProfile(
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : undefined,
    )

    if (ensured.error && !ensured.profile) {
      const fallback = await getCurrentProfile()
      setProfile(fallback.profile)
      setError(ensured.error)
    } else {
      setProfile(ensured.profile)
      setError(ensured.error)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (authLoading) return
    void refreshProfile()
  }, [authLoading, refreshProfile])

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      role: profile?.role ?? null,
      loading: authLoading || loading,
      error,
      refreshProfile,
      isMember: isMember(profile?.role),
      isAdmin: isAdmin(profile?.role),
      isSuperAdmin: isSuperAdmin(profile?.role),
    }),
    [profile, authLoading, loading, error, refreshProfile],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
