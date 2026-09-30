"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { RoleBadge } from "@/components/profile/role-badge";
import { createClient } from "@/lib/supabase/client";
import { listProfiles } from "@/lib/profiles";
import type { Profile } from "@/lib/roles";

export function UsersDirectory() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const supabase = createClient();
        const rows = await listProfiles(supabase);
        if (!cancelled) setProfiles(rows);
      } catch {
        if (!cancelled) setError("Unable to load profiles right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass h-56 animate-pulse rounded-2xl"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {error}
      </p>
    );
  }

  if (!profiles.length) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
        No profiles available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile) => (
        <article
          key={profile.id}
          className="glass group flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-glow"
        >
          <div className="flex items-start gap-4">
            <ProfileAvatar profile={profile} size="md" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-white">
                {profile.full_name || "LovethDev Member"}
              </h2>
              <div className="mt-2">
                <RoleBadge role={profile.role} />
              </div>
            </div>
          </div>

          <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400">
            {profile.bio?.trim() || "No bio yet."}
          </p>

          <Link
            href={`/users/${profile.user_id}`}
            className="btn-secondary mt-5 w-full justify-center !py-2.5 text-sm"
          >
            View Profile
          </Link>
        </article>
      ))}
    </div>
  );
}
