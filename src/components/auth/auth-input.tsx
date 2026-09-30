import { forwardRef } from "react";

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ label, error, id, className = "", ...props }, ref) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/[0.07] focus:shadow-glow-sm ${
            error ? "border-rose-400/50" : "border-white/10"
          } ${className}`}
          {...props}
        />
        {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      </div>
    );
  },
);
