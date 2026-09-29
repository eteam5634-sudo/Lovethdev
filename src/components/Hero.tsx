import { ArrowRight, FlaskConical, TerminalSquare } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

export function Hero() {
  return (
    <section
      id="playground"
      className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20 lg:px-8 lg:pt-36"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="reveal visible max-w-2xl">
          <Badge tone="purple" className="mb-5 tracking-[0.18em]">
            LOVETHDEV PLAYGROUND
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.6rem] lg:leading-[1.05]">
            Where Code Meets <span className="text-gradient">Creativity.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            A collection of websites, mini applications, UI experiments and digital experiences
            built by LovethDev.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() =>
                document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <FlaskConical className="h-4 w-4" />
              View Experiments
            </Button>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Frontend • UI • Full-Stack Experiments
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden="true">
      <div className="absolute -top-6 -left-4 h-28 w-28 rounded-full bg-violet-500/40 blur-3xl animate-float-slow" />
      <div className="absolute top-10 -right-4 h-32 w-32 rounded-full bg-cyan-400/30 blur-3xl animate-float-delayed" />
      <div className="absolute bottom-0 left-10 h-24 w-24 rounded-full bg-pink-500/30 blur-3xl animate-float" />

      <div className="relative grid grid-cols-6 gap-3 sm:gap-4">
        <div className="glass col-span-4 animate-float rounded-2xl p-4 glow-border">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-[11px] text-slate-500">playground.tsx</span>
          </div>
          <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs">
            <code>
              <span className="text-violet-300">const</span> idea ={' '}
              <span className="text-emerald-300">&quot;Build&quot;</span>;{'\n'}
              <span className="text-violet-300">const</span> design ={' '}
              <span className="text-cyan-300">&quot;Create&quot;</span>;{'\n'}
              <span className="text-violet-300">const</span> result ={' '}
              <span className="text-pink-300">&quot;Ship&quot;</span>;{'\n'}
              {'\n'}
              <span className="text-slate-500">{'// LovethDev workflow'}</span>
              {'\n'}
              export {'{'} idea, design, result {'}'};
              <span className="terminal-cursor" />
            </code>
          </pre>
        </div>

        <div className="glass col-span-2 animate-float-delayed rounded-2xl p-3 sm:p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950">
            <TerminalSquare className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-white sm:text-sm">Live Lab</p>
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">UI experiments online</p>
        </div>

        <div className="glass col-span-3 animate-float-slow rounded-2xl p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] text-emerald-300">
            <span>lovethdev@playground:~$</span>
          </div>
          <p className="font-mono text-[11px] text-slate-300 sm:text-xs">
            npm run invent
            <br />
            <span className="text-cyan-300">✓ creative mode enabled</span>
          </p>
        </div>

        <div className="glass col-span-3 rounded-2xl p-4">
          <p className="mb-3 text-xs font-medium text-slate-400">Stack pulse</p>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind', 'Vite'].map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="glass col-span-6 rounded-2xl p-4 sm:col-span-4">
          <div className="flex items-end gap-1.5">
            {[40, 65, 45, 80, 55, 90, 70, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-400"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Interaction energy · last 8 builds</p>
        </div>

        <div className="glass relative col-span-6 overflow-hidden rounded-2xl p-4 sm:col-span-2">
          <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />
          <p className="text-xs font-semibold text-white">Cursor Lab</p>
          <div className="relative mt-6 h-16">
            <div className="absolute top-2 left-4 h-4 w-4 rotate-12 border-l-2 border-b-2 border-white" />
            <div className="absolute top-8 left-10 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-200">
              click → create
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
