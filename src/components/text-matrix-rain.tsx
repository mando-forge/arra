"use client";

import { useEffect, useRef } from "react";

interface TextMatrixRainProps {
  children: string;
  className?: string;
  duration?: number;
  repeat?: boolean;
  accentColor?: string;
}

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function TextMatrixRain({
  children,
  className = "",
  duration = 2,
  repeat = true,
  accentColor = "var(--color-primary)",
}: TextMatrixRainProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = children.split("");
    const charEls = Array.from(container.querySelectorAll<HTMLSpanElement>(".m-char"));

    let raf: number;
    let lastTick = 0;
    const lockTimers: ReturnType<typeof setTimeout>[] = [];
    let repeatTimer: ReturnType<typeof setInterval>;

    const runAnimation = () => {
      const locked = new Array(chars.length).fill(false);

      // Reset all chars to scrambling state via data-attr only — no inline styles
      charEls.forEach((el, i) => {
        if (chars[i] === " ") return;
        el.setAttribute("data-state", "scrambling");
        el.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      });

      // Single rAF loop — one DOM pass per frame, no parallel intervals
      const tick = (time: number) => {
        if (time - lastTick > 50) {
          charEls.forEach((el, i) => {
            if (!locked[i] && chars[i] !== " ") {
              el.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            }
          });
          lastTick = time;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Stagger-lock each character
      charEls.forEach((el, i) => {
        if (chars[i] === " ") return;
        const delay = i * 90 + Math.random() * 350;

        const t = setTimeout(() => {
          locked[i] = true;
          el.textContent = chars[i];
          el.setAttribute("data-state", "locked");

          // Remove data-state after glow transition completes → CSS handles fade-out
          setTimeout(() => el.removeAttribute("data-state"), 600);
        }, delay);
        lockTimers.push(t);
      });
    };

    runAnimation();

    if (repeat) {
      repeatTimer = setInterval(() => {
        cancelAnimationFrame(raf);
        lockTimers.forEach(clearTimeout);
        lockTimers.length = 0;
        runAnimation();
      }, (duration + 1) * 1000);
    }

    return () => {
      cancelAnimationFrame(raf);
      lockTimers.forEach(clearTimeout);
      clearInterval(repeatTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, duration, repeat, accentColor]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ["--accent" as string]: accentColor }}
    >
      {children.split("").map((char, i) => (
        // No inline styles on spans — CSS data-state rules are the only source of truth
        <span key={i} className="m-char">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
