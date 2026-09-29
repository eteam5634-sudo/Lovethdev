import { useEffect, useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'

const navLinks = [
  { href: '#playground', label: 'Playground' },
  { href: '#projects', label: 'Projects' },
  { href: '#experiments', label: 'Experiments' },
  { href: '#components', label: 'Components' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#playground')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)

      const sections = navLinks.map((link) => link.href.slice(1))
      let current = '#playground'

      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= 120) current = `#${id}`
      }

      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNav = (href: string) => {
    setActive(href)
    setOpen(false)
  }

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
          <a
            href="#playground"
            className="group flex items-center gap-2 text-lg font-bold tracking-tight text-white"
            onClick={() => handleNav('#playground')}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-cyan-400 to-pink-500 text-sm text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
              L
            </span>
            <span>
              Loveth<span className="text-gradient">Dev</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNav(link.href)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  active === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                aria-current={active === link.href ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              size="sm"
              variant="aurora"
              onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Sparkles className="h-4 w-4" />
              Explore Work
            </Button>
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
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`glass-strong absolute inset-x-4 top-20 rounded-2xl p-5 transition duration-300 ${
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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNav(link.href)}
                className={`rounded-xl px-4 py-3 text-base transition ${
                  active === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            variant="aurora"
            onClick={() => {
              setOpen(false)
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <Sparkles className="h-4 w-4" />
            Explore Work
          </Button>
        </div>
      </div>
    </header>
  )
}
