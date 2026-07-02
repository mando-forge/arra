import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { navItems } from "@/content/arra"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()
  const resolvedTheme = theme === "system" 
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") 
    : (theme as "light" | "dark")

  useEffect(() => {
    const sectionIds = ["home", ...navItems.map((link) => link.href.slice(1))]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) {
          setActiveSection(visible.target.id)
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    )

    for (const id of sectionIds) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/55 bg-background/82 backdrop-blur-xl">
      <div className="container-enterprise flex h-16 items-center justify-between">
        <a
          href="#home"
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.08em] text-foreground"
          aria-label="ARRA home"
        >
          <span className="grid size-6 grid-cols-2 gap-0.5 rounded-sm">
            <span className="rounded-[2px] bg-primary" />
            <span className="rounded-[2px] bg-accent" />
            <span className="rounded-[2px] bg-foreground/80" />
            <span className="rounded-[2px] border border-border" />
          </span>
          <span>ARRA</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map(({ label, href }) => {
            const isActive = activeSection === href.slice(1)
            return (
              <a
                key={label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border/70 hover:bg-card/45 hover:text-foreground",
                  isActive && "border-border/80 bg-card/55 text-foreground"
                )}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler 
            variant="star"
            theme={resolvedTheme} 
            onThemeChange={(newTheme) => setTheme(newTheme)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border/80 bg-card/55 text-foreground hover:bg-muted"
          />
          <Button
            asChild
            variant="outline"
            className="hidden h-10 rounded-lg border-border/80 bg-card/55 px-4 text-sm sm:inline-flex"
          >
            <a href="#contact">Contact</a>
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border/80 bg-card/55 text-foreground lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        inert={!mobileOpen ? true : undefined}
        className={cn(
          "overflow-hidden border-t border-border/50 bg-background/95 transition-[max-height,opacity] duration-200 lg:hidden",
          mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 md:px-12">
          {navItems.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {label}
            </a>
          ))}
          <Button asChild className="mt-2 h-11 rounded-lg text-sm">
            <a href="#contact" onClick={() => setMobileOpen(false)}>
              Contact
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
