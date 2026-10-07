"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { DiscordAuthButton } from "@/components/auth/discord-auth-button";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getAuthErrorMessage,
  isValidEmail,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth-errors";

export function LoginForm() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const signedOut = searchParams.get("signedOut") === "1";
  const callbackError = searchParams.get("error") === "auth_callback";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState(
    callbackError ? "Social sign-in failed. Please try again." : "",
  );
  const [success, setSuccess] = useState(signedOut ? "Signed out successfully." : "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
    }
  }, [loading, user, nextPath, router]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    setSubmitting(true);
    const { error: signInError } = await signIn({ email, password });
    setSubmitting(false);

    if (signInError) {
      setError(getAuthErrorMessage(signInError));
      return;
    }

    setSuccess("Signed in successfully. Redirecting...");
    router.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
    router.refresh();
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue to your LovethDev dashboard."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error ? <AuthAlert type="error" message={error} /> : null}
        {success ? <AuthAlert type="success" message={success} /> : null}

        <AuthInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          required
        />
        <AuthInput
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-cyan-300 transition-colors hover:text-cyan-200"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn-primary w-full justify-center"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.14em] text-slate-500">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="space-y-2">
        <GoogleAuthButton
          label="Continue with Google"
          redirectTo={nextPath.startsWith("/") ? nextPath : "/dashboard"}
          disabled={submitting}
        />
        <DiscordAuthButton
          label="Continue with Discord"
          redirectTo={nextPath.startsWith("/") ? nextPath : "/dashboard"}
          disabled={submitting}
        />
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-cyan-300 hover:text-cyan-200">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
