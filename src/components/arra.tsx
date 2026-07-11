import React, { type ReactNode } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export type ArraTone = "light" | "blue" | "split"
export type EngravingTone = "light" | "blue"

export function ArraSection({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "light",
  className,
}: {
  id?: string
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  tone?: ArraTone
  className?: string
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        "arra-section py-20 md:py-28 px-6 md:px-12 lg:px-24",
        tone === "light" && "surface-light",
        tone === "blue" && "surface-blue",
        tone === "split" && "surface-split",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto">
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
    <div className={cn("section-heading pb-14", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="grid gap-7 items-end mt-7 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.65fr)]">
        <h2 className="editorial-heading">{title}</h2>
        <p className="body-copy">{description}</p>
      </div>
    </div>
  )
}

export function ArraReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("arra-reveal", className)}
    >
      {children}
    </motion.div>
  )
}

export function ArraEvidenceItem({
  icon: Icon,
  title,
  body,
  index,
  className,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  body: string
  index?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 p-1 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center size-10 rounded-sm border border-border/40 bg-[var(--arra-mist)] text-[var(--arra-fjord)] transition-colors duration-300 group-hover/trust:bg-[var(--arra-ochre)]/10 group-hover/trust:border-[var(--arra-ochre)]/30 group-hover/trust:text-[var(--arra-ochre)]">
          <Icon className="size-[1.15rem]" strokeWidth={1.5} aria-hidden="true" />
        </div>
        {index !== undefined && (
          <span className="font-mono text-[0.62rem] text-muted-foreground/60 tracking-[0.2em] select-none">
            0{index + 1}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-serif font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover/trust:text-primary">
          {title}
        </h3>
        <p className="text-[0.88rem] leading-relaxed text-muted-foreground/80">
          {body}
        </p>
      </div>
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
      <span className="eyebrow">{label}</span>
      {children}
      {hint ? (
        <span className="text-sm leading-5 opacity-[0.72]">{hint}</span>
      ) : null}
    </label>
  )
}

export function EngravingFigure({
  src,
  alt,
  caption,
  meta,
  tone = "light",
  loading = "lazy",
  className,
  frameClassName,
  imageClassName,
}: {
  src: string
  alt: string
  caption?: ReactNode
  meta?: ReactNode
  tone?: EngravingTone
  loading?: "eager" | "lazy"
  className?: string
  frameClassName?: string
  imageClassName?: string
}) {
  return (
    <figure className={cn("grid bg-background overflow-hidden shadow-sm", className)}>
      <motion.div
        initial={{ clipPath: "inset(10% 0% 100% 0%)", filter: "grayscale(100%) blur(5px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", filter: "grayscale(0%) blur(0px)" }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn("engraving-frame overflow-hidden", frameClassName)}
        data-tone={tone}
      >
        <motion.img
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className={imageClassName}
        />
      </motion.div>
      {caption || meta ? (
        <figcaption className="grid gap-3 p-4 md:p-5">
          {meta ? <p className="eyebrow">{meta}</p> : null}
          {caption ? <div>{caption}</div> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

export const TopographicPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { tone?: EngravingTone }
>(({ className, tone = "light", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "engraving-frame relative min-h-[28rem] overflow-hidden",
        className
      )}
      data-tone={tone}
      {...props}
    />
  )
})
TopographicPanel.displayName = "TopographicPanel"
