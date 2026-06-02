"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface TextMatrixRainProps {
  children: string;
  className?: string;
  charClassName?: string;
  duration?: number;
  repeat?: boolean;
  accentColor?: string;
}

export default function TextMatrixRain({
  children,
  className = "",
  charClassName = "",
  duration = 2,
  repeat = true,
  accentColor = "#00ff00",
}: TextMatrixRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const matrixChars =
        "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const intervals: ReturnType<typeof setInterval>[] = [];
      const charElements = Array.from(
        container.querySelectorAll<HTMLSpanElement>(".m-char")
      );
      const finalTexts = children.split("");

      // Phase 1: Measure and lock widths to prevent horizontal layout shifting
      // We explicitly avoid locking height to maintain the native text baseline and line-height.
      charElements.forEach((span) => {
        const rect = span.getBoundingClientRect();
        span.style.width = `${rect.width}px`;
        span.style.display = "inline-block";
        span.style.textAlign = "center";
      });

      const runAnimation = () => {
        const charStates = new Array(finalTexts.length).fill(false);

        charElements.forEach((span, i) => {
          if (finalTexts[i] === " ") {
            span.textContent = " ";
            return;
          }

          // Initial state: random character, accent color
          span.textContent =
            matrixChars[Math.floor(Math.random() * matrixChars.length)];
          span.style.color = accentColor;
          span.style.textShadow = `0 0 15px ${accentColor}`;
          span.className = "m-char whitespace-pre";

          gsap.fromTo(
            span,
            { opacity: 0, scale: 1.5 },
            { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
          );

          const lockDelay = i * 0.08 + Math.random() * 0.4;

          const scrambleInterval = setInterval(() => {
            if (!charStates[i]) {
              span.textContent =
                matrixChars[Math.floor(Math.random() * matrixChars.length)];
            }
          }, 50);
          intervals.push(scrambleInterval);

          gsap.delayedCall(lockDelay, () => {
            clearInterval(scrambleInterval);
            charStates[i] = true;

            span.textContent = finalTexts[i];
            
            // Apply the gradient class (if any) directly to the character.
            // This is required because WebKit bg-clip-text fails on inline-block children.
            if (charClassName) {
              span.className = `m-char whitespace-pre ${charClassName}`;
            }
            
            // Flash and fade to original color/gradient
            gsap.fromTo(
              span,
              {
                color: accentColor,
                textShadow: `0 0 30px ${accentColor}, 0 0 60px ${accentColor}`,
                scale: 1.1,
              },
              {
                duration: 0.6,
                color: "transparent", // Fades out the solid color to reveal the CSS bg-clip-text underneath
                textShadow: "0 0 0px transparent",
                scale: 1,
                ease: "power3.out",
                clearProps: "color,textShadow" // Cleans up inline styles so CSS takes full control
              }
            );
          });
        });
      };

      // Slight delay to allow fonts to render before measuring/scrambling
      gsap.delayedCall(0.1, runAnimation);

      let repeatInterval: ReturnType<typeof setInterval> | undefined;
      if (repeat) {
        repeatInterval = setInterval(() => {
          intervals.forEach(clearInterval);
          intervals.length = 0;
          runAnimation();
        }, (duration + 1) * 1000);
      }

      return () => {
        if (repeatInterval) clearInterval(repeatInterval);
        intervals.forEach(clearInterval);
      };
    },
    { scope: containerRef, dependencies: [children, duration, repeat, charClassName, accentColor] }
  );

  return (
    <div ref={containerRef} className={`${className} whitespace-nowrap`}>
      {children.split("").map((char, index) => (
        <span key={index} className="m-char whitespace-pre">
          {char}
        </span>
      ))}
    </div>
  );
}
