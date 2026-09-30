import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ALLOWED_AVATAR_TYPES,
  MAX_AVATAR_BYTES,
  PROFILE_IMAGE_BUCKET,
  avatarObjectPath,
  canViewerSeeAvatar,
  isAppRole,
  type AppRole,
  type Profile,
} from "@/lib/roles";

function mapProfile(row: Record<string, unknown>): Profile | null {
  if (!row || typeof row.user_id !== "string" || typeof row.id !== "string") {
    return null;
  }
  if (!isAppRole(row.role)) return null;

  return {
    id: row.id,
    user_id: row.user_id,
    full_name: (row.full_name as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    role: row.role,
    avatar_url: (row.avatar_url as string | null) ?? null,
    bio: (row.bio as string | null) ?? null,
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function getCurrentProfile(
  supabase: SupabaseClient,
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return mapProfile(data as Record<string, unknown>);
}

export async function getCurrentRole(
  supabase: SupabaseClient,
): Promise<AppRole | null> {
  const profile = await getCurrentProfile(supabase);
  return profile?.role ?? null;
}

export async function listProfiles(
  supabase: SupabaseClient,
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data
    .map((row) => mapProfile(row as Record<string, unknown>))
    .filter((p): p is Profile => Boolean(p));
}

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapProfile(data as Record<string, unknown>);
}

export async function ensureOwnProfile(
  supabase: SupabaseClient,
): Promise<Profile | null> {
  const existing = await getCurrentProfile(supabase);
  if (existing) return existing;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: user.email,
      full_name:
        (user.user_metadata as { full_name?: string } | undefined)?.full_name ??
        user.email?.split("@")[0] ??
        "Member",
      role: "member",
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    // Trigger may have created it concurrently
    return getCurrentProfile(supabase);
  }

  return mapProfile(data as Record<string, unknown>);
}

export async function updateOwnProfile(
  supabase: SupabaseClient,
  updates: { full_name?: string; bio?: string | null; avatar_url?: string | null },
): Promise<{ profile: Profile | null; error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { profile: null, error: "You must be signed in." };

  const payload: Record<string, unknown> = {};
  if (typeof updates.full_name === "string") payload.full_name = updates.full_name.trim();
  if ("bio" in updates) payload.bio = updates.bio?.trim() || null;
  if ("avatar_url" in updates) payload.avatar_url = updates.avatar_url;

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("user_id", user.id)
    .select("*")
    .maybeSingle();

  if (error) {
    return {
      profile: null,
      error: friendlyDbError(error.message),
    };
  }

  return {
    profile: data ? mapProfile(data as Record<string, unknown>) : null,
    error: null,
  };
}

export async function deleteOwnProfile(
  supabase: SupabaseClient,
): Promise<{ error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  // Best-effort remove own images first
  const folder = `${user.id}`;
  const { data: files } = await supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .list(folder);

  if (files?.length) {
    await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .remove(files.map((f) => `${folder}/${f.name}`));
  }

  const { error } = await supabase.from("profiles").delete().eq("user_id", user.id);
  if (error) return { error: friendlyDbError(error.message) };
  return { error: null };
}

export async function uploadOwnAvatar(
  supabase: SupabaseClient,
  file: File,
): Promise<{ path: string | null; error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { path: null, error: "You must be signed in." };

  if (!ALLOWED_AVATAR_TYPES.includes(file.type as (typeof ALLOWED_AVATAR_TYPES)[number])) {
    return { path: null, error: "Use a PNG, JPG, or WEBP image." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { path: null, error: "Image must be 2MB or smaller." };
  }

  const path = avatarObjectPath(user.id, file.name);

  // Remove previous avatars in folder
  const { data: existing } = await supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .list(user.id);
  if (existing?.length) {
    await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .remove(existing.map((f) => `${user.id}/${f.name}`));
  }

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { path: null, error: friendlyDbError(uploadError.message) };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: path })
    .eq("user_id", user.id);

  if (updateError) {
    return { path: null, error: friendlyDbError(updateError.message) };
  }

  return { path, error: null };
}

export async function deleteOwnAvatar(
  supabase: SupabaseClient,
): Promise<{ error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: existing } = await supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .list(user.id);
  if (existing?.length) {
    await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .remove(existing.map((f) => `${user.id}/${f.name}`));
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("user_id", user.id);

  if (error) return { error: friendlyDbError(error.message) };
  return { error: null };
}

export async function getSignedAvatarUrl(
  supabase: SupabaseClient,
  profile: Profile,
  viewerRole: AppRole | null,
  viewerUserId: string | null,
): Promise<string | null> {
  if (!profile.avatar_url) return null;

  const allowed = canViewerSeeAvatar(
    viewerRole,
    profile.role,
    Boolean(viewerUserId && viewerUserId === profile.user_id),
  );
  if (!allowed) return null;

  // Prefer RPC check as defense-in-depth before requesting a signed URL
  const { data: allowedByDb, error: rpcError } = await supabase.rpc(
    "can_view_profile_image",
    { owner_user_id: profile.user_id },
  );
  if (rpcError || !allowedByDb) return null;

  const { data, error } = await supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .createSignedUrl(profile.avatar_url, 60 * 10);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

function friendlyDbError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("role changes are not permitted")) {
    return "You don't have permission to change roles.";
  }
  if (lower.includes("row-level security") || lower.includes("violates row-level")) {
    return "You don't have permission to perform this action.";
  }
  if (lower.includes("jwt") || lower.includes("not authenticated")) {
    return "Please sign in again.";
  }
  return "Something went wrong. Please try again.";
}

export function isMember(role: AppRole | null | undefined): boolean {
  return role === "member";
}
export function isAdmin(role: AppRole | null | undefined): boolean {
  return role === "admin";
}
export function isSuperAdmin(role: AppRole | null | undefined): boolean {
  return role === "super_admin";
}
