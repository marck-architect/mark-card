import { readFileSync } from "node:fs";
import path from "node:path";
import type { IconName } from "@/config/profile.config";

const ICON_DIR = path.join(process.cwd(), "src", "assets", "icons");

const cache = new Map<IconName, string>();

/**
 * Read an animated badge icon as raw SVG markup. Server-side only: the files
 * are our own trusted assets and are inlined so their built-in SMIL animation
 * can be paused for visitors who prefer reduced motion.
 */
export function readIcon(name: IconName): string {
  const cached = cache.get(name);
  if (cached) return cached;
  const raw = readFileSync(path.join(ICON_DIR, `${name}.svg`), "utf8").trim();
  // The source files stagger each icon's loop with its own begin offset
  // (0 to 1.5s). The card wants every icon to fill and drain together, so all
  // offsets are zeroed here; the files themselves are left untouched.
  const svg = raw.replace(/begin="[^"]*"/g, 'begin="0s"');
  cache.set(name, svg);
  return svg;
}
