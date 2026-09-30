import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <p className="text-slate-300" role="status">
          Checking your session...
        </p>
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-white">Authentication unavailable</h1>
        <p className="mt-3 text-sm text-slate-400">
          Add your Supabase URL and publishable key to <code className="text-cyan-300">.env.local</code>,
          then restart the development server.
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
