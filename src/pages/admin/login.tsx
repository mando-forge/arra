import { useState } from "react"
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { images } from "@/content/arra"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password })

      if (signInError || data.user?.app_metadata.role !== "admin") {
        if (data.session) await supabase.auth.signOut()
        setError("The email or password could not be verified.")
      }
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen w-full bg-background lg:grid-cols-[minmax(0,0.95fr)_minmax(32rem,1.05fr)]">
      <section className="relative hidden overflow-hidden border-r border-border lg:block">
        <img
          src={images.hero.src}
          alt={images.hero.alt}
          className="absolute inset-0 size-full object-cover opacity-80"
        />
        <div className="absolute inset-x-0 bottom-0 bg-primary/92 px-12 py-10 text-primary-foreground">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-70">
            Founder workspace
          </p>
          <p className="mt-4 max-w-lg font-serif text-4xl leading-tight">
            A quiet place for careful work.
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 opacity-75">
            Review inquiries, manage updates, and maintain ARRA-CORE&apos;s
            growing knowledge base.
          </p>
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <a
            href="/"
            className="font-sans text-2xl font-medium tracking-[0.2em] text-primary"
            aria-label="Return to ARRA-CORE home"
          >
            ARRA-CORE
          </a>
          <p className="mt-14 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Secure administration
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-none text-primary">
            Welcome back.
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
            Sign in with an authorized founder account to continue to
            today&apos;s workspace.
          </p>

          <form onSubmit={handleLogin} className="mt-10 space-y-6" noValidate>
            {error && (
              <div
                role="alert"
                className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
              >
                Email address
              </Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-none border-x-0 border-t-0 bg-transparent px-0 text-base focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 rounded-none border-x-0 border-t-0 bg-transparent px-0 text-base focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-primary transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full justify-between rounded-none bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              <span className="flex items-center gap-2">
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LockKeyhole className="size-4" />
                )}
                {loading ? "Signing in..." : "Sign in securely"}
              </span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-10 border-t border-border pt-5 font-mono text-[9px] leading-5 tracking-[0.12em] text-muted-foreground uppercase">
            Authorized accounts only · Supabase protected session
          </div>
        </div>
      </main>
    </div>
  )
}
