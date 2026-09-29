import { Github, Instagram, Linkedin, Mail } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionHeading } from './ui/SectionHeading'

const links = [
  {
    label: 'Email Me',
    href: 'mailto:lovethdev@example.com',
    icon: Mail,
    variant: 'primary' as const,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/eteam5634-sudo',
    icon: Github,
    variant: 'secondary' as const,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
    variant: 'secondary' as const,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: Linkedin,
    variant: 'secondary' as const,
  },
]

export function Contact() {
  const { ref, visible } = useScrollReveal()

  return (
    <section id="contact" className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="contact-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <div className="glass glow-border relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -top-16 right-0 h-48 w-48 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <SectionHeading
              title="Have an Idea?"
              description="Let's turn your next idea into something people can interact with."
            />
            <h2 id="contact-heading" className="sr-only">
              Have an Idea?
            </h2>

            <div className="flex flex-wrap gap-3">
              {links.map((link) => {
                const Icon = link.icon
                const isMail = link.href.startsWith('mailto:')
                const styles =
                  link.variant === 'primary'
                    ? 'bg-white text-slate-950 hover:bg-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)]'
                    : 'glass text-white hover:border-cyan-400/40 hover:bg-white/5'
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={isMail ? undefined : '_blank'}
                    rel={isMail ? undefined : 'noopener noreferrer'}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition duration-300 sm:text-base ${styles}`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
