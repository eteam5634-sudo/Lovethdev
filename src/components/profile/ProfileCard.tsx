import { Link } from 'react-router-dom'
import type { Profile } from '../../lib/roles'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { ProfileAvatar } from './ProfileAvatar'
import { RoleBadge } from './RoleBadge'

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start gap-4">
        <ProfileAvatar
          ownerId={profile.id}
          ownerRole={profile.role}
          avatarPath={profile.avatar_path}
          fullName={profile.full_name}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-white">
              {profile.full_name?.trim() || 'LovethDev Member'}
            </h3>
            <RoleBadge role={profile.role} />
          </div>
          <p className="mt-2 line-clamp-3 text-sm text-slate-400">
            {profile.bio?.trim() || 'No bio yet.'}
          </p>
        </div>
      </div>
      <Link to={`/users/${profile.id}`} className="mt-5">
        <Button variant="secondary" size="sm" className="w-full">
          View Profile
        </Button>
      </Link>
    </Card>
  )
}
