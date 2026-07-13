import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import Lenis from "lenis"
import { Header } from "@/layout/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const ChatWidget = lazy(() =>
  import("@/components/chat-widget").then((module) => ({ default: module.ChatWidget }))
)

function DeferredChatWidget() {
  const [shouldLoad, setShouldLoad] = useState(false)

  if (shouldLoad) {
    return (
      <Suspense
        fallback={
          <div
            role="status"
            className="fixed right-4 bottom-4 z-40 flex h-14 items-center gap-3 bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg sm:right-6 sm:bottom-6 xl:right-12 xl:bottom-8 3xl:right-16"
          >
            Opening ARRA…
          </div>
        }
      >
        <ChatWidget initiallyOpen />
      </Suspense>
    )
  }

  return (
    <button
      type="button"
      aria-label="Open ARRA chat"
      aria-haspopup="dialog"
      onClick={() => setShouldLoad(true)}
      className="group fixed right-4 bottom-4 z-40 flex h-14 items-center justify-center gap-3 rounded-none bg-primary px-4 text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:outline-none sm:right-6 sm:bottom-6 xl:right-12 xl:bottom-8 3xl:right-16"
    >
      <span className="relative">
        <MessageSquare className="size-5" aria-hidden="true" />
        <span
          className="absolute -top-1 -right-1 size-2.5 rounded-none border-2 border-primary bg-emerald-400 motion-safe:animate-pulse"
          aria-hidden="true"
        />
      </span>
      <span className="hidden text-sm font-semibold sm:inline">Ask ARRA</span>
    </button>
  )
}

export function RootLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const lenisRef = useRef<Lenis | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) {
      lenisRef.current?.destroy()
      lenisRef.current = null
      return
    }

    // Initialize Lenis for premium smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    let rafId: number
    function raf(time: number) {
      lenisRef.current?.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenisRef.current?.destroy()
    }
  }, [shouldReduceMotion])

  useEffect(() => {
    window.scrollTo(0, 0)
    // Also reset Lenis scroll position on route change
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + M (or Cmd + Shift + M)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        navigate("/admin")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigate])

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-background"
        >
          Skip to content
        </a>

        {/* Viewport & Rails (The Outer Frame) */}
        <div className="fixed left-4 xl:left-8 3xl:left-12 top-0 bottom-0 w-px bg-border hidden xl:flex flex-col justify-between py-12 z-40 pointer-events-none">
          <span className="font-mono text-[0.65rem] font-semibold tracking-[0.32em] uppercase text-foreground/70" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Arra Research</span>
          <strong className="font-mono text-[0.7rem] tracking-[0.12em] text-foreground/70" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Est. 2026</strong>
        </div>
        
        <div className="fixed right-4 xl:right-8 3xl:right-12 top-0 bottom-0 w-px bg-border hidden xl:flex flex-col justify-between py-12 z-40 pointer-events-none">
          <span className="font-mono text-[0.65rem] font-semibold tracking-[0.32em] uppercase text-foreground/70" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Nordic field journal</span>
        </div>

        {/* Main Centered Wrapper */}
        <div className="relative z-10 max-w-7xl 3xl:max-w-[90rem] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 3xl:px-20 min-h-screen flex flex-col">
          <Header />
          <main className="flex flex-1 flex-col" id="main-content" tabIndex={-1}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-1 flex-col"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
        {pathname !== "/contact" ? <DeferredChatWidget /> : null}
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
