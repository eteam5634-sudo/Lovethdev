"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getAuthErrorMessage,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth-errors";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const { updatePassword, configured } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!configured || !isSupabaseConfigured()) {
      setChecking(false);
      return;
    }

    const supabase = createClient();
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
        setChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) setReady(true);
      setChecking(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!password) next.password = "New password is required.";
    else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    if (!ready) {
      setError(
        "This password reset link is invalid or has expired. Request a new one.",
      );
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);

    if (updateError) {
      setError(getAuthErrorMessage(updateError));
      return;
    }

    setSuccess("Password updated successfully. Redirecting to dashboard...");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Choose a new password for your LovethDev account."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error ? <AuthAlert type="error" message={error} /> : null}
        {success ? <AuthAlert type="success" message={success} /> : null}

        {checking ? (
          <AuthAlert type="success" message="Checking your reset session..." />
        ) : null}

        {!checking && !ready ? (
          <AuthAlert
            type="error"
            message="Open this page from your password reset email link to continue."
          />
        ) : null}

        <AuthInput
          label="New Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          required
        />
        <AuthInput
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          required
        />

        <button
          type="submit"
          className="btn-primary w-full justify-center"
          disabled={submitting || !ready}
        >
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Need a new link?{" "}
        <Link
          href="/forgot-password"
          className="font-medium text-cyan-300 hover:text-cyan-200"
        >
          Request reset
        </Link>
      </p>
    </AuthShell>
  );
}
