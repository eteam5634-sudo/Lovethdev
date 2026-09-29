export type ProjectCategory =
  | 'All'
  | 'Websites'
  | 'Mini Apps'
  | 'UI Experiments'
  | 'Dashboards'

export interface Project {
  id: string
  title: string
  category: Exclude<ProjectCategory, 'All'>
  type: string
  description: string
  technologies: string[]
  liveUrl: string
  githubUrl: string
  size: 'large' | 'medium' | 'small'
  preview: 'invoice' | 'music' | 'realestate' | 'zoo' | 'coffee' | 'weather'
}

export const projectCategories: ProjectCategory[] = [
  'All',
  'Websites',
  'Mini Apps',
  'UI Experiments',
  'Dashboards',
]

export const projects: Project[] = [
  {
    id: 'nova-invoice',
    title: 'Nova Invoice',
    category: 'Dashboards',
    type: 'Full-Stack Project',
    description:
      'A modern invoice management application with a clean dashboard and professional invoice experience.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
    liveUrl: '#project-nova-invoice',
    githubUrl: 'https://github.com/eteam5634-sudo/lovethdev-playground',
    size: 'large',
    preview: 'invoice',
  },
  {
    id: 'music-player-ui',
    title: 'Music Player UI',
    category: 'UI Experiments',
    type: 'UI Project',
    description:
      'A dark immersive music player interface focused on visual experience and smooth interactions.',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    liveUrl: '#project-music-player',
    githubUrl: 'https://github.com/eteam5634-sudo/lovethdev-playground',
    size: 'medium',
    preview: 'music',
  },
  {
    id: 'real-estate-showcase',
    title: 'Real Estate Showcase',
    category: 'Websites',
    type: 'Website',
    description:
      'A modern property showcase with clean layouts, property cards and responsive design.',
    technologies: ['React', 'Next.js', 'Tailwind'],
    liveUrl: '#project-real-estate',
    githubUrl: 'https://github.com/eteam5634-sudo/lovethdev-playground',
    size: 'medium',
    preview: 'realestate',
  },
  {
    id: 'animal-zoo',
    title: 'Animal Zoo',
    category: 'Websites',
    type: 'Website',
    description:
      'An engaging animal zoo experience with categories, animal cards and interactive UI.',
    technologies: ['React', 'JavaScript', 'CSS'],
    liveUrl: '#project-animal-zoo',
    githubUrl: 'https://github.com/eteam5634-sudo/lovethdev-playground',
    size: 'small',
    preview: 'zoo',
  },
  {
    id: 'coffee-shop',
    title: 'Coffee Shop',
    category: 'Websites',
    type: 'Website',
    description:
      'A cinematic coffee shop landing page designed around atmosphere, branding and visual storytelling.',
    technologies: ['React', 'Tailwind'],
    liveUrl: '#project-coffee-shop',
    githubUrl: 'https://github.com/eteam5634-sudo/lovethdev-playground',
    size: 'small',
    preview: 'coffee',
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    category: 'Mini Apps',
    type: 'Mini App',
    description:
      'A clean weather dashboard interface designed to present weather information clearly.',
    technologies: ['React', 'JavaScript', 'CSS'],
    liveUrl: '#project-weather-dashboard',
    githubUrl: 'https://github.com/eteam5634-sudo/lovethdev-playground',
    size: 'small',
    preview: 'weather',
  },
]
