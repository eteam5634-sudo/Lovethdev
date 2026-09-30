"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  ensureOwnProfile,
  getCurrentProfile,
  isAdmin,
  isMember,
  isSuperAdmin,
} from "@/lib/profiles";
import type { AppRole, Profile } from "@/lib/roles";

type ProfileContextValue = {
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  isMember: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured() || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      let next = await getCurrentProfile(supabase);
      if (!next) {
        next = await ensureOwnProfile(supabase);
      }
      setProfile(next);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void refreshProfile();
  }, [authLoading, refreshProfile]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      role: profile?.role ?? null,
      loading: authLoading || loading,
      refreshProfile,
      isMember: isMember(profile?.role),
      isAdmin: isAdmin(profile?.role),
      isSuperAdmin: isSuperAdmin(profile?.role),
    }),
    [profile, authLoading, loading, refreshProfile],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
