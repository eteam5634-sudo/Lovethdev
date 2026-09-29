export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  category: "Full-Stack" | "Frontend";
  liveUrl: string;
  githubUrl: string;
  accent: string;
};

export const projects: Project[] = [
  {
    id: "nova-invoice",
    name: "Nova Invoice",
    description:
      "A modern invoice management application designed for creating, managing and presenting professional invoices.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    category: "Full-Stack",
    liveUrl: "https://github.com/lovethdev/nova-invoice",
    githubUrl: "https://github.com/lovethdev/nova-invoice",
    accent: "from-violet-500/30 to-fuchsia-500/10",
  },
  {
    id: "music-player-ui",
    name: "Music Player UI",
    description:
      "A modern music player interface focused on immersive dark-mode visuals and smooth user interactions.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    category: "Frontend",
    liveUrl: "https://github.com/lovethdev/music-player-ui",
    githubUrl: "https://github.com/lovethdev/music-player-ui",
    accent: "from-cyan-500/30 to-blue-500/10",
  },
  {
    id: "real-estate-showcase",
    name: "Real Estate Showcase",
    description:
      "A clean real estate showcase designed to present properties through a polished and responsive user experience.",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    category: "Frontend",
    liveUrl: "https://github.com/lovethdev/real-estate-showcase",
    githubUrl: "https://github.com/lovethdev/real-estate-showcase",
    accent: "from-emerald-500/30 to-teal-500/10",
  },
  {
    id: "animal-zoo",
    name: "Animal Zoo",
    description:
      "An interactive zoo website featuring animals, categories and an engaging visual experience.",
    technologies: ["React", "CSS", "JavaScript"],
    category: "Frontend",
    liveUrl: "https://github.com/lovethdev/animal-zoo",
    githubUrl: "https://github.com/lovethdev/animal-zoo",
    accent: "from-amber-500/30 to-orange-500/10",
  },
  {
    id: "coffee-shop",
    name: "Coffee Shop",
    description:
      "A cinematic coffee shop landing page designed to create an engaging brand experience.",
    technologies: ["React", "Tailwind CSS"],
    category: "Frontend",
    liveUrl: "https://github.com/lovethdev/coffee-shop",
    githubUrl: "https://github.com/lovethdev/coffee-shop",
    accent: "from-rose-500/30 to-orange-500/10",
  },
  {
    id: "weather-dashboard",
    name: "Weather Dashboard",
    description:
      "A clean weather dashboard interface focused on presenting weather information in a simple and visual way.",
    technologies: ["React", "JavaScript", "CSS"],
    category: "Frontend",
    liveUrl: "https://github.com/lovethdev/weather-dashboard",
    githubUrl: "https://github.com/lovethdev/weather-dashboard",
    accent: "from-sky-500/30 to-indigo-500/10",
  },
];
