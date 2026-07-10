import { useEffect, useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

export function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleSession = (session: Session | null) => {
      const adminSession = session?.user.app_metadata.role === "admin" ? session : null
      setSession(adminSession)
      setLoading(false)
      if (!adminSession && location.pathname !== '/admin/login') {
        navigate('/admin/login')
      } else if (adminSession && location.pathname === '/admin/login') {
        navigate('/admin')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => handleSession(session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => handleSession(session))

    return () => subscription.unsubscribe()
  }, [navigate, location.pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin text-arra-cyan" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 flex flex-col pt-16">
        <Outlet context={{ session }} />
      </main>
    </div>
  )
}
