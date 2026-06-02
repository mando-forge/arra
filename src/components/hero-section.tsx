import { ArrowDownRight } from "lucide-react"

import { GlobalWrapper } from "@/components/layout/global-wrapper"
import { Button } from "@/components/ui/button"
import TextMatrixRain from "@/components/ui/text-matrix-rain"

const stats = [
  ["ORIGIN", "MANIPUR, EARTH"],
  ["STATUS", "OPERATING FROM THE COVERT"],
  ["PROTOCOL", "STEP BY STEP // LINE BY LINE"],
]

export function HeroSection() {
  return (
    <section
      id="nexus-gateway"
      className="relative flex min-h-screen flex-col overflow-hidden border-b border-white/10 pt-24"
    >
      <div className="absolute inset-0">
        <img
          src="/images/hero-sci-fi.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklch,var(--background)_88%,transparent)_30%,color-mix(in_oklch,var(--background)_28%,transparent)_72%,color-mix(in_oklch,var(--background)_70%,transparent)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--background)_0%,transparent_42%,color-mix(in_oklch,var(--background)_40%,transparent)_100%)]" />
      </div>

      <p className="pointer-events-none absolute top-1/4 left-0 w-full px-[5vw] text-center text-[18vw] leading-none font-black tracking-[-0.03em] text-white/[0.05] uppercase">
        Mokoro
      </p>

      <GlobalWrapper className="relative z-10 flex flex-1 flex-col justify-center pb-12">
        <div className="max-w-5xl">
          <p className="mb-6 text-xs font-bold tracking-[0.3em] text-primary uppercase md:text-sm">
            / Gateway 01 / Manipur Sector
          </p>
          <h1 className="max-w-5xl text-5xl leading-[0.95] font-black tracking-tight text-white uppercase sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem]">
            <TextMatrixRain duration={2} accentColor="#00f0ff" className="block">
              WHERE INNOVATION
            </TextMatrixRain>
            <TextMatrixRain 
              duration={2.5} 
              accentColor="#00f0ff" 
              className="block"
              charClassName="bg-gradient-to-b from-white to-white/35 bg-clip-text text-transparent"
            >
              SHAPES TOMORROW
            </TextMatrixRain>
          </h1>
          <p className="mt-8 max-w-xl border-l border-primary/60 pl-4 font-mono text-sm leading-6 tracking-[0.18em] text-white/[0.85] uppercase md:text-base">
            Exploring new frontiers of technology, creativity, and human potential.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="border-primary bg-transparent px-6 font-bold tracking-[0.2em] text-primary uppercase shadow-[0_0_15px_var(--color-primary)] hover:bg-primary/10 hover:text-primary"
            >
              <a href="#constellation">Initialize Sequence</a>
            </Button>
            <a
              href="#pathfinders"
              className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-primary"
            >
              Portal locked <ArrowDownRight className="size-4" />
            </a>
          </div>
        </div>
      </GlobalWrapper>

      <GlobalWrapper className="relative z-10 pb-6 md:pb-8">
        <div className="grid border border-white/15 bg-black/45 backdrop-blur-md md:grid-cols-3">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="border-white/10 p-4 not-last:border-b md:not-last:border-r md:not-last:border-b-0"
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase">
                {label}
              </p>
              <p className="mt-2 font-mono text-xs tracking-[0.14em] text-white/75 uppercase">
                {value}
              </p>
            </div>
          ))}
        </div>
      </GlobalWrapper>
    </section>
  )
}
