import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-2xl font-bold tracking-tight text-white transition-colors hover:text-violet-300"
          >
            Loveth
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Dev
            </span>
          </Link>
        </div>

        <div className="glass-strong rounded-3xl p-6 shadow-glow sm:p-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
