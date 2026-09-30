import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AuroraBackground } from '../AuroraBackground'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 py-10 sm:px-6 sm:py-14">
      <AuroraBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 text-xl font-bold tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-cyan-400 to-pink-500 text-sm text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
            L
          </span>
          <span>
            Loveth<span className="text-gradient">Dev</span>
          </span>
        </Link>

        <div className="glass glow-border w-full rounded-3xl border border-white/10 p-6 shadow-[0_0_50px_rgba(124,58,237,0.18)] sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">{subtitle}</p>
          </div>
          {children}
          {footer ? <div className="mt-6 text-center text-sm text-slate-400">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}
