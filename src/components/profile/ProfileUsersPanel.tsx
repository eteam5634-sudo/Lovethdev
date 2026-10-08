import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { listProfiles } from '../../lib/profiles'
import { useProfile } from '../../lib/ProfileContext'
import { roleLabel, type Profile } from '../../lib/roles'
import { ProfileAvatar } from './ProfileAvatar'
import { RoleBadge } from './RoleBadge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function ProfileUsersPanel() {
  const { role } = useProfile()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const hint =
    role === 'admin'
      ? 'You can view members and admins. Super Admin accounts are hidden.'
      : role === 'super_admin'
        ? 'You can view every registered member, admin, and super admin.'
        : 'Browse registered LovethDev users and open their profiles.'

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-300" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white">Registered users</h2>
          </div>
          <p className="text-sm text-slate-400">{hint}</p>
        </div>
        <Link to="/users">
          <Button size="sm" variant="secondary">
            Open full directory
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500" role="status">
          Loading users...
        </p>
      ) : error ? (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
          {error}
        </p>
      ) : profiles.length === 0 ? (
        <p className="text-sm text-slate-500">No other users found yet.</p>
      ) : (
        <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
          {profiles.slice(0, 8).map((user) => (
            <li key={user.id} className="flex items-center gap-3 px-3 py-3">
              <ProfileAvatar
                ownerId={user.user_id}
                ownerRole={user.role}
                avatarPath={user.avatar_url}
                fullName={user.full_name}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user.full_name?.trim() || 'LovethDev Member'}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
              <Link to={`/users/${user.user_id}`} className="shrink-0">
                <Button size="sm" variant="ghost" aria-label={`View ${user.full_name ?? roleLabel(user.role)}`}>
                  View
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {profiles.length > 8 ? (
        <p className="mt-3 text-xs text-slate-500">
          Showing 8 of {profiles.length}. Open the full directory to see everyone.
        </p>
      ) : null}
    </Card>
  )
}
