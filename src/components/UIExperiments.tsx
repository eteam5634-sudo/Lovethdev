import { useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

export function UIExperiments() {
  const { ref, visible } = useScrollReveal()
  const [toggleOn, setToggleOn] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const magneticRef = useRef<HTMLButtonElement>(null)

  const handleMagnetic = (event: MouseEvent<HTMLButtonElement>) => {
    const button = magneticRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    button.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`
  }

  const resetMagnetic = () => {
    if (magneticRef.current) magneticRef.current.style.transform = 'translate(0, 0)'
  }

  return (
    <section
      id="experiments"
      className="px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="experiments-heading"
    >
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Interactive"
          title="UI Experiments"
          description="Live frontend experiments you can touch — glass, glow, motion and neon interactions."
        />
        <h2 id="experiments-heading" className="sr-only">
          UI Experiments
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="group relative overflow-hidden">
            <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]" />
            <p className="text-xs font-semibold tracking-[0.16em] text-violet-300 uppercase">
              Glass Card
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Hover glow glass</h3>
            <p className="mt-2 text-sm text-slate-400">
              A glassmorphism panel with a soft violet glow on hover.
            </p>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition group-hover:border-violet-400/40">
              Soft refraction · frosted depth
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">
              Aurora Button
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Animated gradient glow</h3>
            <button
              type="button"
              className="mt-5 rounded-xl border border-white/10 bg-[linear-gradient(120deg,#7c3aed,#2563eb,#06b6d4,#db2777)] px-5 py-3 text-sm font-medium text-white animate-gradient shadow-[0_0_28px_rgba(124,58,237,0.4)] transition hover:scale-[1.03]"
            >
              Aurora Action
            </button>
          </Card>

          <Card>
            <p className="text-xs font-semibold tracking-[0.16em] text-pink-300 uppercase">
              Magnetic Button
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Subtle hover movement</h3>
            <button
              ref={magneticRef}
              type="button"
              onMouseMove={handleMagnetic}
              onMouseLeave={resetMagnetic}
              className="mt-5 rounded-xl border border-pink-400/30 bg-pink-500/10 px-5 py-3 text-sm font-medium text-pink-100 transition duration-150"
            >
              Pull toward cursor
            </button>
          </Card>

          <Card>
            <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">
              Neon Input
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Futuristic field</h3>
            <label className="mt-5 block">
              <span className="sr-only">Neon input</span>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type something neon..."
                className="w-full rounded-xl border border-cyan-400/30 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
              />
            </label>
          </Card>

          <Card>
            <p className="text-xs font-semibold tracking-[0.16em] text-emerald-300 uppercase">
              Animated Toggle
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Smooth interactive switch</h3>
            <button
              type="button"
              role="switch"
              aria-checked={toggleOn}
              onClick={() => setToggleOn((v) => !v)}
              className={`mt-5 flex h-10 w-[4.5rem] items-center rounded-full border px-1 transition ${
                toggleOn
                  ? 'border-emerald-400/40 bg-emerald-400/20'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <span
                className={`h-7 w-7 rounded-full bg-white shadow transition ${
                  toggleOn ? 'translate-x-7 bg-emerald-300' : 'translate-x-0'
                }`}
              />
              <span className="sr-only">{toggleOn ? 'On' : 'Off'}</span>
            </button>
            <p className="mt-3 text-sm text-slate-400">State: {toggleOn ? 'Enabled' : 'Disabled'}</p>
          </Card>

          <Card className="animate-float">
            <p className="text-xs font-semibold tracking-[0.16em] text-violet-300 uppercase">
              Floating Card
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Gentle levitation</h3>
            <p className="mt-2 text-sm text-slate-400">
              Soft floating motion that keeps the surface feeling alive without distraction.
            </p>
            <form
              className="mt-4"
              onSubmit={(e: FormEvent) => {
                e.preventDefault()
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
              >
                Keep floating
              </button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
