import { useEffect, useState } from "react"
import {
  Database,
  FileText,
  LogOut,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

type AdminSettingsProps = {
  inquiryCount: number
  postCount: number
  documentCount: number
}

export function AdminSettings({
  inquiryCount,
  postCount,
  documentCount,
}: AdminSettingsProps) {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    void supabase.auth
      .getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
      <section>
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          Workspace
        </p>
        <h1 className="mt-4 font-serif text-5xl text-primary">Settings</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
          Review the authenticated account and the real data connected to this
          founder workspace.
        </p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          <div className="grid gap-4 py-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="flex items-center gap-3 text-sm font-medium">
              <ShieldCheck className="text-primary size-4" />
              Administrator
            </div>
            <div>
              <p className="text-sm text-foreground">
                {email ?? "Authenticated account"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Access is authorized by the server-issued admin role.
                Browser-local access shortcuts are disabled.
              </p>
            </div>
          </div>
          <div className="grid gap-4 py-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="flex items-center gap-3 text-sm font-medium">
              <Database className="text-primary size-4" />
              Data boundary
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Dashboard reads and mutations are governed by Supabase Row Level
              Security. Public contact intake is separated from admin access.
            </p>
          </div>
          <div className="grid gap-4 py-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="flex items-center gap-3 text-sm font-medium">
              <RefreshCw className="text-primary size-4" />
              Workspace data
            </div>
            <div>
              <p className="text-sm leading-6 text-muted-foreground">
                Refresh inquiries, field notes, and knowledge records from the
                database.
              </p>
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new Event("sync-core"))}
                className="mt-4 h-10 rounded-none"
              >
                <RefreshCw className="mr-2 size-4" />
                Refresh workspace
              </Button>
            </div>
          </div>
        </div>
      </section>

      <aside className="border-l border-border pl-0 lg:pl-9">
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          Current records
        </p>
        <div className="mt-5 divide-y divide-border border-y border-border">
          <div className="flex items-center justify-between py-5">
            <span className="flex items-center gap-3 text-sm">
              <MessageSquareText className="size-4" /> Inquiries
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {inquiryCount}
            </span>
          </div>
          <div className="flex items-center justify-between py-5">
            <span className="flex items-center gap-3 text-sm">
              <FileText className="size-4" /> Field notes
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {postCount}
            </span>
          </div>
          <div className="flex items-center justify-between py-5">
            <span className="flex items-center gap-3 text-sm">
              <Database className="size-4" /> Knowledge documents
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {documentCount}
            </span>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-sm leading-6 text-muted-foreground">
            End this browser session when you finish working on a shared device.
          </p>
          <Button
            variant="ghost"
            onClick={() => supabase.auth.signOut()}
            className="mt-4 rounded-none px-0 text-destructive hover:bg-transparent hover:text-destructive/75"
          >
            <LogOut className="mr-2 size-4" />
            Sign out
          </Button>
        </div>
      </aside>
    </div>
  )
}
