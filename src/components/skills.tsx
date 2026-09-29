import {
  Code2,
  Database,
  FileCode2,
  Github,
  Globe,
  Layout,
  Palette,
  Server,
  Terminal,
  Braces,
  Boxes,
  Cpu,
  GitBranch,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { skillCategories, skills } from "@/data/skills";

const skillIcons: Record<string, LucideIcon> = {
  HTML: Globe,
  CSS: Palette,
  JavaScript: FileCode2,
  TypeScript: Braces,
  React: Boxes,
  "Next.js": Layout,
  "Tailwind CSS": Sparkles,
  "Node.js": Server,
  "REST APIs": Database,
  Supabase: Database,
  Git: GitBranch,
  GitHub: Github,
  "VS Code": Code2,
  Cursor: Terminal,
};

const categoryAccent: Record<string, string> = {
  Frontend: "from-violet-500/20 to-transparent border-violet-500/20",
  "Backend / Full Stack": "from-cyan-500/20 to-transparent border-cyan-500/20",
  Tools: "from-blue-500/20 to-transparent border-blue-500/20",
};

export function Skills() {
  return (
    <section id="skills" className="section-padding relative">
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="container-narrow relative">
        <Reveal>
          <div className="flex items-center gap-3">
            <Cpu className="h-7 w-7 text-violet-400" aria-hidden="true" />
            <h2 className="section-title">Technologies I Work With</h2>
          </div>
          <p className="section-subtitle">
            Tools and technologies I use to design, build and ship modern web
            experiences.
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {skillCategories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            return (
              <div key={category}>
                <Reveal>
                  <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {category}
                  </h3>
                </Reveal>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {categorySkills.map((skill, index) => {
                    const Icon = skillIcons[skill.name] ?? Code2;
                    return (
                      <Reveal key={skill.name} delay={index * 60}>
                        <article
                          className={`glass group flex items-center gap-3 rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${categoryAccent[category]}`}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-violet-300 transition-colors group-hover:text-cyan-300">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <span className="text-sm font-medium text-white">
                            {skill.name}
                          </span>
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
