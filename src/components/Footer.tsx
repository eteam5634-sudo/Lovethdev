import { Github, Instagram, Linkedin } from 'lucide-react'

const footerLinks = [
  { href: '#playground', label: 'Playground' },
  { href: '#projects', label: 'Projects' },
  { href: '#experiments', label: 'Experiments' },
  { href: '#components', label: 'Components' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const socials = [
  { href: 'https://github.com/eteam5634-sudo', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_auto]">
          <div>
            <a href="#playground" className="text-2xl font-bold text-white">
              Loveth<span className="text-gradient">Dev</span>
            </a>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              Build. Experiment. Learn. Repeat.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Navigate
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Social
            </p>
            <div className="flex gap-2">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-slate-500 sm:text-sm">
          © 2026 LovethDev. Built with curiosity and code.
        </div>
      </div>
    </footer>
  )
}
