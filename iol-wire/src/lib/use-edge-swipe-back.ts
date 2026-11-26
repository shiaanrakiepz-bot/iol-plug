"use client";

import { useEffect, useRef, useState } from "react";

/**
 * iOS interactive pop — drag from the left edge to go back.
 *
 * The thing that makes the real gesture feel native is that it is
 * *interactive*: the page tracks your finger the whole way and you can
 * change your mind halfway. A swipe that only fires an action on release is
 * a shortcut, not a gesture, so this reports a live `x` the caller renders
 * with.
 *
 * Two guards matter on a phone:
 *   - the gesture only arms within `edge` px of the screen's left edge, so it
 *     never steals a horizontal swipe inside a carousel further in;
 *   - it disarms if the first movement is mostly vertical, so it never
 *     fights the scroll it is sitting on top of.
 */
export function useEdgeSwipeBack(
  onBack: (() => void) | null,
  { edge = 28, threshold = 0.32, velocity = 420 } = {}
) {
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const armed = useRef(false);
  const decided = useRef(false);
  const last = useRef({ x: 0, t: 0 });

  // A ref, so the listeners below never need re-binding when the handler
  // identity changes between renders.
  const back = useRef(onBack);
  back.current = onBack;

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (!back.current || e.touches.length !== 1) return;
      const t = e.touches[0];
      if (t.clientX > edge) return;
      start.current = { x: t.clientX, y: t.clientY, t: performance.now() };
      armed.current = true;
      decided.current = false;
    };

    const onMove = (e: TouchEvent) => {
      if (!armed.current || !start.current) return;
      const t = e.touches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;

      if (!decided.current) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        // Mostly vertical: this belongs to the scroller, not to us.
        if (Math.abs(dy) > Math.abs(dx)) {
          armed.current = false;
          return;
        }
        decided.current = true;
        setDragging(true);
      }

      // Pulling back past the start rubber-bands rather than inverting.
      const next = dx < 0 ? dx * 0.2 : dx;
      last.current = { x: next, t: performance.now() };
      setX(next);
      if (e.cancelable) e.preventDefault();
    };

    const onEnd = () => {
      if (!armed.current || !decided.current) {
        armed.current = false;
        return;
      }
      armed.current = false;
      decided.current = false;
      setDragging(false);

      const width = window.innerWidth || 1;
      const dt = Math.max(1, performance.now() - (start.current?.t ?? 0));
      const v = (last.current.x / dt) * 1000;

      if (last.current.x > width * threshold || v > velocity) {
        // Let the page finish leaving before the route changes, so the pop
        // reads as one movement instead of a jump.
        setX(width);
        window.setTimeout(() => {
          back.current?.();
          setX(0);
        }, 180);
      } else {
        setX(0);
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [edge, threshold, velocity]);

  return {
    x,
    dragging,
    /** Spread onto the page being popped. */
    style: {
      transform: x ? `translate3d(${x}px,0,0)` : undefined,
      transition: dragging ? "none" : "transform 180ms cubic-bezier(.22,1,.36,1)",
      // The page lifts off the one behind it, the way a pushed view does.
      boxShadow: x > 0 ? "-12px 0 34px rgba(0,0,0,.34)" : undefined,
    } as React.CSSProperties,
  };
}
