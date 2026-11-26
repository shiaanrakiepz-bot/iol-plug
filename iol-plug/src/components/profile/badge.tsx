"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";

/**
 * An achievement badge.
 *
 * Renders the 3D medallion from /public/badges when it exists and silently
 * falls back to the emoji when it doesn't. Keeping the fallback means the
 * achievements screen is never broken by a missing render, and the app stays
 * runnable for anyone who clones it without the art.
 *
 * Locked badges are desaturated and dimmed rather than hidden — seeing the
 * thing you haven't earned yet is most of why collections work.
 */
export function Badge({
  id,
  glyph,
  earned,
  size = 56,
}: {
  id: string;
  glyph: GlyphName;
  earned: boolean;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // No render on disk: fall back to the line glyph, never to an emoji.
    return (
      <span
        className={cn("flex items-center justify-center", !earned && "opacity-[0.55]")}
        style={{ width: size, height: size }}
      >
        <Glyph name={glyph} size={Math.round(size * 0.68)} strokeWidth={1.6} />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/badges/${id}.png`}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={cn(
        "block select-none transition-all duration-300",
        earned
          ? "drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
          : "opacity-[0.55] grayscale brightness-[1.35]"
      )}
      style={{ width: size, height: size }}
    />
  );
}
