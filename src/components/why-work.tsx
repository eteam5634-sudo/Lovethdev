import { Code2, Lightbulb, Smartphone, Zap } from "lucide-react";
import { Reveal } from "@/components/reveal";

const points = [
  {
    title: "Clean and maintainable code",
    description:
      "Structured, readable code that is easier to maintain, extend and collaborate on.",
    icon: Code2,
  },
  {
    title: "Responsive design",
    description:
      "Interfaces that adapt smoothly across mobile, tablet and desktop screens.",
    icon: Smartphone,
  },
  {
    title: "Modern technology",
    description:
      "Built with current frontend and full-stack tools for reliable, future-ready projects.",
    icon: Zap,
  },
  {
    title: "Problem-solving mindset",
    description:
      "Focused on understanding the real need and delivering practical digital solutions.",
    icon: Lightbulb,
  },
];

export function WhyWork() {
  return (
    <section id="why" className="section-padding relative">
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="container-narrow relative">
        <Reveal>
          <h2 className="section-title">Why Work With LovethDev</h2>
          <p className="section-subtitle">
            A practical approach to building digital products that look polished
            and work well.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={index * 80}>
              <article className="glass group flex gap-5 rounded-2xl p-6 transition-all duration-300 hover:border-violet-400/30 hover:shadow-glow">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-300 transition-transform duration-300 group-hover:scale-105">
                  <point.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {point.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
