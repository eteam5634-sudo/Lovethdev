"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AppRole } from "@/lib/roles";

function credentialsForRole(role: AppRole): { email: string; password: string } | null {
  const map = {
    member: {
      email: process.env.TEST_MEMBER_EMAIL?.trim() ?? "",
      password: process.env.TEST_MEMBER_PASSWORD ?? "",
    },
    admin: {
      email: process.env.TEST_ADMIN_EMAIL?.trim() ?? "",
      password: process.env.TEST_ADMIN_PASSWORD ?? "",
    },
    super_admin: {
      email: process.env.TEST_SUPER_ADMIN_EMAIL?.trim() ?? "",
      password: process.env.TEST_SUPER_ADMIN_PASSWORD ?? "",
    },
  } as const;

  const creds = map[role];
  if (!creds.email || !creds.password) return null;
  return creds;
}

/** Prefill-only email (never returns passwords). Safe for client display. */
export async function getTestAccountEmail(role: AppRole): Promise<string | null> {
  const map = {
    member: process.env.TEST_MEMBER_EMAIL?.trim() ?? "",
    admin: process.env.TEST_ADMIN_EMAIL?.trim() ?? "",
    super_admin: process.env.TEST_SUPER_ADMIN_EMAIL?.trim() ?? "",
  } as const;
  const email = map[role];
  return email || null;
}

/**
 * One-click test sign-in using server-only TEST_* credentials.
 * Passwords never leave the server.
 */
export async function signInAsTestRole(
  role: AppRole,
): Promise<{ ok: true } | { ok: false; error: string; email?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Authentication is not configured." };
  }

  const creds = credentialsForRole(role);
  if (!creds) {
    const email = await getTestAccountEmail(role);
    return {
      ok: false,
      error:
        "Test account credentials are not configured on the server. Add TEST_*_EMAIL and TEST_*_PASSWORD to private env vars (never NEXT_PUBLIC_).",
      email: email ?? undefined,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: creds.email,
      password: creds.password,
    });

    if (error) {
      return {
        ok: false,
        error: "Could not sign in with the test account. Check credentials and that the account exists.",
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Server sign-in failed. Please try again." };
  }
}
