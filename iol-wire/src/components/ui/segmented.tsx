"use client";

import { motion } from "framer-motion";
import { cn, vibrate } from "@/lib/utils";

/**
 * iOS segmented control.
 *
 * Three details separate this from a row of pills, and all three are the
 * reason the real one feels physical:
 *
 *   1. The thumb is a *raised* neutral surface that slides between slots —
 *      it is not the selected button changing colour. A shared layoutId
 *      gives it one continuous motion instead of two cross-fades.
 *   2. Hairline dividers sit between adjacent unselected segments and
 *      disappear beside the thumb, so the track reads as grooves rather
 *      than as a bar with gaps.
 *   3. The track is a neutral fill, never the brand colour. Accent on a
 *      segmented control makes every option look like a primary action.
 */

export interface Segment<T extends string> {
  id: T;
  label: React.ReactNode;
  /** Announced instead of `label` when the label is a glyph or a letter. */
  srLabel?: string;
}

export function Segmented<T extends string>({
  segments,
  value,
  onChange,
  size = "md",
  className,
  layoutGroupId,
}: {
  segments: readonly Segment<T>[];
  value: T;
  onChange: (id: T) => void;
  size?: "sm" | "md";
  className?: string;
  /** Unique per control, so two on one screen don't share a thumb. */
  layoutGroupId: string;
}) {
  const selected = segments.findIndex((s) => s.id === value);

  return (
    <div
      role="tablist"
      className={cn(
        "relative isolate flex rounded-[10px] bg-[var(--seg-track)] p-[2px]",
        className
      )}
    >
      {segments.map((seg, i) => {
        const active = seg.id === value;
        // A divider belongs between two segments only when neither of them
        // is wearing the thumb.
        const divider = i > 0 && i !== selected && i - 1 !== selected;

        return (
          <button
            key={seg.id}
            role="tab"
            aria-selected={active}
            aria-label={seg.srLabel}
            onClick={() => {
              if (active) return;
              vibrate(5);
              onChange(seg.id);
            }}
            className={cn(
              "relative isolate flex flex-1 items-center justify-center rounded-[8px] font-semibold transition-colors duration-200",
              size === "sm" ? "py-[5px] text-[12px]" : "py-[7px] text-[13px]",
              active ? "text-ink" : "text-ink-dim"
            )}
          >
            {divider && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-[55%] w-px -translate-y-1/2 scale-x-50 bg-[var(--seg-divider)]"
              />
            )}
            {active && (
              <motion.span
                layoutId={`seg-${layoutGroupId}`}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-[8px] bg-[var(--seg-thumb)] shadow-[0_3px_8px_rgba(0,0,0,.12),0_1px_1px_rgba(0,0,0,.16)]"
                transition={{ type: "spring", stiffness: 520, damping: 42, mass: 0.7 }}
              />
            )}
            <span className="relative">{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}
