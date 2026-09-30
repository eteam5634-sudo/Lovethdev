export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
  return { url, key };
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabaseEnv();
  return Boolean(url && key && !url.includes("your_supabase") && !key.includes("your_supabase"));
}

export const SUPABASE_CONFIG_ERROR =
  "Authentication is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";
