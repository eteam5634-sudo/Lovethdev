import {
  BookOpen,
  Code2,
  Layout,
  Lightbulb,
  MonitorSmartphone,
  Puzzle,
  Sparkles,
  Layers,
} from "lucide-react";
import { Reveal } from "@/components/reveal";

const infoCards = [
  {
    title: "Problem Solver",
    description:
      "I approach challenges with curiosity and structure, turning complex ideas into clear digital solutions.",
    icon: Lightbulb,
  },
  {
    title: "Clean Code",
    description:
      "Readable, maintainable code is the foundation of every project I build — designed to scale and evolve.",
    icon: Code2,
  },
  {
    title: "Continuous Learner",
    description:
      "Technology moves fast. I stay curious, keep practicing, and grow with every project I ship.",
    icon: BookOpen,
  },
];

const whatIDo = [
  {
    title: "Frontend Development",
    description: "Building polished interfaces with React, Next.js and modern CSS.",
    icon: Layout,
  },
  {
    title: "Full-Stack Development",
    description: "Connecting frontend experiences with APIs and data layers.",
    icon: Layers,
  },
  {
    title: "Responsive Web Design",
    description: "Crafting layouts that feel natural across every screen size.",
    icon: MonitorSmartphone,
  },
  {
    title: "UI Development",
    description: "Turning designs into interactive, accessible user interfaces.",
    icon: Sparkles,
  },
  {
    title: "Problem Solving",
    description: "Breaking down real-world needs into practical technical solutions.",
    icon: Puzzle,
  },
];

export function About() {
  return (
    <section id="about" className="section-padding relative">
      <div
        className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="container-narrow relative">
        <Reveal>
          <h2 className="section-title">About LovethDev</h2>
          <p className="section-subtitle">
            I&apos;m a passionate developer who enjoys turning ideas into
            functional digital experiences. I combine clean code, thoughtful
            design and problem-solving to build websites and applications that
            are fast, responsive and easy to use.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {infoCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 100}>
              <article className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-glow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300 transition-colors group-hover:text-violet-200">
                  <card.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {card.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">
            What I Do
          </h3>
          <p className="mt-3 max-w-xl text-slate-400">
            From interface design to full-stack delivery, here&apos;s how I help
            bring ideas to life.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whatIDo.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <article className="glass flex gap-4 rounded-2xl p-5 transition-all duration-300 hover:border-cyan-400/25 hover:bg-white/[0.06]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
