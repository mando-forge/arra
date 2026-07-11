import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useInView } from "framer-motion"

interface TextScrambleProps {
  text: string
  speed?: number
  className?: string
  scrambleOnHover?: boolean
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+="

export function TextScramble({ text, speed = 30, className, scrambleOnHover = false }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [prevText, setPrevText] = useState(text)
  const isScrambling = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  if (text !== prevText) {
    setPrevText(text)
    setDisplayText(text)
  }

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    isScrambling.current = false
  }, [text])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const scramble = useCallback(() => {
    if (isScrambling.current) return
    isScrambling.current = true
    
    let iteration = 0
    const maxIterations = text.length
    
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setDisplayText(() => 
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index]
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
          })
          .join("")
      )
      
      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        isScrambling.current = false
        setDisplayText(text)
      }
      
      iteration += 1 / 3
    }, speed)
  }, [text, speed])

  useEffect(() => {
    if (isInView && !scrambleOnHover) {
      // Use setTimeout to avoid synchronous setState inside render/effect phase
      const timeout = setTimeout(scramble, 0)
      return () => clearTimeout(timeout)
    }
  }, [isInView, scrambleOnHover, scramble])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <motion.span 
      ref={ref}
      className={className}
      onMouseEnter={scrambleOnHover ? scramble : undefined}
    >
      {displayText}
    </motion.span>
  )
}
