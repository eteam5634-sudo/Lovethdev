import { roleLabel, type AppRole } from "@/lib/roles";

const styles: Record<AppRole, string> = {
  member: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  admin: "border-violet-400/30 bg-violet-500/10 text-violet-200",
  super_admin: "border-amber-400/30 bg-amber-500/10 text-amber-200",
};

export function RoleBadge({ role }: { role: AppRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${styles[role]}`}
    >
      {roleLabel(role)}
    </span>
  );
}
