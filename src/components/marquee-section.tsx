import { Marquee } from "@/components/marquee"
import { Button } from "@/components/ui/button"

export function MarqueeSection() {
  return (
    <section className="relative container flex h-[80vh] w-full flex-col items-center justify-center overflow-hidden border-y border-white/10">
      
      {/* CTA-01 Gradient Background Effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(0,255,255,0.15) 0%, #050505 75%)",
          opacity: 1,
        }}
      >
        <div
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
            backgroundImage:
              "repeating-radial-gradient(circle at 50% 100%, transparent 0px, transparent 20px, rgba(0,255,255,0.1) 20px, rgba(0,255,255,0.1) 21px)",
            height: "100%",
            left: "0",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
            opacity: "0.8",
            pointerEvents: "none",
            position: "absolute",
            top: "0",
            width: "100%",
          }}
        />
      </div>

      {/* Relentless Marquee Background */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-10">
        <Marquee className="[--duration:20s]">
          <span className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white uppercase mx-4">
            // BUILD THE BRIDGE // DO NOT WAIT //
          </span>
        </Marquee>
        <Marquee reverse className="[--duration:25s] mt-4">
          <span className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter text-white uppercase mx-4">
            FORGE THE FUTURE // BUILD THE BRIDGE //
          </span>
        </Marquee>
      </div>

      {/* Foreground Brutalist CTA Block */}
      <div className="relative z-20 overflow-hidden bg-black border border-white/10 p-12 md:p-20 shadow-2xl max-w-4xl text-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-[0.2em] uppercase md:text-5xl lg:text-6xl text-white">
            WE ARE SEARCHING FOR ARTISANS IN THE VOID.
          </h1>
          <p className="text-white/60 text-sm md:text-base font-mono tracking-widest uppercase">
            Join the Covert.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-12">
          <Button size="lg" className="rounded-none bg-primary text-black hover:bg-white hover:text-black uppercase tracking-[0.2em] font-bold px-12 shadow-[0_0_15px_var(--color-primary)]">
            Apply to the Guild
          </Button>
        </div>
      </div>
    </section>
  )
}
