import { useScrollReveal } from '../hooks/useScrollReveal'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

const steps = [
  {
    number: '01',
    title: 'Understand',
    description: 'Understand the problem before writing code.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Create a clear and useful experience.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Turn the idea into clean, responsive code.',
  },
  {
    number: '04',
    title: 'Improve',
    description: 'Test, refine and polish the final result.',
  },
]

export function Philosophy() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="philosophy-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Process"
          title="How I Build"
          description="A simple loop that keeps experiments intentional and production-minded."
        />
        <h2 id="philosophy-heading" className="sr-only">
          How I Build
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.number} className="relative overflow-hidden">
              <span className="text-gradient text-4xl font-extrabold opacity-80">{step.number}</span>
              <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
