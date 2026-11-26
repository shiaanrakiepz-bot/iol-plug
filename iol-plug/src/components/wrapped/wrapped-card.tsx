"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { useContent, useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { buildWrapped, weekRange } from "@/lib/wrapped";
import { vibrate } from "@/lib/utils";

/**
 * The teaser that opens the recap.
 *
 * Only shown once the week has enough in it to be worth watching — an empty
 * Wrapped is worse than no Wrapped, and offering one you cannot fill trains
 * people to ignore the prompt.
 */
export function WrappedCard() {
  const setWrapped = useUI((s) => s.setWrapped);
  const dailyReads = useContent((s) => s.dailyReads);
  const daysCompleted = useContent((s) => s.daysCompleted);
  const quizPassed = useContent((s) => s.quizPassed);
  const quizAttempted = useContent((s) => s.quizAttempted);
  const xpLog = useContent((s) => s.xpLog);
  const streak = useContent((s) => s.stats.streak);
  const interests = useSettings((s) => s.interests);

  const week = useMemo(
    () =>
      buildWrapped({
        dailyReads,
        daysCompleted,
        quizPassed,
        quizAttempted,
        xpLog,
        streak,
        interests,
      }),
    [dailyReads, daysCompleted, quizPassed, quizAttempted, xpLog, streak, interests]
  );

  if (!week.ready) return null;

  const tint = week.topTopic?.color ?? "var(--accent)";

  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => {
        vibrate(6);
        setWrapped(true);
      }}
      className="relative mt-4 flex w-full items-center gap-4 overflow-hidden rounded-[22px] border border-[var(--glass-border)] p-4 text-left shadow-card"
      style={{
        background: `linear-gradient(135deg, ${tint}2e, var(--surface-raised) 62%)`,
      }}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
        style={{ background: tint }}
      >
        <Sparkles size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-extrabold tracking-[-0.01em] text-ink">
          Your week on the Plug
        </span>
        <span className="mt-0.5 block text-[11.5px] leading-[1.45] text-ink-dim">
          {weekRange(week)} · {week.storiesRead}{" "}
          {week.storiesRead === 1 ? "story" : "stories"}
          {week.topTopic ? ` · mostly ${week.topTopic.label}` : ""}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-ink-faint" />
    </motion.button>
  );
}
