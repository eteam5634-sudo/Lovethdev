import { useId, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function AuthInput({ label, error, id, type = 'text', className = '', ...props }: AuthInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const isPassword = type === 'password'
  const [visible, setVisible] = useState(false)
  const resolvedType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:shadow-[0_0_24px_rgba(34,211,238,0.2)] ${
            error ? 'border-rose-400/50' : 'border-white/10'
          } ${isPassword ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
