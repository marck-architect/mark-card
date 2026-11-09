"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface AnimatedIconProps {
  /** Raw SVG markup from our own icon files (see lib/icons.ts). */
  svg: string;
  className?: string;
}

/**
 * Delay before the loops start, so the animations don't compete with the
 * page's first render and hydration (matters most on slow phones).
 */
const START_DELAY_MS = 1500;

/**
 * One shared clock for every icon on the page. Each SVG has its own animation
 * timeline, so whenever one resumes we jump it to the shared time. That keeps
 * all icons filling and draining in lockstep, even if one was scrolled off
 * screen (paused) and comes back later. The clock starts when the first icon
 * starts, so the loop begins from an empty badge.
 */
let clockStart: number | null = null;
function sharedTimeSeconds(): number {
  const now = performance.now();
  if (clockStart === null) clockStart = now;
  return (now - clockStart) / 1000;
}

/**
 * Renders one of the animated badge icons inline. Each SVG carries its own
 * looping wave-fill animation (SMIL). We control it from outside:
 * - reduced motion: frozen on the first, unfilled frame;
 * - otherwise: starts shortly after load and only runs while on screen,
 *   saving CPU and battery.
 */
export function AnimatedIcon({ svg, className = "" }: AnimatedIconProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const host = ref.current;
    const root = host?.querySelector("svg");
    if (!host || !root) return;

    root.pauseAnimations();
    if (reduce) {
      root.setCurrentTime(0);
      return;
    }

    let visible = false;
    let ready = false;
    const sync = () => {
      if (visible && ready) {
        root.setCurrentTime(sharedTimeSeconds());
        root.unpauseAnimations();
      } else {
        root.pauseAnimations();
      }
    };

    const timer = window.setTimeout(() => {
      ready = true;
      sync();
    }, START_DELAY_MS);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(host);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [reduce, svg]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`block shrink-0 [&>svg]:block [&>svg]:size-full ${className}`}
      // Trusted, static markup from files in this repo; never user input.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
