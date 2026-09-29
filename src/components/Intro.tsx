import { FlaskConical, GraduationCap, Hammer } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

const introCards = [
  {
    title: 'Build',
    description: 'Turning ideas into functional interfaces.',
    icon: Hammer,
    tone: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Experiment',
    description: 'Testing new layouts, interactions and visual concepts.',
    icon: FlaskConical,
    tone: 'from-cyan-400 to-blue-500',
  },
  {
    title: 'Learn',
    description: 'Improving through every project and challenge.',
    icon: GraduationCap,
    tone: 'from-pink-400 to-rose-500',
  },
]

export function Intro() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="intro-heading">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}
      >
        <SectionHeading
          eyebrow="Introduction"
          title="Welcome to the Playground"
          description="This is where I experiment with ideas, interfaces, animations and interactive experiences. Every project is an opportunity to learn something new and turn an idea into something people can interact with."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {introCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className="group">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.tone} text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.2)] transition group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 id={card.title === 'Build' ? 'intro-heading' : undefined} className="text-xl font-semibold text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
