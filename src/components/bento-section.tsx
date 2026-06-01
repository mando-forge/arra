import { BentoGrid, BentoGridItem } from "@/components/bento"
import { GridPattern } from "@/components/grid-pattern"
import { Button } from "@/components/ui/button"
import { GlobalWrapper } from "@/components/layout/global-wrapper"

export function BentoSection() {
  return (
    <section className="py-24">
      <GlobalWrapper>
        <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.2em] uppercase text-white">THE PATHFINDERS</h2>
            <p className="mt-4 text-sm tracking-[0.2em] text-white/50 uppercase">OLIVER. O AND OMEGA. N ARE NOT JUST ARMORERS; THEY ARE NAVIGATORS MAPPING THE UNKNOWN.</p>
        </div>
        <BentoGrid
            cols={{ base: 2, md: 3, lg: 4 }}
            rowHeight={{ base: "180px", md: "220px", lg: "240px" }}
            gap={0}
            className="rounded-none border border-white/10"
        >
            <BentoGridItem colSpan={2} rowSpan={2} className="rounded-none p-0 border-white/10 bg-black">
            <div className="relative flex h-full flex-col justify-between p-8">
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
                <h1 className="text-3xl font-semibold tracking-widest uppercase md:text-5xl lg:text-5xl text-white">
                    The<br />Navigators.
                </h1>
                <p className="text-white/60 mt-4 max-w-md text-sm md:text-base font-mono">
                    Plotting courses through chaotic data streams to find safe harbors in emerging tech. We harness raw energy and forge it into structured pathways.
                </p>
                </div>

                <div className="relative z-10 flex gap-3 mt-8">
                <Button size="lg" className="rounded-none bg-primary text-black hover:bg-white hover:text-black uppercase tracking-widest text-xs">Initialize Contact</Button>
                </div>
            </div>
            </BentoGridItem>

            <BentoGridItem className="rounded-none border-white/10 bg-black/50">
            <div className="flex h-full flex-col justify-between p-2">
                <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">The Nexus</span>
                <p className="text-sm font-medium text-white/80 font-mono">
                Why stealth mode? Because you do not open a door to the public until you know exactly where the pathway leads.
                </p>
            </div>
            </BentoGridItem>

            <BentoGridItem className="rounded-none border-white/10 bg-black/50">
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

            <BentoGridItem colSpan={2} className="rounded-none border-white/10 bg-black/50">
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
