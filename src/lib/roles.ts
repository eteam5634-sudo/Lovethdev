export type AppRole = 'member' | 'admin' | 'super_admin'

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  role: AppRole
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export function isAppRole(value: string): value is AppRole {
  return value === 'member' || value === 'admin' || value === 'super_admin'
}

export function roleLabel(role: AppRole): string {
  switch (role) {
    case 'member':
      return 'Member'
    case 'admin':
      return 'Admin'
    case 'super_admin':
      return 'Super Admin'
  }
}

export function isMember(role: AppRole | null | undefined): boolean {
  return role === 'member'
}

export function isAdmin(role: AppRole | null | undefined): boolean {
  return role === 'admin'
}

export function isSuperAdmin(role: AppRole | null | undefined): boolean {
  return role === 'super_admin'
}

/**
 * Image visibility rules (enforced by Storage RLS; mirrored for UI placeholders):
 * - member / super_admin: all images
 * - admin: member + admin only (NOT super_admin)
 */
export function canViewProfileImage(
  viewerRole: AppRole | null | undefined,
  ownerRole: AppRole | null | undefined,
  viewerId?: string | null,
  ownerId?: string | null,
): boolean {
  if (!viewerRole || !ownerRole) return false
  if (viewerId && ownerId && viewerId === ownerId) return true
  if (viewerRole === 'member' || viewerRole === 'super_admin') return true
  if (viewerRole === 'admin') return ownerRole === 'member' || ownerRole === 'admin'
  return false
}
