"use client"

import { useRef, type FC, type ReactNode } from "react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"
import { DotPattern } from "@/components/dot-pattern"
import { cn } from "@/lib/utils"

const textToReveal = "The storms in our sector have severed connections. But time and space are just pathways waiting to be unlocked. We don't wait for the future to arrive; we step into the void and build the bridge ourselves."

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mx-1.5 lg:mx-2 mt-2">
      {/* Ghost text */}
      <span className="absolute text-foreground/20">{children}</span>
      {/* Revealed text */}
      <motion.span style={{ opacity }} className="relative text-foreground glow-text-subtle">
        {children}
      </motion.span>
    </span>
  )
}

export function EthosSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef })
  
  const words = textToReveal.split(" ")

  return (
    <section id="constellation" ref={sectionRef} className="relative w-full h-[200vh] bg-background">
      {/* Background radial glow - absolute to section, so it stays fixed relative to the 200vh track */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_70%)] opacity-5 blur-3xl pointer-events-none" />

      {/* The sticky viewport container */}
      <div className="sticky top-0 z-10 flex h-screen w-full items-center justify-center px-6 lg:px-12 py-24">
        
        {/* The DotPattern Card (Centered) */}
        <div className="relative flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 p-10 backdrop-blur-md shadow-2xl md:p-16 lg:p-24">
          
          <DotPattern 
            className={cn("[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]", "fill-primary/20")}
            dotSize={0.5}
            width={5}
            height={5}
            cx={1} 
            cy={1} 
          />

          {/* Corner Anchors */}
          <div className="bg-primary/50 absolute -top-1 -left-1 h-2 w-2 rounded-sm shadow-[0_0_10px_var(--color-primary)]" />
          <div className="bg-primary/50 absolute -bottom-1 -left-1 h-2 w-2 rounded-sm shadow-[0_0_10px_var(--color-primary)]" />
          <div className="bg-primary/50 absolute -top-1 -right-1 h-2 w-2 rounded-sm shadow-[0_0_10px_var(--color-primary)]" />
          <div className="bg-primary/50 absolute -right-1 -bottom-1 h-2 w-2 rounded-sm shadow-[0_0_10px_var(--color-primary)]" />

          {/* Animated Text Content */}
          <div className="relative z-20 flex flex-col items-center text-center">
            <p className="text-primary text-sm tracking-[0.2em] uppercase font-bold mb-4">
              / CONSTELLATION
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-white mb-8 md:mb-12">ARRA MANIFESTO</h2>
            
            <div className="flex flex-wrap justify-center text-2xl font-black uppercase tracking-tight md:text-3xl lg:text-4xl xl:text-5xl leading-[1.1] md:leading-[1.1]">
              {words.map((word, i) => {
                const start = i / words.length
                const end = start + 1 / words.length
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]}>
                    {word}
                  </Word>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
