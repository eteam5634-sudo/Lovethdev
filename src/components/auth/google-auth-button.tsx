"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthAlert } from "@/components/auth/auth-alert";
import { getAuthErrorMessage } from "@/lib/auth-errors";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3l-.9.7-2.5 1.9C4.8 19.5 8.1 21.5 12 21.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.9-5.9-4.4z"
      />
      <path
        fill="#4A90E2"
        d="M3.2 7.1C2.4 8.7 2 10.3 2 12s.4 3.3 1.2 4.9l3.4-2.6C6.2 13.4 6 12.7 6 12s.2-1.4.6-2.3L3.2 7.1z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.5 14.7 1.5 12 1.5 8.1 1.5 4.8 3.5 3.2 7.1l3.4 2.6C7 7.4 9.2 5.5 12 5.5z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  label = "Continue with Google",
  redirectTo = "/dashboard",
  disabled = false,
}: {
  label?: string;
  redirectTo?: string;
  disabled?: boolean;
}) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onClick = async () => {
    setError("");
    setLoading(true);
    const { error: oauthError } = await signInWithGoogle(redirectTo);
    if (oauthError) {
      setError(getAuthErrorMessage(oauthError));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="btn-secondary w-full justify-center"
        onClick={onClick}
        disabled={disabled || loading}
        aria-label={label}
      >
        <GoogleIcon />
        {loading ? "Redirecting to Google..." : label}
      </button>
      {error ? <AuthAlert type="error" message={error} /> : null}
    </div>
  );
}
