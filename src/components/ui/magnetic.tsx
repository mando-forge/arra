import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function Magnetic({ children, strength = 0.35, className }: { children: React.ReactElement<{ className?: string; ref?: React.Ref<any> }>, strength?: number, className?: string }) {
  const magnetic = useRef<HTMLElement>(null)
  
  // Track if we are hovering
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const element = magnetic.current
    if (!element || shouldReduceMotion) return

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" })
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" })

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { height, width, left, top } = element.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      xTo(x * strength)
      yTo(y * strength)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      xTo(0)
      yTo(0)
    }
    
    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)
    element.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
      element.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [strength])

  return React.cloneElement(children, { 
    ref: magnetic,
    className: cn(children.props.className, className, isHovered && "z-10")
  })
}
