"use client";

import { useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import type { Platform } from "@/config/profile.config";
import { BRAND_EFFECTS } from "@/components/icons/brand-effects";
import { InteractiveBrandIcon } from "@/components/icons/InteractiveBrandIcon";

interface Burst {
  id: number;
  x: number;
  y: number;
}

/** Evenly spaced directions for the click particles. */
const ANGLES = [0, 60, 120, 180, 240, 300] as const;

/** How long a touch press keeps the icon fully filled after release. */
const PRESS_HOLD_MS = 700;

interface PlatformTileProps {
  platform: Platform;
  /** Position in the grid; staggers the start of the idle fill loop. */
  index?: number;
}

export function PlatformTile({ platform, index = 0 }: PlatformTileProps) {
  const reduce = useReducedMotion() ?? false;
  const effect = BRAND_EFFECTS[platform.id];
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const engaged = hovered || focused || pressed;

  const releasePress = () => {
    window.setTimeout(() => setPressed(false), PRESS_HOLD_MS);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Keyboard activation reports 0,0: fall back to the icon position.
    const x = e.clientX ? e.clientX - rect.left : 28;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
    const id = performance.now();
    setBursts((prev) => [...prev, { id, x, y }]);
    window.setTimeout(
      () => setBursts((prev) => prev.filter((b) => b.id !== id)),
      700,
    );
  };

  const tile: Variants = {
    rest: {
      borderColor: "rgb(21 25 30 / 0.15)",
      backgroundColor: "#ffffff",
    },
    hover: { borderColor: effect.color, backgroundColor: "#ffffff" },
    tap: { borderColor: effect.color, backgroundColor: "#ffffff" },
  };

  return (
    <motion.a
      href={platform.href}
      {...(platform.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      initial="rest"
      animate={engaged ? "hover" : "rest"}
      whileTap="tap"
      variants={tile}
      transition={{ duration: 0.25 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      // Only keyboard focus engages the tile; a mouse click would leave it stuck.
      onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      onTapStart={() => setPressed(true)}
      onTap={releasePress}
      onTapCancel={releasePress}
      onClick={handleClick}
      className="relative flex items-center gap-2 overflow-hidden rounded-lg border p-2 shadow-card"
    >
      <InteractiveBrandIcon
        platform={platform.id}
        reduceMotion={reduce}
        engaged={engaged}
        loopDelay={index * 1.2}
        className="size-6 shrink-0"
      />
      <span className="truncate text-xs">{platform.label}</span>

      <AnimatePresence>
        {bursts.map((b) => (
          <span
            key={b.id}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{ left: b.x, top: b.y }}
          >
            <motion.span
              className="absolute -left-4 -top-4 block size-8 rounded-full"
              style={{ backgroundColor: effect.color }}
              initial={{ scale: 0, opacity: 0.35 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {ANGLES.map((deg, i) => (
              <motion.span
                key={deg}
                className="absolute -left-1 -top-1 block size-2 rounded-full"
                style={{ backgroundColor: effect.particles[i] }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos((deg * Math.PI) / 180) * 26,
                  y: Math.sin((deg * Math.PI) / 180) * 26,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}
          </span>
        ))}
      </AnimatePresence>
    </motion.a>
  );
}
