import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionHeading } from './ui/SectionHeading'

const experiments = [
  {
    title: 'Aurora',
    label: 'Animated Aurora gradient',
    description: 'Soft layered color washes that shift like northern lights.',
    className: 'aurora-card',
  },
  {
    title: 'Glass',
    label: 'Glassmorphism interface',
    description: 'Frosted translucent surfaces with subtle borders and blur.',
    className: 'glass-card',
  },
  {
    title: 'Bento',
    label: 'Bento grid layout',
    description: 'Asymmetrical tiles that organize content like a premium kit.',
    className: 'bento-card',
  },
]

export function DesignPlayground() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="design-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Visual systems"
          title="Design Playground"
          description="Hover each card to feel the Aurora, Glass and Bento languages that shape this site."
        />
        <h2 id="design-heading" className="sr-only">
          Design Playground
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {experiments.map((item) => (
            <article
              key={item.title}
              className="group glass overflow-hidden rounded-2xl border border-white/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className={`relative h-44 overflow-hidden ${item.className}`}>
                {item.title === 'Aurora' ? (
                  <>
                    <div className="absolute inset-0 bg-[#080816]" />
                    <div className="absolute -left-8 top-0 h-40 w-40 rounded-full bg-violet-500/50 blur-3xl transition duration-700 group-hover:translate-x-6 group-hover:scale-125" />
                    <div className="absolute right-0 bottom-0 h-36 w-36 rounded-full bg-cyan-400/40 blur-3xl transition duration-700 group-hover:-translate-x-4 group-hover:scale-110" />
                    <div className="absolute top-8 right-10 h-24 w-24 rounded-full bg-pink-500/40 blur-2xl transition duration-700 group-hover:translate-y-3" />
                  </>
                ) : null}

                {item.title === 'Glass' ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                    <div className="h-24 w-40 rounded-2xl border border-white/20 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-500 group-hover:scale-105 group-hover:bg-white/15" />
                  </div>
                ) : null}

                {item.title === 'Bento' ? (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 bg-slate-950 p-4">
                    <div className="col-span-2 row-span-2 rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-400/20 transition group-hover:from-violet-500/60" />
                    <div className="rounded-xl bg-pink-400/20 transition group-hover:bg-pink-400/40" />
                    <div className="rounded-xl bg-cyan-400/20 transition group-hover:bg-cyan-400/40" />
                  </div>
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">
                  {item.label}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
