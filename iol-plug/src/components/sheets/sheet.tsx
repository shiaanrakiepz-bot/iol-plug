"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Bottom sheet with iOS detents.
 *
 * By default the sheet is as tall as its content, which is right for a short
 * menu. Pass `detents` and it becomes a resizable sheet instead: it opens at
 * the first detent and the grabber drags it between heights, snapping to
 * whichever it was heading toward rather than whichever is nearest — the
 * latter ignores a flick, which is how most web sheets end up feeling stuck.
 *
 * Detents are fractions of the viewport. [0.55, 0.92] is the iOS
 * medium/large pair.
 */
export function Sheet({
  onClose,
  children,
  title,
  className,
  detents,
  footer,
}: {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  detents?: number[];
  /** Pinned below the scrolling body — a composer, or a primary action. */
  footer?: React.ReactNode;
}) {
  const resizable = !!detents?.length;
  const stops = detents ?? [];
  const [detent, setDetent] = useState(0);
  const y = useMotionValue(0);
  const panel = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Heights in pixels, tallest last, so index 0 is always the smallest.
  const [heights, setHeights] = useState<number[]>([]);
  useEffect(() => {
    if (!resizable) return;
    const measure = () =>
      setHeights(stops.map((f) => Math.round(window.innerHeight * f)));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizable, stops.join(",")]);

  /**
   * Dragging up is negative y. Rather than animate `height` — which relayouts
   * the content on every frame — the panel keeps the *tallest* height and is
   * pushed down to show less of it, so the whole gesture is a transform.
   */
  const tallest = heights.length ? heights[heights.length - 1] : undefined;
  const offsetFor = (i: number) =>
    tallest && heights[i] !== undefined ? tallest - heights[i] : 0;

  const settle = (offset: number, velocity: number) => {
    if (!resizable || !tallest) {
      if (offset > 90 || velocity > 500) onClose();
      return;
    }

    const current = offsetFor(detent) + offset;

    // Pulled well below the smallest detent, or flicked down from it: the
    // gesture was a dismissal, not a resize. Checked before the snap, because
    // "nearest detent" would otherwise drag the sheet back up and no amount
    // of pulling down would ever close it.
    const past = current > offsetFor(0) + 80;
    if (past || (velocity > 520 && detent === 0)) return onClose();

    // A deliberate flick wins over proximity; only a slow release falls back
    // to "whichever detent is nearest".
    let target: number;
    if (velocity > 520) target = detent - 1;
    else if (velocity < -520) target = detent + 1;
    else {
      target = 0;
      let best = Infinity;
      heights.forEach((_, i) => {
        const d = Math.abs(offsetFor(i) - current);
        if (d < best) {
          best = d;
          target = i;
        }
      });
    }

    if (target < 0) target = 0;
    setDetent(Math.min(target, heights.length - 1));
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        aria-label="Close"
        className="absolute inset-0 bg-black/55"
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "glass-strong lg-refract relative flex w-full max-w-md flex-col rounded-t-[2rem] px-5 pb-8 pt-3 text-ink",
          className
        )}
        style={resizable && tallest ? { height: tallest, y } : undefined}
        initial={{ y: "100%" }}
        animate={{ y: resizable && tallest ? offsetFor(detent) : 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        drag="y"
        dragListener={!resizable}
        dragControls={dragControls}
        dragConstraints={
          resizable && tallest ? { top: 0, bottom: tallest } : { top: 0, bottom: 0 }
        }
        dragElastic={{ top: resizable ? 0.04 : 0, bottom: 0.6 }}
        onDragEnd={(_, info) => settle(info.offset.y, info.velocity.y)}
      >
        <div
          onPointerDown={(e) => resizable && dragControls.start(e)}
          className={cn("-mx-5 -mt-3 shrink-0 px-5 pb-1 pt-3", resizable && "cursor-grab touch-none")}
        >
          <div
            // Mid-grey with a light ring and a dark halo, so the one pill reads
            // on a pale surface and on a photograph without knowing which.
            className="mx-auto h-1.5 w-12 rounded-full bg-[rgba(142,142,152,.9)] shadow-[0_0_0_1px_rgba(255,255,255,.26),0_1px_3px_rgba(0,0,0,.5)]"
            aria-hidden
          />
        </div>
        {title && (
          <h3
            onPointerDown={(e) => resizable && dragControls.start(e)}
            className={cn(
              "mb-4 mt-3 shrink-0 text-center text-[15px] font-bold tracking-tight",
              resizable && "touch-none"
            )}
          >
            {title}
          </h3>
        )}
        <div
          className={cn(
            resizable && "-mx-5 min-h-0 flex-1 overflow-y-auto overscroll-contain px-5"
          )}
        >
          {children}
        </div>
        {footer && <div className="shrink-0 pt-3">{footer}</div>}
      </motion.div>
    </motion.div>
  );
}
