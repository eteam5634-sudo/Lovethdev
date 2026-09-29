import { useMemo, useState } from 'react'
import {
  projectCategories,
  projects,
  type ProjectCategory,
} from '../data/projects'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './ui/SectionHeading'

export function ProjectExplorer() {
  const [active, setActive] = useState<ProjectCategory>('All')
  const { ref, visible } = useScrollReveal()

  const filtered = useMemo(() => {
    if (active === 'All') return projects
    return projects.filter((project) => project.category === active)
  }, [active])

  return (
    <section id="projects" className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="projects-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Showcase"
          title="Project Explorer"
          description="Browse websites, mini apps, UI experiments and dashboards. Filter by category to explore what LovethDev can build."
        />

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Project categories"
        >
          {projectCategories.map((category) => {
            const selected = active === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(category)}
                className={`rounded-xl border px-4 py-2 text-sm transition ${
                  selected
                    ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>

        <div
          key={active}
          className="grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-center text-slate-400">No projects in this category yet.</p>
        ) : null}
      </div>
    </section>
  )
}
