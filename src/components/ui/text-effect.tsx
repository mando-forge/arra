import { type CSSProperties } from "react"
import { motion, type Variants } from "motion/react"

import { cn } from "@/lib/utils"

type TextEffectPreset = "fade" | "slide" | "blur"

type TextEffectProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span"
  children: string
  className?: string
  delay?: number
  per?: "word" | "line"
  preset?: TextEffectPreset
  speedReveal?: number
  style?: CSSProperties
}

const itemPresets: Record<TextEffectPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: "0.6em" },
    visible: { opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, y: "0.55em", filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
}

const motionElements = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
}

export function TextEffect({
  as = "p",
  children,
  className,
  delay = 0,
  per = "word",
  preset = "blur",
  speedReveal = 1,
  style,
}: TextEffectProps) {
  const MotionComponent = motionElements[as]
  const segments =
    per === "line"
      ? children.split("\n").filter(Boolean)
      : children.split(/(\s+)/).filter((segment) => segment.length > 0)

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      animate="visible"
      style={style}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.035 / speedReveal,
          },
        },
      }}
    >
      {segments.map((segment, index) => {
        const isSpace = /^\s+$/.test(segment)

        if (isSpace) {
          return segment
        }

        return (
          <motion.span
            key={`${segment}-${index}`}
            className={cn(per === "line" ? "block" : "inline-block")}
            variants={itemPresets[preset]}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            {segment}
          </motion.span>
        )
      })}
    </MotionComponent>
  )
}
