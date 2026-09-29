import { Reveal } from "@/components/reveal";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the idea, goals and users.",
  },
  {
    number: "02",
    title: "Plan",
    description: "Structure the experience, features and technology.",
  },
  {
    number: "03",
    title: "Build",
    description: "Develop the interface and functionality.",
  },
  {
    number: "04",
    title: "Refine",
    description: "Test, improve responsiveness and polish the final experience.",
  },
];

export function Process() {
  return (
    <section id="process" className="section-padding relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
        aria-hidden="true"
      />

      <div className="container-narrow relative">
        <Reveal>
          <h2 className="section-title">How I Work</h2>
          <p className="section-subtitle">
            A clear process that keeps projects focused from first conversation
            to final polish.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Timeline line for desktop */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-violet-500/40 via-cyan-400/40 to-violet-500/40 lg:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 100}>
              <li className="relative">
                <div className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-glow-cyan">
                  <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-violet-500/40 bg-[#0a0a1a] font-mono text-sm font-bold text-violet-300 shadow-glow-sm">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {step.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
