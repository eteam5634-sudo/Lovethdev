"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { getAuthErrorMessage, isValidEmail } from "@/lib/auth-errors";

export function ForgotPasswordForm() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldError("");

    if (!email.trim()) {
      setFieldError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setFieldError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await resetPasswordForEmail(email);
    setSubmitting(false);

    if (resetError) {
      setError(getAuthErrorMessage(resetError));
      return;
    }

    setSuccess(
      "If an account exists for that email, a password reset link has been sent. Check your inbox.",
    );
  };

  return (
    <AuthShell
      title="Forgot Your Password?"
      subtitle="Enter your email and we'll send you a secure reset link."
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
          error={fieldError}
          required
        />

        <button
          type="submit"
          className="btn-primary w-full justify-center"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
