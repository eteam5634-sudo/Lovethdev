import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getProfileById } from '../lib/profiles'
import type { Profile } from '../lib/roles'
import { ProfileAvatar } from '../components/profile/ProfileAvatar'
import { RoleBadge } from '../components/profile/RoleBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../lib/AuthContext'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Profile | LovethDev Playground'
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!id) {
        setError('Profile not found.')
        setLoading(false)
        return
      }
      setLoading(true)
      const result = await getProfileById(id)
      if (cancelled) return
      setProfile(result.profile)
      setError(result.error ?? (result.profile ? null : 'Profile not found.'))
      setLoading(false)
      if (result.profile?.full_name) {
        document.title = `${result.profile.full_name} | LovethDev Playground`
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/users" className="mb-6 inline-flex">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </Button>
        </Link>

        {loading ? (
          <p className="text-slate-400" role="status">
            Loading profile...
          </p>
        ) : error || !profile ? (
          <Card>
            <p className="text-rose-200" role="alert">
              {error ?? 'Profile not found.'}
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <ProfileAvatar
                ownerId={profile.id}
                ownerRole={profile.role}
                avatarPath={profile.avatar_path}
                fullName={profile.full_name}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">
                    {profile.full_name?.trim() || 'LovethDev Member'}
                  </h1>
                  <RoleBadge role={profile.role} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {profile.bio?.trim() || 'No bio yet.'}
                </p>

                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  {user?.id === profile.id ? (
                    <div>
                      <dt className="text-slate-500">Email</dt>
                      <dd className="break-all text-slate-200">{profile.email ?? 'Unavailable'}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-slate-500">Joined</dt>
                    <dd className="text-slate-200">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Role</dt>
                    <dd className="text-slate-200">
                      <RoleBadge role={profile.role} />
                    </dd>
                  </div>
                </dl>

                {user?.id === profile.id ? (
                  <Link to="/profile" className="mt-6 inline-flex">
                    <Button variant="aurora" size="sm">
                      Edit my profile
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
