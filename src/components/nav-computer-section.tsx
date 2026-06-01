import { Timeline } from "@/components/timeline"
import { ShineBorder } from "@/components/shine-border"
import { GlobalWrapper } from "@/components/layout/global-wrapper"

export function NavComputerSection() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 py-32">
      <GlobalWrapper>
        <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-[0.2em] uppercase text-white mb-4">THE NAV-COMPUTER</h2>
            <p className="text-primary text-sm font-mono uppercase tracking-[0.2em]">Trajectory calculated. Awaiting execution.</p>
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
