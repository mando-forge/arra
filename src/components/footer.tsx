import { Link, useNavigate } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const navigate = useNavigate()
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Our Work", href: "/work" },
    { label: "Contact", href: "/contact" },
  ]

  const handleAdminRedirect = () => {
    navigate("/admin")
  }

  return (
    <footer className="bg-background pb-10 md:pb-12 pt-10 mt-10 relative px-6 md:px-12 lg:px-24">
      <Separator className="absolute top-0 left-0 w-full" />
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <Link
              to="/"
              className="font-sans text-2xl font-medium leading-none tracking-[0.18em]"
              aria-label="ARRA-CORE home"
            >
              ARRA-CORE
            </Link>
            <p className="compact-copy mt-4 text-foreground/64">
              Building web applications for community growth in Imphal, Manipur.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:justify-end"
            aria-label="Footer"
          >
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-foreground/64 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-9" />
        <div className="flex flex-col gap-4 text-xs text-foreground/58 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ARRA-CORE <span className="cursor-pointer select-none font-mono opacity-20 hover:opacity-100 transition-opacity ml-1 animate-pulse" onDoubleClick={handleAdminRedirect}>▒</span></p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>Imphal, Manipur · Bootstrapped</span>
            <a
              className="transition-colors hover:text-foreground"
              href="mailto:transmission@arra-core.tech"
            >
              transmission@arra-core.tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
