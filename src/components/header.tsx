"use client"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { useScrollThreshold } from "@/hooks/use-scroll"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { navLinks } from "@/components/nav-links"
import { useTheme } from "@/components/theme-context"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export function Header() {
  const scrolled = useScrollThreshold(10)
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-16 md:h-20 w-full max-w-7xl items-center justify-between px-6 md:px-12 lg:px-24">
        <a
          className="rounded-none p-2 hover:bg-muted dark:hover:bg-muted/50"
          href="/"
        >
          <Logo className="h-4" />
        </a>
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Button asChild key={link.label} size="sm" variant="ghost">
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
          <AnimatedThemeToggler
            variant="star"
            theme={resolvedTheme}
            onThemeChange={(newTheme) => setTheme(newTheme)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-none hover:bg-accent hover:text-accent-foreground"
          />
          <Button size="sm" variant="outline">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
        <MobileNav />
      </nav>
    </header>
  )
}
