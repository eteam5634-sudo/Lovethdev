import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { navLinks, socialLinks } from "@/data/skills";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#030308]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
        aria-hidden="true"
      />

      <div className="container-narrow px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <a href="#home" className="text-2xl font-bold tracking-tight text-white">
              Loveth
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Dev
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Building modern digital experiences with code and creativity.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-violet-400/40 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-cyan-400/40 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-violet-400/40 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.email}
                aria-label="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-cyan-400/40 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Navigation
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Get in Touch
            </h2>
            <p className="mt-4 text-sm text-slate-400">
              Ready to start a project or just want to say hello?
            </p>
            <a href={socialLinks.email} className="btn-primary mt-5 inline-flex">
              Let&apos;s Talk
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            © 2026 LovethDev. All rights reserved.
          </p>
          <p className="text-sm text-slate-600">Crafted with Next.js & Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
