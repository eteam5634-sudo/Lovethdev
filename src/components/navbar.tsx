"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useProfile } from "@/components/profile/profile-provider";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { RoleBadge } from "@/components/profile/role-badge";
import { roleLabel } from "@/lib/roles";
import { navLinks } from "@/data/skills";

export function Navbar() {
  const { user, loading, signOut, displayName } = useAuth();
  const { profile, role } = useProfile();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isHome = pathname === "/";
  const name = profile?.full_name?.trim() || displayName;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const closeMenu = () => setOpen(false);

  const sectionHref = (hashHref: string) =>
    isHome ? hashHref : `/${hashHref}`;

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    closeMenu();
    router.replace("/login?signedOut=1");
    router.refresh();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-[#05050f]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="container-narrow flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group relative z-50 text-xl font-bold tracking-tight text-white transition-colors hover:text-violet-300"
          onClick={closeMenu}
        >
          Loveth
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Dev
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={sectionHref(link.href)}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? (
            <span className="text-sm text-slate-500">Loading...</span>
          ) : user ? (
            <>
              <div className="mr-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
                {profile ? (
                  <ProfileAvatar profile={profile} size="sm" className="!h-8 !w-8" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                    <UserRound className="h-4 w-4 text-slate-300" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0 leading-tight">
                  <p className="max-w-[9rem] truncate text-xs font-medium text-white">{name}</p>
                  <p className="text-[11px] text-slate-400">
                    {role ? roleLabel(role) : "Loading role..."}
                  </p>
                </div>
                {role ? <RoleBadge role={role} /> : null}
              </div>
              <Link
                href="/dashboard"
                className="btn-primary !px-4 !py-2 text-sm"
                aria-label="Open dashboard"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="btn-secondary !px-4 !py-2 text-sm"
                aria-label="Open profile settings"
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="btn-secondary !px-4 !py-2 text-sm"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary !px-5 !py-2.5 text-sm" aria-label="Sign in">
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-[#05050f]/95 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-center gap-2 px-6 pt-16">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={sectionHref(link.href)}
              onClick={closeMenu}
              className="rounded-xl border border-transparent px-4 py-3 text-2xl font-medium text-white transition-all hover:border-white/10 hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            {loading ? (
              <p className="px-4 text-slate-400">Loading...</p>
            ) : user ? (
              <>
                <div className="mb-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="font-medium text-white">{name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {role ? roleLabel(role) : "Loading role..."}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-xl text-white hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-xl text-white hover:bg-white/5"
                >
                  Profile
                </Link>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-xl text-white hover:bg-white/5"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/users"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-xl text-white hover:bg-white/5"
                >
                  User Directory
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="btn-secondary w-full justify-center"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {signingOut ? "Signing out..." : "Sign Out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="btn-primary w-full justify-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="btn-secondary w-full justify-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
