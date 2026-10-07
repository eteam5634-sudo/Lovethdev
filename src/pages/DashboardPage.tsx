import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Beaker,
  Boxes,
  LayoutDashboard,
  LogOut,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { useProfile } from '../lib/ProfileContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { RoleBadge } from '../components/profile/RoleBadge'

export function DashboardPage() {
  const { user, displayName, signOut } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Dashboard | LovethDev Playground'
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    setError(null)
    const result = await signOut()
    setSigningOut(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate('/login', { replace: true, state: { message: 'Signed out successfully.' } })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge tone="cyan" className="mb-3 tracking-[0.16em]">
              DASHBOARD
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Playground Hub
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
              Signed in and ready to explore experiments, projects, and interactive builds.
            </p>
          </div>
          <Link to="/">
            <Button variant="secondary" size="sm">
              Back to Playground
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="md:col-span-2">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Welcome, {profile?.full_name?.trim() || displayName}
            </h2>
            <p className="mt-2 text-sm text-slate-400">{user?.email}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-400">Role:</span>
              {profile ? (
                <RoleBadge role={profile.role} />
              ) : (
                <span className="text-sm text-slate-500">Loading role...</span>
              )}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-xl font-semibold text-white">Account</h2>
              <Badge tone="cyan">Authenticated</Badge>
              {profile ? <RoleBadge role={profile.role} /> : null}
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="text-slate-200">{profile?.full_name || displayName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="break-all text-slate-200">{user?.email}</dd>
              </div>
            </dl>
          </Card>

          <Card className="md:col-span-2">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 text-slate-950">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-white">Explore the Playground</h2>
            <p className="mt-2 text-sm text-slate-400">
              Jump back into the creative surface of LovethDev.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Link to="/users" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10">
                User Directory
              </Link>
              <Link to="/profile" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10">
                My Profile
              </Link>
              <Link to="/#projects" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10">
                Projects
              </Link>
              <Link to="/#experiments" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10">
                <span className="inline-flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-cyan-300" />
                  UI Experiments
                </span>
              </Link>
              <Link to="/#miniapps" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10">
                Mini Apps
              </Link>
              <Link to="/#components" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/10">
                <span className="inline-flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-violet-300" />
                  Component Lab
                </span>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-white">Account Actions</h2>
            <p className="mt-2 text-sm text-slate-400">Securely end your session anytime.</p>
            {error ? (
              <p className="mt-3 text-sm text-rose-300" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              className="mt-5 w-full"
              variant="secondary"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
