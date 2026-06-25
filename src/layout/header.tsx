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
  const [activeSection, setActiveSection] = useState("nexus-gateway")

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

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.slice(1))
    const intersectingMap = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          intersectingMap.set(entry.target.id, entry.isIntersecting)
        }

        for (const id of sectionIds) {
          if (intersectingMap.get(id)) {
            setActiveSection(id)
            break
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    )
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
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
          <span className="font-semibold text-lg tracking-tight ml-2 uppercase">ARRA</span>
        </div>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 border border-white/10 bg-black/40 backdrop-blur-md p-1.5 shadow-xl">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              aria-current={activeSection === href.slice(1) ? "true" : undefined}
              className={cn(
                "px-4 py-2 text-xs font-bold transition-colors hover:text-foreground hover:bg-white/5 uppercase",
                activeSection === href.slice(1)
                  ? "text-foreground border-b-2 border-primary shadow-[0_1px_0_var(--color-primary)]"
                  : "text-muted-foreground"
              )}
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
          <Button asChild className="flex border-primary bg-transparent px-3 font-bold text-primary shadow-[0_0_20px_var(--color-primary)] hover:bg-primary/10 hover:text-primary sm:px-6">
            <a href="#resonance">
              <span className="hidden sm:inline">Establish&nbsp;</span>Comms
            </a>
          </Button>
          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center p-2 text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
        className={cn(
          "lg:hidden w-full border-t border-white/10 bg-black/90 backdrop-blur-md mt-4 overflow-hidden transition-all duration-300",
          mobileOpen
            ? "max-h-96 opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4 gap-1">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              aria-current={activeSection === href.slice(1) ? "true" : undefined}
              className={cn(
                "px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:text-foreground",
                activeSection === href.slice(1)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </a>
          ))}
          <div className="pt-2">
            <Button asChild className="w-full border-primary bg-transparent font-bold text-primary hover:bg-primary/10 hover:text-primary">
              <a href="#resonance" onClick={() => setMobileOpen(false)}>
                Establish Comms
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
