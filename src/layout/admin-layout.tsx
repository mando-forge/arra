import { useEffect, useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const originalTheme =
      localStorage.getItem("theme") ||
      (document.documentElement.classList.contains("dark") ? "dark" : "light")
    const savedTheme = localStorage.getItem("theme") || "light"

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    const handleSession = (session: Session | null) => {
      const adminSession =
        session?.user.app_metadata?.role === "admin" ? session : null
      setSession(adminSession)
      setLoading(false)
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => handleSession(session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      handleSession(session)
    )

    return () => {
      subscription.unsubscribe()
      if (originalTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!session && location.pathname !== "/admin/login") {
      navigate("/admin/login")
    } else if (session && location.pathname === "/admin/login") {
      navigate("/admin")
    }
  }, [session, loading, navigate, location.pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin text-arra-cyan" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {location.pathname === "/admin/login" ? (
          <main className="flex flex-1 flex-col">
            <Outlet context={{ session }} />
          </main>
        ) : (
          <AppShell>
            <Outlet context={{ session }} />
          </AppShell>
        )}
      </div>
    </TooltipProvider>
  )
}
