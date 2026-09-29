export type TechGroup = 'Frontend' | 'Tools' | 'Backend / Full Stack'

export interface Technology {
  name: string
  group: TechGroup
  accent: string
}

export const technologies: Technology[] = [
  { name: 'HTML', group: 'Frontend', accent: 'from-orange-400 to-amber-500' },
  { name: 'CSS', group: 'Frontend', accent: 'from-blue-400 to-cyan-400' },
  { name: 'JavaScript', group: 'Frontend', accent: 'from-yellow-300 to-amber-400' },
  { name: 'TypeScript', group: 'Frontend', accent: 'from-sky-400 to-blue-500' },
  { name: 'React', group: 'Frontend', accent: 'from-cyan-300 to-sky-500' },
  { name: 'Next.js', group: 'Frontend', accent: 'from-slate-200 to-slate-400' },
  { name: 'Tailwind CSS', group: 'Frontend', accent: 'from-teal-300 to-cyan-500' },
  { name: 'Git', group: 'Tools', accent: 'from-orange-400 to-red-500' },
  { name: 'GitHub', group: 'Tools', accent: 'from-slate-300 to-zinc-400' },
  { name: 'VS Code', group: 'Tools', accent: 'from-blue-400 to-indigo-500' },
  { name: 'Cursor', group: 'Tools', accent: 'from-violet-400 to-fuchsia-500' },
  { name: 'Node.js', group: 'Backend / Full Stack', accent: 'from-green-400 to-emerald-500' },
  { name: 'Supabase', group: 'Backend / Full Stack', accent: 'from-emerald-300 to-teal-500' },
  { name: 'REST APIs', group: 'Backend / Full Stack', accent: 'from-pink-400 to-rose-500' },
]

export const techGroups: TechGroup[] = ['Frontend', 'Tools', 'Backend / Full Stack']
