export const APP_ROLES = ["member", "admin", "super_admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: AppRole;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export function isAppRole(value: unknown): value is AppRole {
  return (
    typeof value === "string" &&
    (APP_ROLES as readonly string[]).includes(value)
  );
}

export function roleLabel(role: AppRole): string {
  switch (role) {
    case "member":
      return "Member";
    case "admin":
      return "Admin";
    case "super_admin":
      return "Super Admin";
    default:
      return "Member";
  }
}

export function canViewerSeeAvatar(
  viewerRole: AppRole | null | undefined,
  ownerRole: AppRole,
  isOwner: boolean,
): boolean {
  if (isOwner) return true;
  if (!viewerRole) return false;
  if (viewerRole === "member" || viewerRole === "super_admin") return true;
  if (viewerRole === "admin") return ownerRole !== "super_admin";
  return false;
}

export const PROFILE_IMAGE_BUCKET = "profile-images";
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const ALLOWED_AVATAR_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export function avatarObjectPath(userId: string, fileName: string): string {
  const ext = fileName.includes(".")
    ? fileName.split(".").pop()?.toLowerCase()
    : "jpg";
  const safeExt =
    ext === "png" || ext === "webp" || ext === "jpeg" || ext === "jpg"
      ? ext === "jpeg"
        ? "jpg"
        : ext
      : "jpg";
  return `${userId}/avatar.${safeExt}`;
}
