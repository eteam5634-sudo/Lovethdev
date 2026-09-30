"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthInput } from "@/components/auth/auth-input";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { RoleBadge } from "@/components/profile/role-badge";
import { useProfile } from "@/components/profile/profile-provider";
import { createClient } from "@/lib/supabase/client";
import {
  deleteOwnAvatar,
  deleteOwnProfile,
  ensureOwnProfile,
  updateOwnProfile,
  uploadOwnAvatar,
} from "@/lib/profiles";

export function ProfileSettingsForm() {
  const router = useRouter();
  const { profile, loading, refreshProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setBio(profile.bio ?? "");
  }, [profile]);

  useEffect(() => {
    if (loading) return;
    if (profile) return;

    void (async () => {
      try {
        const supabase = createClient();
        await ensureOwnProfile(supabase);
        await refreshProfile();
      } catch {
        // handled by empty UI below
      }
    })();
  }, [loading, profile, refreshProfile]);

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await updateOwnProfile(supabase, {
      full_name: fullName,
      bio,
    });
    setSaving(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    setSuccess("Profile updated successfully.");
    await refreshProfile();
  };

  const onUpload = async (file: File | null) => {
    if (!file) return;
    setError("");
    setSuccess("");
    setUploading(true);
    const supabase = createClient();
    const { error: uploadError } = await uploadOwnAvatar(supabase, file);
    setUploading(false);

    if (uploadError) {
      setError(uploadError);
      return;
    }

    setSuccess("Profile image updated.");
    await refreshProfile();
  };

  const onDeleteImage = async () => {
    setError("");
    setSuccess("");
    setDeletingImage(true);
    const supabase = createClient();
    const { error: deleteError } = await deleteOwnAvatar(supabase);
    setDeletingImage(false);

    if (deleteError) {
      setError(deleteError);
      return;
    }

    setSuccess("Profile image removed.");
    await refreshProfile();
  };

  const onDeleteProfile = async () => {
    const confirmed = window.confirm(
      "Delete your profile? This cannot be undone from this page.",
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingProfile(true);
    const supabase = createClient();
    const { error: deleteError } = await deleteOwnProfile(supabase);
    setDeletingProfile(false);

    if (deleteError) {
      setError(deleteError);
      return;
    }

    await refreshProfile();
    router.push("/dashboard");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="glass mx-auto max-w-2xl animate-pulse rounded-3xl p-8">
        <div className="h-28 w-28 rounded-full bg-white/5" />
        <div className="mt-6 h-10 rounded bg-white/5" />
        <div className="mt-4 h-24 rounded bg-white/5" />
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        Unable to load your profile. Try signing out and back in.
      </p>
    );
  }

  return (
    <div className="glass-strong mx-auto max-w-2xl rounded-3xl p-6 shadow-glow sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProfileAvatar profile={profile} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Update your public LovethDev profile. Your role cannot be changed here.
          </p>
          <div className="mt-3">
            <RoleBadge role={profile.role} />
          </div>
        </div>
      </div>

      <form onSubmit={onSave} className="mt-8 space-y-4" noValidate>
        {error ? <AuthAlert type="error" message={error} /> : null}
        {success ? <AuthAlert type="success" message={success} /> : null}

        <AuthInput
          label="Full Name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label htmlFor="bio" className="block text-sm font-medium text-slate-300">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/[0.07] focus:shadow-glow-sm"
            placeholder="Tell the community about yourself..."
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-slate-300">Email</p>
          <p className="mt-1 break-all text-sm text-slate-400">
            {profile.email || "Not available"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Email is managed by authentication and is not editable here.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-slate-300">Role</p>
          <p className="mt-2">
            <RoleBadge role={profile.role} />
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Roles are assigned securely and cannot be self-promoted.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-slate-300">Profile image</p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
            disabled={uploading}
            className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-500"
          />
          <p className="text-xs text-slate-500">PNG, JPG, or WEBP. Max 2MB.</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void onDeleteImage()}
              disabled={deletingImage || !profile.avatar_url}
              className="btn-secondary !px-4 !py-2 text-xs"
            >
              {deletingImage ? "Removing..." : "Remove image"}
            </button>
            {uploading ? (
              <span className="self-center text-xs text-cyan-300">Uploading...</span>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full justify-center"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <div className="mt-8 border-t border-white/10 pt-6">
        <h2 className="text-sm font-semibold text-rose-300">Danger zone</h2>
        <p className="mt-2 text-sm text-slate-400">
          Delete your own profile record and avatar files.
        </p>
        <button
          type="button"
          onClick={() => void onDeleteProfile()}
          disabled={deletingProfile}
          className="mt-4 inline-flex rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
        >
          {deletingProfile ? "Deleting..." : "Delete my profile"}
        </button>
      </div>
    </div>
  );
}
