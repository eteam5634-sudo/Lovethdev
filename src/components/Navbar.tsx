import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, Sparkles, Users, UserRound, X } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { useProfile } from '../lib/ProfileContext'
import { roleLabel } from '../lib/roles'
import { Button } from './ui/Button'
import { RoleBadge } from './profile/RoleBadge'
import { ProfileAvatar } from './profile/ProfileAvatar'

const sectionLinks = [
  { href: '/#playground', hash: 'playground', label: 'Playground' },
  { href: '/#projects', hash: 'projects', label: 'Projects' },
  { href: '/#experiments', hash: 'experiments', label: 'Experiments' },
  { href: '/#components', hash: 'components', label: 'Components' },
  { href: '/#about', hash: 'about', label: 'About' },
  { href: '/#contact', hash: 'contact', label: 'Contact' },
]

export function Navbar() {
  const { user, loading, signOut, displayName } = useAuth()
  const { profile, role } = useProfile()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('playground')
  const [signingOut, setSigningOut] = useState(false)
  const [signedOutNotice, setSignedOutNotice] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
      if (!isHome) return

      let current = 'playground'
      for (const link of sectionLinks) {
        const el = document.getElementById(link.hash)
        if (!el) continue
        if (el.getBoundingClientRect().top <= 120) current = link.hash
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    setSigningOut(false)
    setOpen(false)
    setSignedOutNotice(true)
    navigate('/login', { replace: true, state: { message: 'Signed out successfully.' } })
  }

  const name = profile?.full_name?.trim() || displayName

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary"
          className={`glass flex items-center justify-between rounded-2xl px-4 py-3 transition sm:px-5 ${
            scrolled ? 'border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.35)]' : ''
          }`}
        >
          <Link
            to="/"
            className="group flex items-center gap-2 text-lg font-bold tracking-tight text-white"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-cyan-400 to-pink-500 text-sm text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
              L
            </span>
            <span>
              Loveth<span className="text-gradient">Dev</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isHome && active === link.hash
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {!loading && user ? (
              <>
                <div className="mr-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
                  {profile ? (
                    <ProfileAvatar
                      ownerId={profile.user_id}
                      ownerRole={profile.role}
                      avatarPath={profile.avatar_url}
                      fullName={profile.full_name}
                      size="sm"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                      <UserRound className="h-4 w-4 text-slate-300" />
                    </span>
                  )}
                  <div className="min-w-0 leading-tight">
                    <p className="max-w-[9rem] truncate text-xs font-medium text-white">{name}</p>
                    {role ? (
                      <p className="text-[11px] text-slate-400">{roleLabel(role)}</p>
                    ) : (
                      <p className="text-[11px] text-slate-500">Loading role...</p>
                    )}
                  </div>
                  {role ? <RoleBadge role={role} /> : null}
                </div>
                <NavLink to="/dashboard">
                  {({ isActive }) => (
                    <Button size="sm" variant={isActive ? 'aurora' : 'secondary'}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  )}
                </NavLink>
                <NavLink to="/profile">
                  {({ isActive }) => (
                    <Button size="sm" variant={isActive ? 'secondary' : 'ghost'}>
                      <UserRound className="h-4 w-4" />
                      Profile
                    </Button>
                  )}
                </NavLink>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </>
            ) : !loading ? (
              <Link to="/login">
                <Button size="sm" variant="aurora">
                  Sign In
                </Button>
              </Link>
            ) : (
              <span className="px-2 text-xs text-slate-500">Loading...</span>
            )}
            {isHome && !user ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <Sparkles className="h-4 w-4" />
                Explore Work
              </Button>
            ) : null}
          </div>

          <button
            type="button"
            className="rounded-xl border border-white/10 p-2 text-white lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        {signedOutNotice && !user ? (
          <p className="sr-only" role="status">
            Signed out successfully.
          </p>
        ) : null}
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`glass-strong absolute inset-x-4 top-20 max-h-[80vh] overflow-y-auto rounded-2xl p-5 transition duration-300 ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">Navigate</p>
            <button
              type="button"
              aria-label="Close navigation"
              className="rounded-lg border border-white/10 p-2 text-slate-300"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-base transition ${
                  isHome && active === link.hash
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            {!loading && user ? (
              <>
                <div className="mb-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="font-medium text-white">{name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {role ? roleLabel(role) : 'Loading role...'}
                  </p>
                </div>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full" variant="aurora">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  <Button className="w-full" variant="secondary">
                    <UserRound className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  <Button className="w-full" variant="ghost">
                    Profile Settings
                  </Button>
                </Link>
                <Link to="/users" onClick={() => setOpen(false)}>
                  <Button className="w-full" variant="secondary">
                    <Users className="h-4 w-4" />
                    User Directory
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full" variant="aurora">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full" variant="secondary">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
