"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getAuthErrorMessage } from "@/lib/auth-errors";

export function DashboardContent() {
  const { user, displayName, loading, signOut } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setError("");
    setSigningOut(true);
    const { error: signOutError } = await signOut();
    setSigningOut(false);

    if (signOutError) {
      setError(getAuthErrorMessage(signOutError));
      return;
    }

    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400">Checking your session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container-narrow px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-violet-300">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-2 text-slate-400">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="btn-secondary inline-flex"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>

      {error ? (
        <p className="mb-6 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <article className="glass rounded-2xl p-6 shadow-glow sm:p-8">
          <h2 className="text-xl font-semibold text-white">Welcome to LovethDev</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            You&apos;re signed in successfully.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            Back to Portfolio
          </Link>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/users" className="btn-secondary inline-flex !py-2.5 text-sm">
              Community
            </Link>
            <Link href="/profile" className="btn-secondary inline-flex !py-2.5 text-sm">
              Edit Profile
            </Link>
          </div>
        </article>

        <article className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3 text-slate-300">
              <UserRound className="mt-0.5 h-4 w-4 text-violet-300" aria-hidden="true" />
              <span>
                <span className="block text-slate-500">Name</span>
                {displayName}
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <Mail className="mt-0.5 h-4 w-4 text-cyan-300" aria-hidden="true" />
              <span>
                <span className="block text-slate-500">Email</span>
                {user.email}
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 text-emerald-300"
                aria-hidden="true"
              />
              <span>
                <span className="block text-slate-500">Account status</span>
                {user.email_confirmed_at ? "Verified" : "Pending email confirmation"}
              </span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  );
}
