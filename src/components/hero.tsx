import { ArrowRight, Github, Instagram, Linkedin } from "lucide-react";
import { socialLinks } from "@/data/skills";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-[120px] animate-pulse-glow" />
        <div className="absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-blue-500/10 blur-[80px]" />
      </div>

      <div className="container-narrow relative z-10 grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="animate-slide-up">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a855f7]" />
            FULL-STACK DEVELOPER
          </span>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Building Digital Experiences That{" "}
            <span className="gradient-text">Solve Real Problems.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            I&apos;m Loveth, a full-stack developer focused on creating modern,
            responsive and user-friendly digital experiences.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#projects" className="btn-primary">
              View My Work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#contact" className="btn-secondary">
              Let&apos;s Connect
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-violet-400/40 hover:text-white hover:shadow-glow-sm"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-cyan-400/40 hover:text-white hover:shadow-glow-cyan"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-violet-400/40 hover:text-white hover:shadow-glow-sm"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Available for new projects
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-scale-in lg:max-w-none">
          <div
            className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-500/20 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative glass-strong overflow-hidden rounded-3xl p-1 shadow-glow">
            <div className="rounded-[1.35rem] bg-[#08081a]/90 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-slate-500">
                  lovethdev - zsh
                </span>
              </div>

              <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-slate-300 sm:text-sm">
                <code>
                  <span className="text-slate-500">{"// portfolio.ts\n"}</span>
                  <span className="text-violet-400">const</span>
                  {" developer = "}
                  <span className="text-emerald-300">&quot;LovethDev&quot;</span>
                  {";\n\n"}
                  <span className="text-violet-400">const</span>
                  {" stack = [\n"}
                  {'  "Next.js",\n'}
                  {'  "TypeScript",\n'}
                  {'  "React",\n'}
                  {'  "Tailwind",\n'}
                  {"];\n\n"}
                  <span className="text-violet-400">function</span>
                  <span className="text-amber-300"> build</span>
                  {"() {\n"}
                  {"  return "}
                  <span className="text-emerald-300">&quot;beautiful apps&quot;</span>
                  {";\n}"}
                </code>
              </pre>

              <div className="mt-5 flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "Node.js"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="absolute -left-3 top-16 hidden animate-float rounded-xl border border-violet-500/30 bg-[#0a0a1a]/90 px-3 py-2 text-xs font-medium text-violet-200 shadow-glow-sm sm:block"
            aria-hidden="true"
          >
            Clean Code
          </div>
          <div
            className="absolute -right-2 bottom-24 hidden animate-float-slow rounded-xl border border-cyan-500/30 bg-[#0a0a1a]/90 px-3 py-2 text-xs font-medium text-cyan-200 shadow-glow-cyan sm:block"
            aria-hidden="true"
          >
            UI / UX Focus
          </div>
        </div>
      </div>
    </section>
  );
}
