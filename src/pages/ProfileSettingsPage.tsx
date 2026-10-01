import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  deleteOwnAvatar,
  deleteOwnProfile,
  MAX_AVATAR_BYTES,
  updateOwnProfile,
  uploadOwnAvatar,
} from '../lib/profiles'
import { useProfile } from '../lib/ProfileContext'
import { ProfileAvatar } from '../components/profile/ProfileAvatar'
import { RoleBadge } from '../components/profile/RoleBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { AuthInput } from '../components/auth/AuthInput'

export function ProfileSettingsPage() {
  const navigate = useNavigate()
  const { profile, loading, refreshProfile } = useProfile()
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingImage, setDeletingImage] = useState(false)
  const [deletingProfile, setDeletingProfile] = useState(false)

  useEffect(() => {
    document.title = 'My Profile | LovethDev Playground'
  }, [])

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setBio(profile.bio ?? '')
    }
  }, [profile])

  const onSave = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setSaving(true)
    const result = await updateOwnProfile({ full_name: fullName, bio })
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setMessage('Profile updated successfully.')
    await refreshProfile()
  }

  const onUpload = async (file: File | null) => {
    if (!file) return
    setError(null)
    setMessage(null)
    setUploading(true)
    const result = await uploadOwnAvatar(file)
    setUploading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setMessage('Profile image updated.')
    await refreshProfile()
  }

  const onDeleteImage = async () => {
    setError(null)
    setMessage(null)
    setDeletingImage(true)
    const result = await deleteOwnAvatar()
    setDeletingImage(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setMessage('Profile image removed.')
    await refreshProfile()
  }

  const onDeleteProfile = async () => {
    const confirmed = window.confirm(
      'Delete your profile? This cannot be undone from this screen.',
    )
    if (!confirmed) return
    setDeletingProfile(true)
    const result = await deleteOwnProfile()
    setDeletingProfile(false)
    if (result.error) {
      setError(result.error)
      return
    }
    await refreshProfile()
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="px-4 pt-28 pb-16 text-slate-400" role="status">
        Loading your profile...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-28 pb-16">
        <Card>
          <p className="text-rose-200">Unable to load your profile.</p>
          <Button className="mt-4" variant="secondary" onClick={() => void refreshProfile()}>
            Try again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="mt-2 text-sm text-slate-400">
            Update your public LovethDev profile. Your role cannot be changed here.
          </p>
        </div>

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ProfileAvatar
              ownerId={profile.id}
              ownerRole={profile.role}
              avatarPath={profile.avatar_path}
              fullName={profile.full_name}
              size="lg"
            />
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <p className="font-medium text-white">Profile image</p>
                <RoleBadge role={profile.role} />
              </div>
              <label className="inline-flex cursor-pointer">
                <span className="sr-only">Upload profile image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                />
                <span className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                  {uploading ? 'Uploading...' : 'Upload image'}
                </span>
              </label>
              <p className="mt-2 text-xs text-slate-500">
                PNG, JPG, or WEBP up to {Math.round(MAX_AVATAR_BYTES / (1024 * 1024))}MB.
              </p>
              {profile.avatar_path ? (
                <Button
                  className="mt-3"
                  size="sm"
                  variant="ghost"
                  disabled={deletingImage}
                  onClick={() => void onDeleteImage()}
                >
                  {deletingImage ? 'Removing...' : 'Remove image'}
                </Button>
              ) : null}
            </div>
          </div>
        </Card>

        <Card>
          <form onSubmit={onSave} className="space-y-4">
            <AuthInput
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Tell the community about you..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
              />
            </label>

            <div>
              <p className="text-sm font-medium text-slate-300">Role</p>
              <p className="mt-1 text-xs text-slate-500">
                Roles are protected by the database and cannot be changed from this form.
              </p>
              <div className="mt-2">
                <RoleBadge role={profile.role} />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-300">Email</p>
              <p className="mt-1 break-all text-sm text-slate-400">{profile.email}</p>
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200" role="status">
                {message}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="aurora" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
              <Link to={`/users/${profile.id}`}>
                <Button type="button" variant="secondary">
                  View public profile
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">Danger zone</h2>
          <p className="mt-2 text-sm text-slate-400">
            Delete only your own profile record. This does not delete your auth account by itself.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            disabled={deletingProfile}
            onClick={() => void onDeleteProfile()}
          >
            {deletingProfile ? 'Deleting...' : 'Delete my profile'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
