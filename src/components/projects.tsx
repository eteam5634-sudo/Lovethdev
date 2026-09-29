import { ExternalLink, Github } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="section-padding relative">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-narrow relative">
        <Reveal>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A selection of projects that highlight clean interfaces, thoughtful
            structure and modern web technology.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 80}>
              <article className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/35 hover:shadow-glow">
                {/* Visual preview */}
                <div
                  className={`relative flex h-40 items-end overflow-hidden bg-gradient-to-br ${project.accent} p-5`}
                >
                  <div
                    className="absolute inset-0 bg-grid-pattern bg-grid opacity-30"
                    aria-hidden="true"
                  />
                  <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
                    {project.category}
                  </div>
                  <div className="relative w-full rounded-lg border border-white/10 bg-[#05050f]/70 p-3 backdrop-blur-sm">
                    <div className="mb-2 flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                    </div>
                    <p className="truncate font-mono text-[11px] text-slate-400">
                      {project.id}.tsx — LovethDev
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-violet-200">
                    {project.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary !px-4 !py-2 flex-1 text-xs"
                    >
                      View Project
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} on GitHub`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition-all hover:border-cyan-400/40 hover:text-white"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
