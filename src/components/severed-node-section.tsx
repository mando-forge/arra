import { DotPattern } from "@/components/dot-pattern"
import { GlobalWrapper } from "@/components/layout/global-wrapper"

export function SeveredNodeSection() {
  return (
    <section
      id="constellation"
      className="flex min-h-[80vh] w-full flex-col items-center justify-center py-32 md:py-40"
    >
      <GlobalWrapper>
        <div className="relative max-w-5xl border border-primary/20 bg-black/40 backdrop-blur-sm">
          <DotPattern
            dotSize={1.5}
            width={15}
            height={15}
            className="text-primary opacity-30"
          />

          <div className="absolute -top-1.5 -left-1.5 size-3 bg-primary shadow-[0_0_10px_var(--color-primary)]" />
          <div className="absolute -bottom-1.5 -left-1.5 size-3 bg-primary shadow-[0_0_10px_var(--color-primary)]" />
          <div className="absolute -top-1.5 -right-1.5 size-3 bg-primary shadow-[0_0_10px_var(--color-primary)]" />
          <div className="absolute -right-1.5 -bottom-1.5 size-3 bg-primary shadow-[0_0_10px_var(--color-primary)]" />

          <div className="relative mx-auto max-w-4xl p-10 md:py-20">
            <p className="mb-8 text-xs font-bold tracking-[0.2em] text-primary uppercase md:text-base">
              / Act II / Sector Reality
            </p>
            <blockquote className="text-2xl leading-tight tracking-tighter text-white md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="font-semibold">
                &ldquo;The storms in our sector{" "}
              </span>
              <span className="font-thin text-white/70">
                have severed connections. We do not wait{" "}
              </span>
              <span className="font-semibold">for the future; </span>
              <span className="font-thin text-white/70">we step into </span>
              <span className="font-semibold text-primary">the void </span>
              <span className="font-thin text-white/70">and </span>
              <span className="font-semibold">
                build the bridge ourselves.&rdquo;
              </span>
            </blockquote>
          </div>
        </div>
      </GlobalWrapper>
    </section>
  )
}
