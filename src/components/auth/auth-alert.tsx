type AuthAlertProps = {
  type: "error" | "success";
  message: string;
};

export function AuthAlert({ type, message }: AuthAlertProps) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "border-rose-400/30 bg-rose-500/10 text-rose-200"
      : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`}
    >
      {message}
    </div>
  );
}
