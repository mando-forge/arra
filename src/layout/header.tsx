"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Gateway", href: "#nexus-gateway" },
  { label: "Constellation", href: "#constellation" },
  { label: "Pathfinders", href: "#pathfinders" },
  { label: "Protocol", href: "#protocol" },
  { label: "Resonance", href: "#resonance" },
]

export function Header() {
  const [time, setTime] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="z-50 w-full fixed top-0 pt-6 pointer-events-none">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-12 pointer-events-auto">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5 opacity-90">
            <div className="size-3 bg-primary" />
            <div className="size-3 bg-primary" />
            <div className="size-3 bg-primary" />
            <div className="size-3 bg-primary/20" />
          </div>
          <span className="font-semibold text-lg tracking-tight ml-2 uppercase">MOKORO</span>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 border border-white/10 bg-black/40 backdrop-blur-md p-1.5 shadow-xl">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-4 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5 uppercase first:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right: Time + CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center text-xs font-mono text-muted-foreground">
            {time} (NEXUS)
          </div>
          <Button className="hidden sm:flex bg-foreground text-background hover:bg-foreground/90 font-bold px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-none uppercase tracking-widest">
            Establish Comms
          </Button>
          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center p-2 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={cn(
          "lg:hidden w-full border-t border-white/10 bg-black/90 backdrop-blur-md mt-4 overflow-hidden transition-all duration-300 pointer-events-auto",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4 gap-1">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="pt-2">
            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold rounded-none uppercase tracking-widest">
              Establish Comms
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
