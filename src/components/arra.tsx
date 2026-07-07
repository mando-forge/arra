import React, { type ReactNode } from "react"

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
        "arra-section py-16 md:py-20",
        tone === "light" && "surface-light",
        tone === "blue" && "surface-blue",
        tone === "split" && "surface-split",
        className
      )}
    >
      <div className="editorial-shell">
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
    <div
      className={cn(
        "pb-7 md:pb-8",
        className
      )}
    >
      <div className="flex flex-wrap gap-x-5 gap-y-2 pb-4">
        <p className="mono-label">{eyebrow}</p>
      </div>
      <h2 className="editorial-heading mt-7 max-w-5xl">
        {title}
      </h2>
      <div className="mt-7 grid gap-5 pt-5 md:grid-cols-[0.85fr_1fr]">
        <p className="body-copy opacity-[0.82]">{description}</p>
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
  return <div className={cn("arra-reveal", className)}>{children}</div>
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
    <article
      className={cn(
        "grid min-h-40 content-between bg-background shadow-sm p-5 text-foreground md:p-6",
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <div>
        <h3 className="text-base leading-6 font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 opacity-[0.72]">{body}</p>
      </div>
    </article>
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
      <span className="mono-label text-[0.68rem]">{label}</span>
      {children}
      {hint ? (
        <span className="text-xs leading-5 opacity-[0.72]">{hint}</span>
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
      <div
        className={cn("engraving-frame", frameClassName)}
        data-tone={tone}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className={imageClassName}
        />
      </div>
      {caption || meta ? (
        <figcaption className="grid gap-3 p-4 md:p-5">
          {meta ? <p className="mono-label text-[0.64rem]">{meta}</p> : null}
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
