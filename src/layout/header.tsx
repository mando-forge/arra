import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useTheme } from "@/components/theme-context"
import { navItems } from "@/content/arra"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { resolvedTheme, setTheme } = useTheme()

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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="container-enterprise border border-border bg-background text-foreground">
        <div className="grid min-h-16 grid-cols-[auto_1fr_auto] items-stretch">
          <a
            href="#home"
            className="serif-display flex min-w-36 items-center border-r border-border px-4 text-3xl leading-none uppercase md:min-w-52 md:text-4xl"
            aria-label="ARRA home"
          >
            ARRA
          </a>

          <nav className="hidden grid-cols-5 lg:grid" aria-label="Primary">
            {navItems.map(({ label, href }) => {
              const isActive = activeSection === href.slice(1)
              return (
                <a
                  key={label}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "mono-label flex items-center border-r border-border px-4 text-foreground/72 transition-colors hover:bg-foreground hover:text-background",
                    isActive && "bg-foreground text-background"
                  )}
                >
                  {label}
                </a>
              )
            })}
          </nav>

          <div className="ml-auto flex items-stretch border-l border-border lg:border-l-0">
            <AnimatedThemeToggler
              variant="rectangle"
              theme={resolvedTheme}
              onThemeChange={(newTheme) => setTheme(newTheme)}
              className="grid w-14 place-items-center border-r border-border bg-background text-foreground transition-colors hover:bg-foreground hover:text-background"
            />
            <a
              href="#contact"
              className="mono-label hidden items-center px-4 transition-colors hover:bg-foreground hover:text-background sm:flex"
            >
              Contact
            </a>
            <button
              type="button"
              className="grid w-14 place-items-center bg-background text-foreground transition-colors hover:bg-foreground hover:text-background lg:hidden"
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
            "border-t border-border lg:hidden",
            mobileOpen ? "block" : "hidden"
          )}
        >
          <nav className="grid" aria-label="Mobile primary">
            {navItems.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="mono-label border-b border-border px-4 py-4 transition-colors hover:bg-foreground hover:text-background"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
