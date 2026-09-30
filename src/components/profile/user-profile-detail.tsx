"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { RoleBadge } from "@/components/profile/role-badge";
import { createClient } from "@/lib/supabase/client";
import { getProfileByUserId } from "@/lib/profiles";
import type { Profile } from "@/lib/roles";

export function UserProfileDetail({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const supabase = createClient();
        const row = await getProfileByUserId(supabase, userId);
        if (!cancelled) {
          if (!row) setError("Profile not found.");
          setProfile(row);
        }
      } catch {
        if (!cancelled) setError("Unable to load this profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="glass mx-auto max-w-2xl animate-pulse rounded-3xl p-8">
        <div className="h-28 w-28 rounded-full bg-white/5" />
        <div className="mt-6 h-8 w-1/2 rounded bg-white/5" />
        <div className="mt-4 h-20 rounded bg-white/5" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-400/30 bg-rose-500/10 px-6 py-8 text-center">
        <p className="text-rose-200">{error || "Profile not found."}</p>
        <Link href="/users" className="btn-secondary mt-6 inline-flex">
          Back to Community
        </Link>
      </div>
    );
  }

  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <article className="glass-strong mx-auto max-w-2xl rounded-3xl p-6 shadow-glow sm:p-10">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <ProfileAvatar profile={profile} size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-white">
            {profile.full_name || "LovethDev Member"}
          </h1>
          <div className="mt-3">
            <RoleBadge role={profile.role} />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Bio
          </h2>
          <p className="mt-2 text-slate-300">
            {profile.bio?.trim() || "No bio yet."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
            <p className="mt-1 break-all text-sm text-slate-200">
              {profile.email || "Not available"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Joined</p>
            <p className="mt-1 text-sm text-slate-200">{joined}</p>
          </div>
        </div>
      </div>

      <Link href="/users" className="btn-secondary mt-8 inline-flex">
        Back to Community
      </Link>
    </article>
  );
}
