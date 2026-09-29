import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`glass glow-border rounded-2xl p-5 sm:p-6 ${
        hover
          ? 'transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_36px_rgba(34,211,238,0.12)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
