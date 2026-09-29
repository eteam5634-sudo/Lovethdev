import {
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { socialLinks } from "@/data/skills";

const contacts = [
  {
    label: "Email",
    value: "hello@lovethdev.com",
    href: socialLinks.email,
    icon: Mail,
    external: false,
  },
  {
    label: "GitHub",
    value: "github.com/lovethdev",
    href: socialLinks.github,
    icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/lovethdev",
    href: socialLinks.linkedin,
    icon: Linkedin,
    external: true,
  },
  {
    label: "Instagram",
    value: "instagram.com/lovethdev",
    href: socialLinks.instagram,
    icon: Instagram,
    external: true,
  },
];

export function Contact() {
  return (
    <section id="contact" className="section-padding relative">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-500/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container-narrow relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">Let&apos;s Build Something Great</h2>
            <p className="section-subtitle mx-auto">
              Have an idea, project or website you want to bring to life?
              Let&apos;s talk.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((contact, index) => (
            <Reveal key={contact.label} delay={index * 70}>
              <a
                href={contact.href}
                {...(contact.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="glass group flex h-full flex-col items-start rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-glow-cyan"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-300 transition-colors group-hover:text-cyan-300">
                  <contact.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-slate-400">
                  {contact.label}
                </span>
                <span className="mt-1 break-all text-sm font-semibold text-white">
                  {contact.value}
                </span>
                <ArrowUpRight
                  className="mt-3 h-4 w-4 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"
                  aria-hidden="true"
                />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <a href={socialLinks.email} className="btn-primary px-8 py-4 text-base">
            Start a Conversation
            <Mail className="h-4 w-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
