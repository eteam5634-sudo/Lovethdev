import { Brain, Lightbulb, Puzzle } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

const traits = [
  {
    title: 'Problem Solver',
    description: 'Breaking challenges into clear steps and shipping practical interfaces.',
    icon: Puzzle,
  },
  {
    title: 'Creative Builder',
    description: 'Exploring visual systems, motion and interaction with intention.',
    icon: Lightbulb,
  },
  {
    title: 'Continuous Learner',
    description: 'Treating every project as a chance to level up craft and taste.',
    icon: Brain,
  },
]

export function About() {
  const { ref, visible } = useScrollReveal()

  return (
    <section id="about" className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="about-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Brand"
          title="Behind LovethDev"
          description="LovethDev is a developer brand focused on learning, building and experimenting with modern web technologies."
        />
        <h2 id="about-heading" className="sr-only">
          Behind LovethDev
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {traits.map((trait) => {
            const Icon = trait.icon
            return (
              <Card key={trait.title}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 text-slate-950">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-white">{trait.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{trait.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
