"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { RoleBadge } from "@/components/profile/role-badge";
import { useProfile } from "@/components/profile/profile-provider";
import { createClient } from "@/lib/supabase/client";
import { listProfiles } from "@/lib/profiles";
import { roleLabel, type Profile } from "@/lib/roles";

export function ProfileUsersPanel() {
  const { role } = useProfile();
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
        if (!cancelled) setError("Unable to load registered users.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hint =
    role === "admin"
      ? "You can view members and admins. Super Admin accounts are hidden."
      : role === "super_admin"
        ? "You can view every registered member, admin, and super admin."
        : "Browse registered LovethDev users and open their profiles.";

  return (
    <div className="glass mt-6 rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-300" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white">Registered users</h2>
          </div>
          <p className="text-sm text-slate-400">{hint}</p>
        </div>
        <Link href="/users" className="btn-secondary !px-4 !py-2 text-sm">
          Open full directory
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading users...</p>
      ) : error ? (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : profiles.length === 0 ? (
        <p className="text-sm text-slate-500">No other users found yet.</p>
      ) : (
        <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
          {profiles.slice(0, 8).map((user) => (
            <li key={user.id} className="flex items-center gap-3 px-3 py-3">
              <ProfileAvatar profile={user} size="sm" className="!h-10 !w-10" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user.full_name?.trim() || "LovethDev Member"}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
              <Link
                href={`/users/${user.user_id}`}
                className="shrink-0 text-sm text-cyan-300 hover:text-cyan-200"
                aria-label={`View ${user.full_name ?? roleLabel(user.role)}`}
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}

      {profiles.length > 8 ? (
        <p className="mt-3 text-xs text-slate-500">
          Showing 8 of {profiles.length}. Open the full directory to see everyone.
        </p>
      ) : null}
    </div>
  );
}
