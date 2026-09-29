import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
  tone?: 'default' | 'cyan' | 'purple' | 'pink'
}

const tones = {
  default: 'border-white/10 bg-white/5 text-slate-300',
  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  purple: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  pink: 'border-pink-400/30 bg-pink-400/10 text-pink-200',
}

export function Badge({ children, className = '', tone = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
