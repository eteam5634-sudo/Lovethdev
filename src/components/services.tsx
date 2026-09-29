import { Gauge, Layers, Monitor, Palette } from "lucide-react";
import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Web Development",
    description:
      "Modern responsive websites built with modern frontend technologies.",
    icon: Monitor,
    accent: "violet",
  },
  {
    title: "Full-Stack Development",
    description:
      "Complete web applications with frontend, APIs and data integration.",
    icon: Layers,
    accent: "cyan",
  },
  {
    title: "UI Development",
    description:
      "Clean and interactive user interfaces designed around usability.",
    icon: Palette,
    accent: "blue",
  },
  {
    title: "Website Optimization",
    description:
      "Responsive improvements, UI improvements and frontend performance improvements.",
    icon: Gauge,
    accent: "purple",
  },
];

const accentMap: Record<string, string> = {
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  cyan: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  purple: "border-purple-500/20 bg-purple-500/10 text-purple-300",
};

export function Services() {
  return (
    <section id="services" className="section-padding relative">
      <div className="container-narrow relative">
        <Reveal>
          <h2 className="section-title">What I Can Build</h2>
          <p className="section-subtitle">
            Practical development services focused on clarity, responsiveness
            and modern web experiences.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 90}>
              <article className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-glow sm:p-8">
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${accentMap[service.accent]}`}
                >
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
                  {service.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
