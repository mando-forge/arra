import { AppHeader } from "@/components/app-header"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="relative min-h-[calc(100vh-5.5rem)]">{children}</main>
    </div>
  )
}
