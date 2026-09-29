import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionHeading } from './ui/SectionHeading'

const stats = [
  { value: '20+', label: 'Projects Built' },
  { value: '10+', label: 'UI Experiments' },
  { value: '15+', label: 'Technologies Explored' },
  { value: '100%', label: 'Curiosity' },
]

export function Stats() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="stats-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          align="center"
          eyebrow="Snapshot"
          title="Fun Stats"
          description="Presentation values that reflect the playground spirit — curiosity over vanity metrics."
        />
        <h2 id="stats-heading" className="sr-only">
          Fun Stats
        </h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass glow-border rounded-2xl px-4 py-8 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <p className="text-gradient text-4xl font-extrabold sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
