import { useEffect, useState } from 'react'
import { listProfiles } from '../lib/profiles'
import { useProfile } from '../lib/ProfileContext'
import { roleLabel, type Profile } from '../lib/roles'
import { ProfileCard } from '../components/profile/ProfileCard'
import { SectionHeading } from '../components/ui/SectionHeading'

export function UsersPage() {
  const { role } = useProfile()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Community | LovethDev Playground'
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const result = await listProfiles()
      if (cancelled) return
      setProfiles(result.profiles)
      setError(result.error)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const description =
    role === 'admin'
      ? 'Admin view: members and admins only. Super Admin profiles are hidden.'
      : role === 'super_admin'
        ? 'Super Admin view: all members, admins, and super admins.'
        : 'Explore LovethDev members and profiles.'

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={role ? roleLabel(role) : 'Profiles'}
          title="User Directory"
          description={description}
        />

        {loading ? (
          <p className="text-slate-400" role="status">
            Loading profiles...
          </p>
        ) : error ? (
          <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">
            {error}
          </p>
        ) : profiles.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-slate-400">
            No profiles available yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
