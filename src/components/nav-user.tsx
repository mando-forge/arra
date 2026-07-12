import { useEffect, useMemo, useState } from "react"
import { LogOut, Settings } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"

export function NavUser() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    void supabase.auth
      .getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])

  const initials = useMemo(() => {
    if (!email) return "A"
    const prefix = email.split("@")[0]
    return prefix
      .split(/[._-]/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }, [email])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out failed:", error)
      toast.error(`Sign out failed: ${error.message}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Open admin account menu"
        >
          <Avatar className="size-10 border border-border bg-background">
            <AvatarFallback className="bg-background font-sans text-xs font-medium text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-none border-border bg-background p-2"
      >
        <DropdownMenuLabel className="px-2 py-3">
          <span className="block font-serif text-lg font-normal text-foreground">
            Founder admin
          </span>
          <span className="mt-1 block truncate font-mono text-[10px] font-normal text-muted-foreground">
            {email ?? "Authenticated operator"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-none text-sm">
            <a href="#settings">
              <Settings className="size-4" />
              Settings
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-none text-sm text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
