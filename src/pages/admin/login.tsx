import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Hexagon, Lock } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || data.user?.app_metadata.role !== "admin") {
      if (data.session) await supabase.auth.signOut()
      setError("The credentials could not be verified.")
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 shadow-neon space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Hexagon className="size-12 text-arra-cyan" />
          <h1 className="text-2xl font-bold mono-label uppercase tracking-widest">ARRA Access</h1>
          <p className="text-sm text-foreground/60">Restricted Authorization Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono text-center">
              ACCESS DENIED: {error}
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Operator ID (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-foreground/20 rounded-none h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-foreground/20 rounded-none h-12"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full rounded-none h-12 bg-arra-cyan text-background hover:bg-arra-cyan/90 font-bold tracking-widest uppercase"
            disabled={loading}
          >
            {loading ? "Authenticating..." : (
              <>
                <Lock className="mr-2 size-4" />
                Initialize Link
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
