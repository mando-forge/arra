import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Glare effect uses standard white, but opacity is kept very low to stay monochrome/brand-compliant
  const glareX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const glareY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const background = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current || shouldReduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    
    const xPct = localX / width - 0.5;
    const yPct = localY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
    
    mouseX.set((localX / width) * 100);
    mouseY.set((localY / height) * 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(50);
    mouseY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative group transition-transform duration-300 ease-out will-change-transform", className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 mix-blend-screen opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:opacity-0 dark:group-hover:opacity-15"
        style={{ background: shouldReduceMotion ? "none" : background }}
      />
      <div
        style={{
          transform: "translateZ(15px)",
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}
