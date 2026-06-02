import { BentoGrid, BentoGridItem } from "@/components/bento"
import { GridPattern } from "@/components/grid-pattern"
import { Button } from "@/components/ui/button"
import { GlobalWrapper } from "@/components/layout/global-wrapper"

export function BentoSection() {
  return (
    <section id="pathfinders" className="py-24">
      <GlobalWrapper>
        <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.2em] uppercase text-white">THE PATHFINDERS</h2>
            <p className="mt-4 text-sm tracking-[0.2em] text-white/50 uppercase">OLIVER. O AND OMEGA. N ARE NOT JUST ARMORERS; THEY ARE NAVIGATORS MAPPING THE UNKNOWN.</p>
        </div>
        <BentoGrid
            cols={{ base: 2, md: 3, lg: 4 }}
            rowHeight={{ base: "180px", md: "220px", lg: "240px" }}
            gap={0}
            className="group/bento rounded-none border border-white/10"
        >
            <BentoGridItem colSpan={2} rowSpan={2} className="relative overflow-hidden rounded-none border-white/10 bg-black p-0 transition-all duration-300 group-hover/bento:opacity-60 hover:!opacity-100 hover:shadow-[0_0_15px_var(--color-primary)] focus-within:!opacity-100">
            <div className="relative flex h-full flex-col justify-between p-8">
                <img src="/nexus-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" decoding="async" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
                <GridPattern
                width={80}
                height={80}
                squares={[
                    [6, 2],
                    [2, 3],
                    [4, 4],
                    [1, 5],
                    [5, 5]
                ]}
                className="opacity-50"
                />
                <div>
                <h3 className="relative text-3xl font-semibold tracking-widest uppercase text-white md:text-5xl lg:text-5xl">
                    The<br />Navigators.
                </h3>
                <p className="relative mt-4 max-w-md font-mono text-sm text-white/60 md:text-base">
                    Plotting courses through chaotic data streams to find safe harbors in emerging tech. We harness raw energy and forge it into structured pathways.
                </p>
                </div>

                <div className="relative z-10 flex gap-3 mt-8">
                <Button asChild size="lg" className="border-primary bg-transparent text-xs tracking-widest text-primary uppercase hover:bg-primary/10 hover:text-primary">
                  <a href="#resonance">Initialize Contact</a>
                </Button>
                </div>
            </div>
            </BentoGridItem>

            <BentoGridItem className="rounded-none border-white/10 bg-black/50 transition-all duration-300 group-hover/bento:opacity-60 hover:!opacity-100 hover:shadow-[0_0_15px_var(--color-primary)]">
            <div className="flex h-full flex-col justify-between p-2">
                <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">The Nexus</span>
                <p className="text-sm font-medium text-white/80 font-mono">
                Why stealth mode? Because you do not open a door to the public until you know exactly where the pathway leads.
                </p>
            </div>
            </BentoGridItem>

            <BentoGridItem className="rounded-none border-white/10 bg-black/50 transition-all duration-300 group-hover/bento:opacity-60 hover:!opacity-100 hover:shadow-[0_0_15px_var(--color-primary)]">
            <div className="flex h-full flex-col justify-between p-2">
                <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">Methodology</span>
                <p className="text-sm font-medium text-white/80 font-mono">
                Mapping the void takes patience.
                </p>
                <p className="text-white/50 text-xs font-mono mt-2">
                We build the architecture, secure the endpoints, and only then do we illuminate the bridge.
                </p>
            </div>
            </BentoGridItem>

            <BentoGridItem colSpan={2} className="rounded-none border-white/10 bg-black/50 transition-all duration-300 group-hover/bento:opacity-60 hover:!opacity-100 hover:shadow-[0_0_15px_var(--color-primary)]">
            <div className="flex h-full flex-col justify-between p-2">
                <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
                Active Operation
                </span>
                <div>
                <h2 className="text-2xl font-semibold tracking-widest uppercase text-white">
                    PROJECT VERGENCE
                </h2>
                <p className="text-white/60 mt-2 text-sm font-mono">
                    Hardening core systems before mass deployment. All data restricted.
                </p>
                </div>
            </div>
            </BentoGridItem>
        </BentoGrid>
      </GlobalWrapper>
    </section>
  )
}
