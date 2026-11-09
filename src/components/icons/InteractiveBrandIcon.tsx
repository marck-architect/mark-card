"use client";

import { useId } from "react";
import { motion, type Variants } from "motion/react";
import { Phone } from "lucide-react";
import type { PlatformId } from "@/config/profile.config";
import { BRAND_EFFECTS } from "./brand-effects";
import { FACEBOOK_PATH, INSTAGRAM_PATH, WHATSAPP_PATH } from "./brand-paths";

const PATHS: Record<Exclude<PlatformId, "call">, string> = {
  instagram: INSTAGRAM_PATH,
  facebook: FACEBOOK_PATH,
  whatsapp: WHATSAPP_PATH,
};

interface GlyphProps {
  platform: PlatformId;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

/** The glyph itself: official brand path, or the lucide phone for "Call". */
function Glyph({ platform, fill, stroke, strokeWidth }: GlyphProps) {
  if (platform === "call") {
    return (
      <Phone
        width={24}
        height={24}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.6}
      />
    );
  }
  return (
    <path
      d={PATHS[platform]}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  );
}

interface InteractiveBrandIconProps {
  platform: PlatformId;
  /** When true the jump is replaced by a plain colour fill. */
  reduceMotion: boolean;
  /** True while the tile is hovered, focused or pressed: the fill snaps full. */
  engaged: boolean;
  /** Seconds to wait before the idle loop starts, so tiles don't fill in sync. */
  loopDelay?: number;
  className?: string;
}

/** Idle loop: fill slowly, hold, drain slowly, repeat. */
const LOOP_SECONDS = 6;

/**
 * Outline glyph that fills bottom-to-top with the brand colour and jumps.
 * - Idle (no hover, e.g. on phones): the fill slowly rises and drains in a loop.
 * - Engaged (hover / focus / press): the fill snaps full and the glyph jumps.
 * The jump reads its state ("rest" | "hover" | "tap") from the parent motion element.
 */
export function InteractiveBrandIcon({
  platform,
  reduceMotion,
  engaged,
  loopDelay = 0,
  className,
}: InteractiveBrandIconProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `clip-${uid}`;
  const gradId = `grad-${uid}`;
  const effect = BRAND_EFFECTS[platform];
  const fill = effect.gradient ? `url(#${gradId})` : effect.color;

  const jump: Variants = reduceMotion
    ? { rest: {}, hover: {}, tap: {} }
    : {
        rest: { y: 0, rotate: 0, scale: 1 },
        hover: {
          y: [0, -7, 0, -2, 0],
          rotate: [...effect.tilt],
          scale: [...effect.pop],
          transition: { duration: 0.65, ease: "easeOut" },
        },
        tap: {
          scale: [1, 0.86, 1.18, 1],
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  // y = 26 (not 24) is "empty": the glyph stroke overshoots the viewBox by ~0.35 units.
  const EMPTY = 26;
  const fillAnimation = engaged
    ? { y: 0, transition: { duration: 0.45, ease: "easeOut" as const } }
    : reduceMotion
      ? { y: EMPTY, transition: { duration: 0.3 } }
      : {
          y: [EMPTY, 0, 0, EMPTY],
          transition: {
            duration: LOOP_SECONDS,
            times: [0, 0.4, 0.65, 1],
            ease: "easeInOut" as const,
            repeat: Infinity,
            delay: loopDelay,
          },
        };

  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      variants={jump}
      className={className}
      style={{ overflow: "visible", transformOrigin: "50% 100%" }}
    >
      <defs>
        {effect.gradient && (
          <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
            {effect.gradient.map((stop, i, all) => (
              <stop
                key={stop}
                offset={`${(i / (all.length - 1)) * 100}%`}
                stopColor={stop}
              />
            ))}
          </linearGradient>
        )}
        <clipPath id={clipId}>
          <motion.rect
            x={0}
            width={24}
            height={24}
            initial={{ y: EMPTY }}
            animate={fillAnimation}
          />
        </clipPath>
      </defs>

      {/* Outline layer (always visible). */}
      <Glyph
        platform={platform}
        fill="transparent"
        stroke="#15191e"
        strokeWidth={0.7}
      />
      {/* Fill layer, revealed bottom-to-top by the clip rect. */}
      <g clipPath={`url(#${clipId})`}>
        <Glyph platform={platform} fill={fill} stroke={fill} strokeWidth={0.7} />
      </g>
    </motion.svg>
  );
}
