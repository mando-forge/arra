import { Children, type ReactNode } from "react"
import { motion, type Variants } from "motion/react"

import { cn } from "@/lib/utils"

type AnimatedGroupPreset = "fade" | "slide" | "scale" | "blur-slide"

const itemPresets: Record<AnimatedGroupPreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
  "blur-slide": {
    hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
}

type AnimatedGroupProps = {
  as?: "div" | "section" | "ul"
  children: ReactNode
  className?: string
  delay?: number
  itemClassName?: string
  once?: boolean
  preset?: AnimatedGroupPreset
  staggerDelay?: number
}

const motionElements = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
}

export function AnimatedGroup({
  as = "div",
  children,
  className,
  delay = 0,
  itemClassName,
  once = true,
  preset = "blur-slide",
  staggerDelay = 0.08,
}: AnimatedGroupProps) {
  const MotionComponent = motionElements[as]

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {Children.map(children, (child) => (
        <motion.div
          className={cn("min-w-0", itemClassName)}
          variants={itemPresets[preset]}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </MotionComponent>
  )
}
