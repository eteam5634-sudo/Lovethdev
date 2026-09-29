import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionHeading } from './ui/SectionHeading'

const lines = [
  'npm install',
  'npm run dev',
  'git add .',
  'git commit -m "Build something amazing"',
  'git push origin main',
]

export function Terminal() {
  const { ref, visible } = useScrollReveal()
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(() => {
    if (!visible) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setCompleted(lines)
      setLineIndex(lines.length)
      return
    }

    if (lineIndex >= lines.length) return

    const current = lines[lineIndex]
    if (charIndex < current.length) {
      const timeout = window.setTimeout(() => setCharIndex((c) => c + 1), 36)
      return () => window.clearTimeout(timeout)
    }

    const timeout = window.setTimeout(() => {
      setCompleted((prev) => [...prev, current])
      setLineIndex((i) => i + 1)
      setCharIndex(0)
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [visible, lineIndex, charIndex])

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="terminal-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Workflow"
          title="Inside the Code"
          description="A visual terminal snapshot of the everyday build loop."
        />
        <h2 id="terminal-heading" className="sr-only">
          Inside the Code
        </h2>

        <div className="glass glow-border mx-auto max-w-3xl overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-xs text-slate-500">lovethdev — zsh</span>
          </div>
          <div
            className="min-h-[260px] bg-black/35 p-5 font-mono text-sm leading-7 text-slate-300"
            aria-live="polite"
          >
            {completed.map((line) => (
              <p key={line}>
                <span className="text-cyan-300">lovethdev@playground:~$</span> {line}
              </p>
            ))}
            {lineIndex < lines.length ? (
              <p>
                <span className="text-cyan-300">lovethdev@playground:~$</span>{' '}
                {lines[lineIndex].slice(0, charIndex)}
                <span className="terminal-cursor" aria-hidden="true" />
              </p>
            ) : (
              <p>
                <span className="text-cyan-300">lovethdev@playground:~$</span>
                <span className="terminal-cursor" aria-hidden="true" />
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
