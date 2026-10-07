import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { getSecureAvatarUrl } from '../../lib/profiles'
import { canViewProfileImage, roleLabel, type AppRole } from '../../lib/roles'
import { useProfile } from '../../lib/ProfileContext'

interface ProfileAvatarProps {
  ownerId: string
  ownerRole: AppRole
  avatarPath: string | null
  fullName: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-12 w-12 text-sm',
  md: 'h-16 w-16 text-base',
  lg: 'h-28 w-28 text-2xl',
}

export function ProfileAvatar({
  ownerId,
  ownerRole,
  avatarPath,
  fullName,
  size = 'md',
}: ProfileAvatarProps) {
  const { profile, role, loading: profileLoading } = useProfile()
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  const allowedByRole = canViewProfileImage(role, ownerRole, profile?.user_id, ownerId)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setUrl(null)
      setUnavailable(false)

      if (profileLoading) return

      if (!avatarPath) {
        if (!cancelled) {
          setLoading(false)
          setUnavailable(false)
        }
        return
      }

      if (!allowedByRole) {
        if (!cancelled) {
          setUnavailable(true)
          setLoading(false)
        }
        return
      }

      const result = await getSecureAvatarUrl(avatarPath)
      if (cancelled) return

      if (result.denied || !result.url) {
        setUnavailable(true)
        setUrl(null)
      } else {
        setUrl(result.url)
        setUnavailable(false)
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [avatarPath, allowedByRole, profileLoading, ownerId, ownerRole])

  const initials =
    fullName?.trim()?.charAt(0)?.toUpperCase() ||
    roleLabel(ownerRole).charAt(0)

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${sizes[size]}`}
      aria-label={
        unavailable
          ? 'Profile image unavailable'
          : `${fullName ?? 'User'} profile image`
      }
    >
      {loading || profileLoading ? (
        <span className="h-5 w-5 animate-pulse rounded-full bg-white/20" />
      ) : unavailable ? (
        <div className="flex flex-col items-center justify-center px-1 text-center">
          <UserRound className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span className="mt-1 text-[10px] leading-tight text-slate-500">Private</span>
        </div>
      ) : url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold text-cyan-200">{initials}</span>
      )}
    </div>
  )
}
