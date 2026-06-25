import { Timeline } from "@/components/timeline"
import { ShineBorder } from "@/components/shine-border"
import { GlobalWrapper } from "@/components/layout/global-wrapper"

export function NavComputerSection() {
  return (
    <section id="nav-computer" className="w-full py-32 bg-background border-t border-white/5">
      <GlobalWrapper>
        <div className="mb-16 text-center">
            <p className="text-primary text-sm tracking-[0.2em] uppercase font-bold mb-4">/ TRAJECTORY</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-white leading-[0.95]">NAV-COMPUTER</h2>
            <p className="mt-8 text-sm tracking-[0.2em] text-white/50 uppercase font-mono max-w-sm mx-auto">TRAJECTORY CALCULATED. AWAITING EXECUTION.</p>
        </div>
        <ShineBorder
            borderRadius={0}
            borderWidth={2}
            className="mx-auto w-full max-w-4xl bg-black"
        >
            <div className="p-10 md:p-16 w-full text-left">
            <Timeline />
            <div className="bg-primary/5 absolute inset-0 -z-10 blur-3xl pointer-events-none" />
            </div>
        </ShineBorder>
      </GlobalWrapper>
    </section>
  )
}
