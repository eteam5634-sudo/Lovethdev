export type Skill = {
  name: string;
  category: "Frontend" | "Backend / Full Stack" | "Tools";
};

export const skills: Skill[] = [
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend / Full Stack" },
  { name: "REST APIs", category: "Backend / Full Stack" },
  { name: "Supabase", category: "Backend / Full Stack" },
  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Cursor", category: "Tools" },
];

export const skillCategories = [
  "Frontend",
  "Backend / Full Stack",
  "Tools",
] as const;

export const socialLinks = {
  github: "https://github.com/lovethdev",
  linkedin: "https://linkedin.com/in/lovethdev",
  instagram: "https://instagram.com/lovethdev",
  email: "mailto:hello@lovethdev.com",
} as const;

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;
