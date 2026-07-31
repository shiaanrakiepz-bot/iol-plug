"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { vibrate } from "@/lib/utils";

/** Drag distance, in px, that counts as a full swipe. */
const THROW = 300;
/** Fraction of that throw you have to pass for the swipe to commit. */
const COMMIT = 0.3;

/**
 * Launch screen. Black, logo fades in, and the swipe is tracked live — the
 * logo rises and shrinks under your thumb rather than waiting for release,
 * so the gesture feels connected before it commits.
 */
export function Splash() {
  const [progress, setProgress] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  // Ref-based guards keep the interaction immune to render timing and
  // background-tab timer throttling.
  const leavingRef = useRef(false);
  const mountedAt = useRef(Date.now());
  const leaveRef = useRef<() => void>(() => undefined);

  leaveRef.current = () => {
    if (leavingRef.current || Date.now() - mountedAt.current < 700) return;
    leavingRef.current = true;
    vibrate(8);
    setSnapping(true);
    setProgress(1);
    const { hasOnboarded } = useSettings.getState();
    setTimeout(
      () => useUI.getState().setPhase(hasOnboarded ? "app" : "onboarding"),
      420
    );
  };

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(true), 1300);
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 30) leaveRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
        leaveRef.current();
    };
    window.addEventListener("wheel", onWheel);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] cursor-grab touch-none select-none bg-black active:cursor-grabbing"
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
      role="button"
      aria-label="Swipe up to enter IOL Wire"
      onPan={(_, info) => {
        if (leavingRef.current) return;
        setSnapping(false);
        setProgress(Math.max(0, Math.min(1, -info.offset.y / THROW)));
      }}
      onPanEnd={(_, info) => {
        if (leavingRef.current) return;
        if (-info.offset.y / THROW > COMMIT || info.velocity.y < -400) {
          leaveRef.current();
        } else {
          setSnapping(true);
          setProgress(0);
        }
      }}
      onClick={() => leaveRef.current()}
    >
      <div className="relative flex h-full flex-col items-center justify-center">
        <div
          style={{
            transform: `translateY(${-progress * 280}px) scale(${1 - progress * 0.64})`,
            transition: snapping
              ? "transform .5s cubic-bezier(.32,.72,.25,1)"
              : "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/logo.jpeg"
            alt="IOL Wire"
            draggable={false}
            width={200}
            height={200}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="pointer-events-none block h-[200px] w-[200px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hintVisible && progress < 0.05 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute bottom-[54px] flex flex-col items-center gap-2 text-white/50"
        >
          <ChevronUp size={22} strokeWidth={2} className="animate-float-up" />
          <span className="text-[10.5px] font-medium uppercase tracking-[4px]">
            Swipe up
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
