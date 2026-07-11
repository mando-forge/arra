import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Database, LogOut, Upload, Loader2, CheckCircle2 } from "lucide-react"

export default function AdminDashboard() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    setLoading(true)
    setStatus("idle")

    try {
      const { error } = await supabase.functions.invoke("ingest-knowledge", {
        body: { title, content }
      })

      if (error) throw error
      
      setStatus("success")
      setTitle("")
      setContent("")
    } catch (err) {
      console.error("Failed to ingest knowledge:", err)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Database className="size-6 text-arra-cyan" />
          <h1 className="text-2xl font-bold mono-label uppercase tracking-widest">Knowledge Base</h1>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="text-foreground/60 hover:text-foreground">
          <LogOut className="size-4 mr-2" />
          Terminate Session
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 shadow-neon space-y-4">
            <div>
              <h2 className="text-lg font-bold mono-label">Ingest Data</h2>
              <p className="text-sm text-foreground/60">Upload raw text or documentation to the ARRA neural net.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-xs uppercase tracking-widest text-foreground/80 font-bold">Document Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Protocol 7 Specifications"
                  className="bg-background/50 border-foreground/20 rounded-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content" className="text-xs uppercase tracking-widest text-foreground/80 font-bold">Raw Content</label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste documentation, lore, or factual data here..."
                  className="min-h-[200px] bg-background/50 border-foreground/20 rounded-none font-mono text-sm"
                  required
                />
              </div>
              
              {status === "success" && (
                <div className="p-3 bg-green-900/20 border border-green-500/50 text-green-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  DATA INGESTED AND EMBEDDED SUCCESSFULLY.
                </div>
              )}
              {status === "error" && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono">
                  INGESTION FAILED. CHECK SYSTEM LOGS.
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full rounded-none h-12 bg-arra-cyan text-background hover:bg-arra-cyan/90 font-bold tracking-widest uppercase"
                disabled={loading || !title || !content}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing Embeddings...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 size-4" />
                    Inject into Neural Net
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 shadow-neon border-arra-cyan/30">
            <h3 className="text-sm font-bold mono-label uppercase text-arra-cyan mb-2">System Status</h3>
            <div className="space-y-2 text-xs font-mono text-foreground/80">
              <div className="flex justify-between">
                <span>Vector DB:</span>
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>Dimension:</span>
                <span>1536</span>
              </div>
              <div className="flex justify-between">
                <span>Index:</span>
                <span>HNSW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
