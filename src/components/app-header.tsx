import { Menu } from "lucide-react"
import { useLocation } from "react-router-dom"

import { NavUser } from "@/components/nav-user"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Today", hash: "#overview" },
  { label: "Inquiries", hash: "#inquiries" },
  { label: "Field Notes", hash: "#cms" },
  { label: "Knowledge", hash: "#knowledge" },
  { label: "Settings", hash: "#settings" },
]

export function AppHeader() {
  const { hash } = useLocation()
  const currentHash = hash || "#overview"

  return (
    <header className="sticky top-0 z-50 h-[5.5rem] border-b border-border bg-background/96 supports-backdrop-filter:backdrop-blur-md">
      <div className="mx-auto flex h-full w-full items-center px-5 sm:px-8 lg:px-9">
        <a
          href="#overview"
          className="font-sans text-[1.7rem] font-medium tracking-[0.2em] text-primary transition-opacity hover:opacity-70"
          aria-label="ARRA-CORE dashboard home"
        >
          ARRA-CORE
        </a>

        <nav
          className="ml-24 hidden h-full items-center gap-10 lg:flex"
          aria-label="Admin navigation"
        >
          {navigation.map((item) => {
            const active = currentHash === item.hash
            return (
              <a
                key={item.hash}
                href={item.hash}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full items-center text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active &&
                    "text-primary after:absolute after:bottom-[1.7rem] after:left-0 after:h-px after:w-full after:bg-primary"
                )}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <p className="mr-2 hidden text-right font-mono text-[10px] leading-relaxed tracking-[0.16em] text-muted-foreground uppercase xl:block">
            Imphal, Manipur
            <br />
            Building
          </p>
          <AnimatedThemeToggler
            className="flex size-10 items-center justify-center border border-border bg-transparent text-foreground transition-colors hover:bg-muted"
            variant="circle"
          />
          <NavUser />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border border-border lg:hidden"
                aria-label="Open dashboard navigation"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background" side="right">
              <SheetHeader className="border-b border-border p-6">
                <SheetTitle className="font-serif text-2xl">ARRA</SheetTitle>
                <SheetDescription>Founder workspace</SheetDescription>
              </SheetHeader>
              <nav
                className="flex flex-col p-3"
                aria-label="Mobile admin navigation"
              >
                {navigation.map((item) => (
                  <SheetClose asChild key={item.hash}>
                    <a
                      href={item.hash}
                      aria-current={
                        currentHash === item.hash ? "page" : undefined
                      }
                      className={cn(
                        "border-b border-border px-3 py-4 text-base text-muted-foreground",
                        currentHash === item.hash && "text-primary"
                      )}
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
