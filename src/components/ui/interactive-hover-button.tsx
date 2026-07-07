import { ArrowRight } from "lucide-react"
import type React from "react"

import { cn } from "@/lib/utils"

type InteractiveHoverButtonBaseProps = {
  children?: React.ReactNode
  className?: string
}

type InteractiveHoverButtonAnchorProps = InteractiveHoverButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type InteractiveHoverButtonButtonProps = InteractiveHoverButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type InteractiveHoverButtonProps =
  | InteractiveHoverButtonAnchorProps
  | InteractiveHoverButtonButtonProps

function isAnchorProps(
  props: InteractiveHoverButtonProps
): props is InteractiveHoverButtonAnchorProps {
  return typeof props.href === "string"
}

export function InteractiveHoverButton(props: InteractiveHoverButtonProps) {
  const { children, className } = props
  const classes = cn(
    "group relative inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-none border bg-background p-2 px-6 text-center font-semibold",
    className
  )

  const inner = (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-none bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight />
      </div>
    </>
  )

  if (isAnchorProps(props)) {
    const { href, ...anchorProps } = props

    return (
      <a {...anchorProps} href={href} className={classes}>
        {inner}
      </a>
    )
  }

  const { href: omittedHref, ...buttonProps } = props
  void omittedHref
  const buttonType = buttonProps.type ?? "button"

  return (
    <button {...buttonProps} type={buttonType} className={classes}>
      {inner}
    </button>
  )
}
