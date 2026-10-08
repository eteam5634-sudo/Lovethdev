"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  isSupabaseConfigured,
  SUPABASE_CONFIG_ERROR,
} from "@/lib/supabase/config";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
  }) => Promise<{ error: Error | null; needsEmailConfirmation?: boolean }>;
  signIn: (params: {
    email: string;
    password: string;
  }) => Promise<{ error: Error | null }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>;
  signInWithDiscord: (redirectTo?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  displayName: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function notConfiguredError() {
  return new Error(SUPABASE_CONFIG_ERROR);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!configured) return null;
    try {
      return createClient();
    } catch {
      return null;
    }
  }, [configured]);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback(
    async ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => {
      if (!supabase) return { error: notConfiguredError() };

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (error) return { error: new Error(error.message) };

      return {
        error: null,
        needsEmailConfirmation: Boolean(data.user && !data.session),
      };
    },
    [supabase],
  );

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (!supabase) return { error: notConfiguredError() };

      const trimmedEmail = email.trim();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (!error) return { error: null };

      const loginMessage = error.message?.toLowerCase() ?? "";
      if (!loginMessage.includes("invalid login credentials")) {
        return { error: new Error(error.message) };
      }

      // New Gmail + password: create the account from the Sign In form so first-time
      // users are not blocked by "Incorrect email or password".
      const displayFromEmail = trimmedEmail.split("@")[0] || "Creator";
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: displayFromEmail,
            name: displayFromEmail,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        const signUpMessage = signUpError.message.toLowerCase();
        if (
          signUpMessage.includes("already registered") ||
          signUpMessage.includes("already been registered")
        ) {
          return {
            error: new Error(
              "Incorrect email or password. If you used Google/Discord for this Gmail, use that button or Forgot Password to set a password.",
            ),
          };
        }
        return { error: new Error(signUpError.message) };
      }

      if (data.session) return { error: null };

      // Confirmation may be required, or signup returned an obfuscated existing-user response.
      const { error: retryError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (!retryError) return { error: null };

      return {
        error: new Error(
          "Check your email to confirm this address, then sign in. If you already use Google for this Gmail, tap Continue with Google or use Forgot Password.",
        ),
      };
    },
    [supabase],
  );

  const signInWithGoogle = useCallback(
    async (redirectTo?: string) => {
      if (!supabase) return { error: notConfiguredError() };

      const next = redirectTo?.startsWith("/") ? redirectTo : "/dashboard";
      try {
        sessionStorage.setItem("lovethdev_auth_next", next);
        document.cookie = `lovethdev_auth_next=${encodeURIComponent(next)}; Path=/; Max-Age=600; SameSite=Lax`;
      } catch {
        // ignore
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      return { error: error ? new Error(error.message) : null };
    },
    [supabase],
  );

  const signInWithDiscord = useCallback(
    async (redirectTo?: string) => {
      if (!supabase) return { error: notConfiguredError() };

      const next = redirectTo?.startsWith("/") ? redirectTo : "/dashboard";
      try {
        sessionStorage.setItem("lovethdev_auth_next", next);
        document.cookie = `lovethdev_auth_next=${encodeURIComponent(next)}; Path=/; Max-Age=600; SameSite=Lax`;
      } catch {
        // ignore
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error: error ? new Error(error.message) : null };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return { error: notConfiguredError() };
    const { error } = await supabase.auth.signOut();
    return { error: error ? new Error(error.message) : null };
  }, [supabase]);

  const resetPasswordForEmail = useCallback(
    async (email: string) => {
      if (!supabase) return { error: notConfiguredError() };
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      return { error: error ? new Error(error.message) : null };
    },
    [supabase],
  );

  const updatePassword = useCallback(
    async (password: string) => {
      if (!supabase) return { error: notConfiguredError() };
      const { error } = await supabase.auth.updateUser({ password });
      return { error: error ? new Error(error.message) : null };
    },
    [supabase],
  );

  const displayName = useMemo(() => {
    if (!user) return "";
    const meta = user.user_metadata as
      | { full_name?: string; name?: string }
      | undefined;
    return (
      meta?.full_name?.trim() ||
      meta?.name?.trim() ||
      user.email?.split("@")[0] ||
      "User"
    );
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      configured: Boolean(supabase),
      signUp,
      signIn,
      signInWithGoogle,
      signInWithDiscord,
      signOut,
      resetPasswordForEmail,
      updatePassword,
      displayName,
    }),
    [
      user,
      session,
      loading,
      supabase,
      signUp,
      signIn,
      signInWithGoogle,
      signInWithDiscord,
      signOut,
      resetPasswordForEmail,
      updatePassword,
      displayName,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
