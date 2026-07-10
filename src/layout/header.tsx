import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useTheme } from "@/components/theme-context"
import { navItems } from "@/content/arra"
import { cn } from "@/lib/utils"

const primaryNavItems = navItems
  .filter(({ label }) => label !== "Blog")
  .map((item) =>
    item.label === "Products" ? { ...item, label: "Explorations" } : item
  )

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const activeRoute = location.pathname
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMobileOpen(false)
  }, [activeRoute])

  return (
    <header className="relative w-full flex justify-between items-center py-8 z-50">
      <Link
        to="/"
        className="font-sans text-2xl font-medium leading-none tracking-[0.18em] md:text-[1.8rem]"
        aria-label="ARRA home"
      >
        ARRA
      </Link>

      <nav
        className="hidden items-center justify-center gap-7 md:flex lg:gap-10"
        aria-label="Primary"
      >
        {primaryNavItems.map(({ label, href }) => {
          const isActive = activeRoute === href
          return (
            <Link
              key={label}
              to={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "border-b py-2 text-sm text-foreground/64 transition-colors hover:border-foreground/45 hover:text-foreground",
                isActive
                  ? "border-foreground text-foreground"
                  : "border-transparent"
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-5 justify-end">
        <p className="mono-label hidden text-right text-[0.62rem] leading-5 text-foreground/60 xl:block">
          Northeast India
          <br />
          Research stage
        </p>
        <AnimatedThemeToggler
          variant="rectangle"
          theme={resolvedTheme}
          onThemeChange={(newTheme) => setTheme(newTheme)}
          className="grid size-11 place-items-center border border-border bg-background text-foreground transition-colors hover:border-foreground/40 hover:bg-muted"
        />
        <button
          type="button"
          className="grid size-11 place-items-center border border-border bg-background text-foreground transition-colors hover:border-foreground/40 hover:bg-muted md:hidden"
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

      <div
        id="mobile-navigation"
        inert={!mobileOpen ? true : undefined}
        className={cn(
          "absolute inset-x-0 top-full border-b border-border bg-background md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="grid py-3 px-4 sm:px-6 md:px-8" aria-label="Mobile primary">
          {primaryNavItems.map(({ label, href }) => {
            const isActive = activeRoute === href
            return (
              <Link
                key={label}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex min-h-12 items-center justify-between border-b border-border/65 px-1 text-base transition-colors last:border-b-0 hover:text-foreground",
                  isActive ? "text-foreground" : "text-foreground/64"
                )}
              >
                <span>{label}</span>
                <span className="mono-label text-[0.58rem]" aria-hidden="true">
                  {isActive ? "Current" : "Open"}
                </span>
              </Link>
            )
          })}
        </nav>
        <p className="mono-label border-t border-border px-5 sm:px-7 md:px-9 py-4 text-[0.6rem] leading-5 text-foreground/55">
          Northeast India · Research stage
        </p>
      </div>
    </header>
  )
}
