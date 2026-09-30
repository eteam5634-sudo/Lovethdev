"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSignedAvatarUrl } from "@/lib/profiles";
import { useProfile } from "@/components/profile/profile-provider";
import { useAuth } from "@/components/auth/auth-provider";
import type { Profile } from "@/lib/roles";

type ProfileAvatarProps = {
  profile: Profile;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-28 w-28",
};

export function ProfileAvatar({
  profile,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  const { role } = useProfile();
  const { user } = useAuth();
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(profile.avatar_url));
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!profile.avatar_url) {
        setUrl(null);
        setUnavailable(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setUnavailable(false);

      try {
        const supabase = createClient();
        const signed = await getSignedAvatarUrl(
          supabase,
          profile,
          role,
          user?.id ?? null,
        );
        if (cancelled) return;
        if (!signed) {
          setUrl(null);
          setUnavailable(true);
        } else {
          setUrl(signed);
          setUnavailable(false);
        }
      } catch {
        if (!cancelled) {
          setUrl(null);
          setUnavailable(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [profile, role, user?.id]);

  if (loading) {
    return (
      <div
        className={`${sizeClass[size]} animate-pulse rounded-full border border-white/10 bg-white/5 ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (unavailable) {
    return (
      <div
        className={`${sizeClass[size]} flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-center text-[10px] leading-tight text-slate-400 sm:text-xs ${className}`}
        role="img"
        aria-label="Profile image unavailable"
        title="Profile image unavailable"
      >
        Private
      </div>
    );
  }

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={`${profile.full_name || "User"} profile photo`}
        className={`${sizeClass[size]} rounded-full border border-white/15 object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass[size]} flex items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200 ${className}`}
      aria-hidden="true"
    >
      <UserRound className="h-1/2 w-1/2" />
    </div>
  );
}
