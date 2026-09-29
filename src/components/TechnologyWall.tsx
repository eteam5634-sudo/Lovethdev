import { techGroups, technologies } from '../data/technologies'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionHeading } from './ui/SectionHeading'

export function TechnologyWall() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="tech-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Stack"
          title="Tools Behind the Builds"
          description="Technologies explored across different projects — not every tool appears in every build."
        />
        <h2 id="tech-heading" className="sr-only">
          Tools Behind the Builds
        </h2>

        <div className="space-y-8">
          {techGroups.map((group) => (
            <div key={group}>
              <h3 className="mb-4 text-sm font-semibold tracking-[0.18em] text-slate-400 uppercase">
                {group}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {technologies
                  .filter((tech) => tech.group === group)
                  .map((tech) => (
                    <div
                      key={tech.name}
                      className="group glass rounded-2xl p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
                    >
                      <div
                        className={`mx-auto mb-3 h-10 w-10 rounded-xl bg-gradient-to-br ${tech.accent} opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.15)] transition group-hover:scale-110`}
                      />
                      <p className="text-sm font-medium text-slate-200">{tech.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
