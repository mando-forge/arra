import React, { type ReactNode } from "react"

import { DecorIcon } from "@/components/decor-icon"
import { FullWidthDivider } from "@/components/full-width-divider"
import { LazyImage } from "@/components/lazy-image"
import { ProgressiveBlur } from "@/components/progressive-blur"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { MagicCard } from "@/components/ui/magic-card"
import { NoiseTexture } from "@/components/ui/noise-texture"
import { cn } from "@/lib/utils"

type Tone = "default" | "soft" | "panel"

export function ArraSection({
  id,
  eyebrow,
  title,
  description,
  tone = "default",
  children,
  className,
}: {
  id?: string
  eyebrow: string
  title: string
  description: string
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        "arra-section relative isolate overflow-hidden border-b border-border/55 py-24 md:py-36",
        tone === "soft" && "bg-muted/35",
        tone === "panel" && "bg-card/45",
        className
      )}
    >
      <NoiseTexture
        aria-hidden="true"
        frequency={0.72}
        octaves={3}
        slope={0.11}
        noiseOpacity={0.22}
        className="opacity-[0.055]"
      />
      <FullWidthDivider position="top" className="opacity-35" />
      <ArraJourneyRails variant="section" />
      <div className="container-enterprise relative">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string
  title: string
  description: string
  className?: string
}) {
  return (
    <div className={cn("maker-mark max-w-3xl pt-6", className)}>
      <p className="mb-5 text-xs font-mono font-medium tracking-[0.25em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="max-w-2xl text-3xl leading-tight font-medium text-balance text-foreground md:text-[2.85rem]">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
        {description}
      </p>
    </div>
  )
}

export function ArraBentoGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(210px,auto)] gap-4 md:grid-cols-6 md:gap-5",
        className
      )}
    >
      {children}
    </div>
  )
}

export function ArraBentoCard({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <MagicCard
      gradientSize={240}
      gradientColor="color-mix(in oklch, var(--primary) 12%, transparent)"
      gradientFrom="color-mix(in oklch, var(--primary) 35%, transparent)"
      gradientTo="color-mix(in oklch, var(--accent) 30%, transparent)"
      gradientOpacity={0.85}
      className={cn(
        "nordic-panel group relative h-full overflow-hidden rounded-lg border border-border/75 bg-card/78 p-6 shadow-none transition-colors hover:border-primary/45",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      </div>
      {children}
    </MagicCard>
  )
}

export function ArraGlowFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "nordic-panel relative overflow-hidden rounded-lg border border-border/75 bg-card/82",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_9%,transparent),transparent_34%,color-mix(in_oklch,var(--accent)_8%,transparent)_100%)] before:opacity-65",
        className
      )}
    >
      <ArraCornerMarks />
      <BorderBeam
        size={86}
        duration={14}
        borderWidth={1}
        colorFrom="color-mix(in oklch, var(--primary) 70%, transparent)"
        colorTo="color-mix(in oklch, var(--accent) 56%, transparent)"
        className="opacity-55 motion-reduce:hidden"
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export function ArraJourneyRails({
  variant = "page",
  className,
}: {
  variant?: "page" | "section"
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-[min(calc(100%_-_3rem),80rem)] -translate-x-1/2",
        variant === "page" && "fixed z-0 opacity-35",
        variant === "section" && "opacity-25",
        className
      )}
    >
      <span className="absolute inset-y-0 left-0 w-px bg-border/45 max-lg:hidden" />
      <span className="absolute inset-y-0 right-0 w-px bg-border/45 max-lg:hidden" />
      <DecorIcon
        position="top-left"
        className="top-8 size-4 stroke-primary/35 max-lg:hidden"
      />
      <DecorIcon
        position="top-right"
        className="top-8 size-4 stroke-primary/35 max-lg:hidden"
      />
    </div>
  )
}

export function ArraProgressiveBlur({
  placement = "top",
  className,
}: {
  placement?: "top" | "bottom"
  className?: string
}) {
  return (
    <ProgressiveBlur
      direction={placement}
      blurIntensity={0.55}
      blurLayers={5}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 h-20",
        placement === "top" ? "top-0" : "bottom-0",
        className
      )}
    />
  )
}

export function ArraWaypoint({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-3 shrink-0 place-items-center rounded-[2px] border border-primary/35 bg-background",
        "after:size-1 after:rounded-[1px] after:bg-primary/70",
        className
      )}
    />
  )
}

export function ArraCornerMarks() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    >
      <DecorIcon
        position="top-left"
        className="size-4 stroke-primary/35 opacity-60"
      />
      <DecorIcon
        position="top-right"
        className="size-4 stroke-primary/35 opacity-60"
      />
      <DecorIcon
        position="bottom-left"
        className="size-4 stroke-primary/35 opacity-60"
      />
      <DecorIcon
        position="bottom-right"
        className="size-4 stroke-primary/35 opacity-60"
      />
    </div>
  )
}

export function ArraReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <BlurFade
      inView
      delay={delay / 1000}
      duration={0.62}
      offset={10}
      blur="4px"
      className={className}
    >
      {children}
    </BlurFade>
  )
}

export function ArraDeviceFrame({
  image,
  alt,
  className,
}: {
  image: string
  alt: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "nordic-panel rounded-lg border border-border/75 bg-card/78 p-2 shadow-none",
        className
      )}
    >
      <LazyImage
        src={image}
        alt={alt}
        ratio={16 / 10}
        inView
        className="rounded-md object-cover"
        containerClassName="rounded-md border-0 bg-background/30"
      />
    </div>
  )
}

export function ArraImage({
  src,
  alt,
  ratio,
  inView = true,
  className,
  containerClassName,
}: {
  src: string
  alt: string
  ratio: number
  inView?: boolean
  className?: string
  containerClassName?: string
}) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      ratio={ratio}
      inView={inView}
      className={cn("object-cover", className)}
      containerClassName={cn("border-0 bg-background/35", containerClassName)}
    />
  )
}

export function ArraGauge({
  value,
  label,
  title,
  description,
}: {
  value: number
  label: string
  title: string
  description: string
}) {
  const normalized = Math.max(0, Math.min(100, value))
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (normalized / 100) * circumference

  return (
    <div className="nordic-panel rounded-lg border border-border bg-card/82 p-5">
      <div className="flex items-start gap-5">
        <div className="relative grid size-24 shrink-0 place-items-center">
          <svg
            className="size-24 -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              className="text-border"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-lg font-semibold text-foreground">
            {normalized}
          </span>
        </div>
        <div>
          <p className="text-xs font-mono font-medium tracking-[0.25em] text-primary uppercase">
            {label}
          </p>
          <h3 className="mt-3 text-lg font-semibold text-card-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ArraEvidenceItem({
  icon: Icon,
  title,
  body,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "nordic-panel rounded-lg border border-border/75 bg-card/72 p-5",
        className
      )}
    >
      <Icon className="mb-5 size-5 text-primary/80" />
      <h3 className="font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  )
}

export function ArraField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
      {hint ? (
        <span className="text-xs leading-5 text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  )
}

export const TopographicPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "nordic-panel relative overflow-hidden rounded-lg border border-border/75 bg-card/78",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(color-mix(in_oklch,var(--border)_45%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklch,var(--border)_45%,transparent)_1px,transparent_1px)] after:bg-[size:96px_96px] after:opacity-20",
        className
      )}
      {...props}
    />
  )
})
TopographicPanel.displayName = "TopographicPanel"
