"use client";

import { useEffect, useRef } from "react";

function findScroller(el: HTMLElement): HTMLElement | undefined {
  let node = el.parentElement;
  while (node) {
    if (node.hasAttribute("data-lenis-prevent")) return node;
    const oy = getComputedStyle(node).overflowY;
    if (
      (oy === "auto" || oy === "scroll") &&
      node.scrollHeight > node.clientHeight
    )
      return node;
    node = node.parentElement;
  }
  return undefined;
}

const xmlEscape = (str: string) => {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
};

const maskUrl = (text: string) => {
  // Dynamically calculate width based on text length to prevent clipping of long text
  const width = text.length * 125 + 120;
  const escapedText = xmlEscape(text);
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="220" viewBox="0 0 ${width} 220">` +
        `<text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" ` +
        `font-family="Arial Black, Arial Narrow, sans-serif" font-weight="900" ` +
        `font-size="180" letter-spacing="-8">${escapedText}</text></svg>`,
    )
  );
};

type TextClipMaskRevealProps = {
  text?: string;
  src?: string;
  children?: React.ReactNode;
};

export const TextClipMaskReveal = ({
  text = "ARRA-CORE",
  src = "/video/hero-video-bg.mp4",
  children,
}: TextClipMaskRevealProps) => {
  const container = useRef<HTMLDivElement>(null);
  const stickyMask = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = container.current;
    const mask = stickyMask.current;
    if (!root || !mask) return;

    const scroller = findScroller(root);

    const initialMaskSize = 0.8; // 80% of the frame at rest
    const targetMaskSize = 50; // Increased scaling factor to fully push text borders off-screen
    const easing = 0.15; // smooth lerping
    let eased = 0;
    let raf = 0;

    const rawProgress = () => {
      const rect = root.getBoundingClientRect();
      const viewport = scroller?.clientHeight ?? window.innerHeight;
      const top = scroller ? rect.top - scroller.getBoundingClientRect().top : rect.top;
      const distance = rect.height - viewport;
      if (distance <= 0) return 0;
      return Math.min(1, Math.max(0, -top / distance));
    };

    const animate = () => {
      if (!isVisible) {
        raf = 0;
        return;
      }
      eased += (rawProgress() - eased) * easing;
      const size = (initialMaskSize + targetMaskSize * eased) * 100;
      mask.style.webkitMaskSize = `${size}%`;
      mask.style.maskSize = `${size}%`;
      raf = requestAnimationFrame(animate);
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !raf) {
          raf = requestAnimationFrame(animate);
        } else if (!isVisible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={container} className="relative h-[200vh] w-full bg-background">
      {/* Sticky Mask Layer containing the video clip */}
      <div
        ref={stickyMask}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background z-0"
        style={{
          maskImage: `url("${maskUrl(text)}")`,
          WebkitMaskImage: `url("${maskUrl(text)}")`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "80%",
          WebkitMaskSize: "80%",
        }}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>

      {/* Children Section: Scrolls up on top of the video container AFTER the mask scales */}
      {children && (
        <div className="relative z-20 h-screen flex items-center justify-center bg-transparent">
          {children}
        </div>
      )}
    </div>
  );
};
