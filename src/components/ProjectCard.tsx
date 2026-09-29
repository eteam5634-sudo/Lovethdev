import { ExternalLink, Github } from 'lucide-react'
import type { Project } from '../data/projects'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

interface ProjectCardProps {
  project: Project
}

const sizeClasses: Record<Project['size'], string> = {
  large: 'md:col-span-2 md:row-span-2',
  medium: 'md:col-span-1 md:row-span-2',
  small: 'md:col-span-1',
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      id={`project-${project.id}`}
      className={`filter-item filter-item-active group glass glow-border flex h-full flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 ${sizeClasses[project.size]}`}
    >
      <div className="relative min-h-[140px] overflow-hidden border-b border-white/5 p-4 sm:min-h-[160px]">
        <ProjectPreview type={project.preview} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="cyan">{project.category}</Badge>
          <Badge>{project.type}</Badge>
        </div>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => window.open(project.liveUrl, '_self')}
            aria-label={`View live demo for ${project.title}`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Live Demo
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
            aria-label={`View GitHub for ${project.title}`}
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </Button>
        </div>
      </div>
    </article>
  )
}

function ProjectPreview({ type }: { type: Project['preview'] }) {
  switch (type) {
    case 'invoice':
      return (
        <div className="h-full rounded-xl bg-gradient-to-br from-violet-950/80 via-slate-900 to-cyan-950/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-violet-400/50" />
            <div className="h-6 w-16 rounded-md bg-cyan-400/30" />
          </div>
          <div className="grid gap-2">
            <div className="h-8 rounded-lg bg-white/5" />
            <div className="h-8 rounded-lg bg-white/5" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-16 rounded-lg bg-violet-500/20" />
              <div className="h-16 rounded-lg bg-cyan-500/20" />
              <div className="h-16 rounded-lg bg-pink-500/20" />
            </div>
          </div>
        </div>
      )
    case 'music':
      return (
        <div className="flex h-full flex-col justify-between rounded-xl bg-gradient-to-br from-fuchsia-950 via-slate-950 to-violet-900 p-4">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 shadow-[0_0_30px_rgba(236,72,153,0.35)]" />
          <div>
            <div className="mx-auto mb-2 h-2 w-28 rounded bg-white/30" />
            <div className="mx-auto mb-3 h-1.5 w-20 rounded bg-white/15" />
            <div className="flex items-end justify-center gap-1">
              {[8, 14, 10, 18, 12, 16, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-pink-400/80"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      )
    case 'realestate':
      return (
        <div className="grid h-full grid-cols-2 gap-2 rounded-xl bg-gradient-to-br from-sky-950 to-slate-900 p-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-lg border border-white/10 bg-white/5 p-2">
              <div className="mb-2 h-10 rounded bg-sky-400/20" />
              <div className="h-2 w-3/4 rounded bg-white/20" />
            </div>
          ))}
        </div>
      )
    case 'zoo':
      return (
        <div className="flex h-full items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-emerald-950 to-lime-950 p-4">
          {[
            'from-amber-400 to-orange-500',
            'from-emerald-300 to-teal-500',
            'from-rose-400 to-orange-400',
          ].map((tone) => (
            <div
              key={tone}
              className={`h-14 w-14 rounded-2xl border border-white/10 bg-gradient-to-br ${tone} opacity-80 shadow-[0_0_20px_rgba(52,211,153,0.2)]`}
            />
          ))}
        </div>
      )
    case 'coffee':
      return (
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-950 via-stone-950 to-orange-950 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.2),transparent_50%)]" />
          <div className="relative h-20 w-16 rounded-b-3xl rounded-t-md border border-amber-200/20 bg-gradient-to-b from-amber-200/10 to-amber-700/30">
            <div className="absolute -right-4 top-6 h-8 w-5 rounded-r-full border border-amber-200/20" />
          </div>
        </div>
      )
    case 'weather':
      return (
        <div className="flex h-full flex-col justify-between rounded-xl bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-bold text-white">72°</div>
              <div className="text-xs text-slate-400">Partly cloudy</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-300/80 shadow-[0_0_20px_rgba(252,211,77,0.5)]" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['M', 'T', 'W', 'T'].map((d) => (
              <div key={d} className="rounded-lg bg-white/5 py-2 text-center text-[10px] text-slate-300">
                {d}
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return null
  }
}
