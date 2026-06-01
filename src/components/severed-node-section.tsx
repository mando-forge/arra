import { DotPattern } from "@/components/dot-pattern"
import { GlobalWrapper } from "@/components/layout/global-wrapper"

export function SeveredNodeSection() {
  return (
    <div className="container flex min-h-[70vh] w-full flex-col items-center justify-center py-20">
      <GlobalWrapper>
      <div className="border-primary/20 relative flex flex-col items-center rounded-none border bg-black/40 backdrop-blur-sm">
        <DotPattern dotSize={1.5} width={15} height={15} className="opacity-30" />

        <div className="bg-primary absolute -top-1.5 -left-1.5 h-3 w-3 rounded-none text-white shadow-[0_0_10px_var(--color-primary)]" />
        <div className="bg-primary absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-none text-white shadow-[0_0_10px_var(--color-primary)]" />
        <div className="bg-primary absolute -top-1.5 -right-1.5 h-3 w-3 rounded-none text-white shadow-[0_0_10px_var(--color-primary)]" />
        <div className="bg-primary absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-none text-white shadow-[0_0_10px_var(--color-primary)]" />

        <div className="relative p-10 md:py-20 max-w-4xl mx-auto">
          <p className="md:text-md text-primary text-xs lg:text-lg xl:text-2xl mb-8 tracking-[0.2em] uppercase font-bold">
            Sector Reality
          </p>
          <div className="text-2xl tracking-tighter md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 xl:gap-5">
              <h1 className="font-semibold text-white">&quot;The storms in our sector</h1>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 xl:gap-5 mt-2">
              <p className="font-thin text-white/80">have severed</p>
              <h1 className="font-semibold text-white">connections.</h1>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 xl:gap-5 mt-2">
              <p className="font-thin text-white/80">We do not wait</p>
              <h1 className="font-semibold text-white">for the future;</h1>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 xl:gap-5 mt-2">
              <p className="font-thin text-white/80">we step into</p>
              <h1 className="font-semibold text-primary">the void</h1>
              <p className="font-thin text-white/80">and</p>
            </div>
            <div className="mt-2">
                <h1 className="font-semibold text-white">build the bridge ourselves.&quot;</h1>
            </div>
          </div>
        </div>
      </div>
      </GlobalWrapper>
    </div>
  )
}
