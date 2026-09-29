import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'aurora'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-slate-950 hover:bg-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)]',
  secondary:
    'glass text-white hover:border-cyan-400/40 hover:bg-white/5',
  ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5',
  aurora:
    'text-white border border-white/10 bg-[linear-gradient(120deg,#7c3aed,#2563eb,#06b6d4,#db2777)] animate-gradient shadow-[0_0_28px_rgba(124,58,237,0.35)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
