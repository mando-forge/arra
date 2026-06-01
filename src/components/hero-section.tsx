import { ArrowDownRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden py-20 pt-32">
      <div className="relative z-20 mx-auto max-w-7xl px-6">
        <div className="relative">
          <p className="absolute -top-4 left-20 text-sm font-medium tracking-[0.2em] uppercase text-primary">
            Initialize Sequence
          </p>
          <h1
            className="text-primary relative z-20 text-center text-7xl font-bold tracking-[-7px] md:text-9xl md:tracking-[-14px] xl:text-[10rem] xl:tracking-[-1rem] font-sans"
          >
            THE PATHWAY
          </h1>
          <p className="absolute right-24 -bottom-12 hidden text-4xl font-thin tracking-[6px] xl:block opacity-20">
            MOKORO
          </p>
          <p className="absolute -bottom-12 left-24 text-4xl font-thin tracking-[6px] xl:hidden opacity-20">
            MOKORO
          </p>
        </div>

        <div className="relative grid">
          <div className="flex justify-center gap-6 space-y-8 pt-20">
            <div className="bg-secondary/10 border border-white/5 flex h-fit w-full max-w-xl items-end gap-6 space-y-2 p-10 text-xl font-bold md:text-2xl lg:text-3xl backdrop-blur-md">
              <div className="text-xl font-semibold tracking-widest text-white/80">
                <div className="mb-2">/ STEALTH MODE</div>
                <div className="mb-2">/ O & OMEGA.N ARCHITECTURE</div>
                <div>/ MANIPUR SECTOR</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-40">
          <p className="mx-auto max-w-2xl text-center font-mono text-sm font-medium tracking-widest md:text-base text-white/70">
            THE PATHWAY BETWEEN WHAT IS,
            <br />
            AND WHAT CAN BE.
            <br />
            A GATEWAY INTO THE VOID.
          </p>
        </div>
        <div className="flex justify-center pt-6">
          <Button size={"lg"} className="rounded-none border border-primary bg-transparent text-primary hover:bg-primary hover:text-black uppercase tracking-[0.2em] shadow-[0_0_15px_var(--color-primary)]">Initialize Sequence</Button>
        </div>

        <div className="mt-20 items-end justify-between md:flex">
          <div className="relative">
             {/* Empty for brutalist layout balance */}
          </div>
          <div>
            <div className="flex items-center gap-2 md:justify-end text-primary">
              <span className="text-lg font-medium tracking-wider">
                PORTAL LOCKED
              </span>
              <ArrowDownRight className="size-6" />
            </div>

            <div className="mt-3 md:text-right">
              <h2
                className="text-5xl tracking-[-4px] uppercase text-white font-sans"
              >
                Enter the Void
              </h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Brutalist Grid Background */}
      <div
        className="absolute inset-0 z-0 block"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
            radial-gradient(ellipse 70% 60% at 50% 30%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </section>
  )
}
