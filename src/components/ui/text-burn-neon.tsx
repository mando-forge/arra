"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

interface TextBurnNeonProps {
  children: string;
  className?: string;
  duration?: number;
  repeat?: boolean;
  repeatDelay?: number;
}

export default function TextBurnNeon({
  children,
  className = "",
  duration = 2,
  repeat = true,
  repeatDelay = 30,
}: TextBurnNeonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;
      const targetColor = window.getComputedStyle(textRef.current).color;

      const split = new SplitText(textRef.current, { type: "chars" });
      const chars = split.chars;

      const masterTl = gsap.timeline({
        repeat: repeat ? -1 : 0,
        repeatDelay: repeatDelay,
      });

      // ARRA Theme colors: Purple (#8B5CF6) and Cyan (#00f0ff)
      masterTl.set(chars, {
        opacity: 0,
        color: "#8B5CF6",
        textShadow: "0 0 0px #8B5CF6",
      });

      chars.forEach((char) => {
        const delay = Math.random() * 0.5;
        const tl = gsap.timeline({ delay });

        tl.to(char, {
          opacity: 1,
          duration: 0.05,
          repeat: 5,
          yoyo: true,
          ease: "none",
        });

        tl.to(char, {
          opacity: 1,
          color: "#A78BFA",
          textShadow: "0 0 20px #8B5CF6, 0 0 40px #A78BFA",
          duration: 0.3,
          ease: "power2.in",
        });

        tl.to(char, {
          color: "#ffffff",
          textShadow: "0 0 10px #ffffff, 0 0 20px #00f0ff",
          duration: 0.4,
          ease: "power2.out",
        });

        tl.to(char, {
          color: targetColor,
          textShadow: "none",
          duration: 0.5,
          ease: "power2.out",
          clearProps: "color,textShadow"
        });

        masterTl.add(tl, 0);
      });
    },
    { scope: containerRef, dependencies: [children, duration] }
  );

  return (
    <div ref={containerRef} className={cn("inline-block", className)}>
      <span ref={textRef}>{children}</span>
    </div>
  );
}
