import { getSupabaseClient } from './supabase'
import { isAppRole, type AppRole, type Profile } from './roles'

const PROFILE_SELECT =
  'id, user_id, full_name, email, role, avatar_path, bio, created_at, updated_at'

function mapProfile(row: Record<string, unknown>): Profile | null {
  if (!row || typeof row.id !== 'string' || typeof row.user_id !== 'string') return null
  if (typeof row.role !== 'string' || !isAppRole(row.role)) return null

  return {
    id: row.id,
    user_id: row.user_id,
    full_name: typeof row.full_name === 'string' ? row.full_name : null,
    email: typeof row.email === 'string' ? row.email : null,
    role: row.role,
    avatar_path: typeof row.avatar_path === 'string' ? row.avatar_path : null,
    bio: typeof row.bio === 'string' ? row.bio : null,
    created_at: typeof row.created_at === 'string' ? row.created_at : '',
    updated_at: typeof row.updated_at === 'string' ? row.updated_at : '',
  }
}

export async function getCurrentProfile(): Promise<{
  profile: Profile | null
  error: string | null
}> {
  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { profile: null, error: userError?.message ?? 'Not signed in.' }
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('id', user.id)
      .maybeSingle()

    if (error) return { profile: null, error: 'Unable to load your profile.' }
    return { profile: data ? mapProfile(data as Record<string, unknown>) : null, error: null }
  } catch {
    return { profile: null, error: 'Unable to load your profile.' }
  }
}

export async function ensureCurrentProfile(fullName?: string): Promise<{
  profile: Profile | null
  error: string | null
}> {
  const existing = await getCurrentProfile()
  if (existing.profile) return existing

  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { profile: null, error: 'Not signed in.' }

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      user_id: user.id,
      full_name:
        fullName?.trim() ||
        (typeof user.user_metadata?.full_name === 'string'
          ? user.user_metadata.full_name
          : '') ||
        '',
      email: user.email ?? null,
      role: 'member',
    })

    if (error && !error.message.toLowerCase().includes('duplicate')) {
      return { profile: null, error: 'Unable to create your profile.' }
    }

    return getCurrentProfile()
  } catch {
    return { profile: null, error: 'Unable to create your profile.' }
  }
}

export async function listProfiles(): Promise<{
  profiles: Profile[]
  error: string | null
}> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT)
      .order('created_at', { ascending: false })

    if (error) return { profiles: [], error: 'Unable to load profiles.' }

    const profiles = (data ?? [])
      .map((row) => mapProfile(row as Record<string, unknown>))
      .filter((p): p is Profile => p !== null)

    return { profiles, error: null }
  } catch {
    return { profiles: [], error: 'Unable to load profiles.' }
  }
}

export async function getProfileById(id: string): Promise<{
  profile: Profile | null
  error: string | null
}> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('id', id)
      .maybeSingle()

    if (error) return { profile: null, error: 'Unable to load this profile.' }
    return { profile: data ? mapProfile(data as Record<string, unknown>) : null, error: null }
  } catch {
    return { profile: null, error: 'Unable to load this profile.' }
  }
}

export async function updateOwnProfile(input: {
  full_name: string
  bio: string
}): Promise<{ profile: Profile | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { profile: null, error: 'Not signed in.' }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: input.full_name.trim(),
        bio: input.bio.trim(),
      })
      .eq('id', user.id)
      .select(PROFILE_SELECT)
      .maybeSingle()

    if (error) return { profile: null, error: 'Unable to update your profile.' }
    return { profile: data ? mapProfile(data as Record<string, unknown>) : null, error: null }
  } catch {
    return { profile: null, error: 'Unable to update your profile.' }
  }
}

export async function deleteOwnProfile(): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: 'Not signed in.' }

    // Remove own images first (best-effort)
    await supabase.storage.from('profile-images').remove([
      `${user.id}/avatar.png`,
      `${user.id}/avatar.jpg`,
      `${user.id}/avatar.jpeg`,
      `${user.id}/avatar.webp`,
    ])

    const { error } = await supabase.from('profiles').delete().eq('id', user.id)
    if (error) return { error: 'Unable to delete your profile.' }
    return { error: null }
  } catch {
    return { error: 'Unable to delete your profile.' }
  }
}

export async function getCurrentRole(): Promise<AppRole | null> {
  const { profile } = await getCurrentProfile()
  return profile?.role ?? null
}

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024
export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'] as const

export function avatarObjectPath(userId: string, mimeType: string): string {
  const ext =
    mimeType === 'image/png'
      ? 'png'
      : mimeType === 'image/webp'
        ? 'webp'
        : 'jpg'
  return `${userId}/avatar.${ext}`
}

export async function uploadOwnAvatar(file: File): Promise<{
  path: string | null
  error: string | null
}> {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type as (typeof ALLOWED_AVATAR_TYPES)[number])) {
    return { path: null, error: 'Please upload a PNG, JPG, or WEBP image.' }
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { path: null, error: 'Image must be 2MB or smaller.' }
  }

  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { path: null, error: 'Not signed in.' }

    const path = avatarObjectPath(user.id, file.type)

    // Clear previous extensions
    await supabase.storage.from('profile-images').remove([
      `${user.id}/avatar.png`,
      `${user.id}/avatar.jpg`,
      `${user.id}/avatar.jpeg`,
      `${user.id}/avatar.webp`,
    ])

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' })

    if (uploadError) {
      return { path: null, error: 'Unable to upload profile image.' }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_path: path })
      .eq('id', user.id)

    if (updateError) {
      return { path: null, error: 'Image uploaded, but profile could not be updated.' }
    }

    return { path, error: null }
  } catch {
    return { path: null, error: 'Unable to upload profile image.' }
  }
}

export async function deleteOwnAvatar(): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: 'Not signed in.' }

    await supabase.storage.from('profile-images').remove([
      `${user.id}/avatar.png`,
      `${user.id}/avatar.jpg`,
      `${user.id}/avatar.jpeg`,
      `${user.id}/avatar.webp`,
    ])

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_path: null })
      .eq('id', user.id)

    if (error) return { error: 'Unable to remove profile image.' }
    return { error: null }
  } catch {
    return { error: 'Unable to remove profile image.' }
  }
}

/**
 * Creates a short-lived signed URL only if Storage RLS allows the read.
 * Admins requesting super_admin images will fail here (no URL leaked).
 */
export async function getSecureAvatarUrl(
  avatarPath: string | null | undefined,
): Promise<{ url: string | null; denied: boolean; error: string | null }> {
  if (!avatarPath) return { url: null, denied: false, error: null }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage
      .from('profile-images')
      .createSignedUrl(avatarPath, 60)

    if (error || !data?.signedUrl) {
      return {
        url: null,
        denied: true,
        error: "You don't have permission to view this profile image.",
      }
    }

    return { url: data.signedUrl, denied: false, error: null }
  } catch {
    return {
      url: null,
      denied: true,
      error: "You don't have permission to view this profile image.",
    }
  }
}
