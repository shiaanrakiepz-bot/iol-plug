"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, Globe, Share2, Sparkles, X } from "lucide-react";
import { useContent, useSettings, ACCENTS } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { buildWrapped, weekLabel, weekRange, type WrappedWeek } from "@/lib/wrapped";
import { renderWrappedCard, shareWrappedCard } from "@/lib/share-card";
import { celebrate } from "@/lib/celebrate";
import { cn, vibrate } from "@/lib/utils";
import { Glyph } from "@/components/icons/glyphs";

const HOLD = 4200;

/* A slide is a function of the week, so adding one is adding to this list. */
type Slide = (w: WrappedWeek, accent: string) => React.ReactNode;

const Big = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    initial={{ opacity: 0, y: 24, scale: 0.94 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className="text-[88px] font-black leading-[0.9] tracking-[-0.045em] text-white tabular-nums"
  >
    {children}
  </motion.p>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/55"
  >
    {children}
  </motion.p>
);

const Line = ({ children, delay = 0.22 }: { children: React.ReactNode; delay?: number }) => (
  <motion.p
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="mt-4 max-w-[300px] text-[17px] font-medium leading-[1.45] text-white/80 [text-wrap:pretty]"
  >
    {children}
  </motion.p>
);

const SLIDES: Slide[] = [
  // 1 — the opener
  (w) => (
    <>
      <Kicker>{weekRange(w)}</Kicker>
      <motion.p
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.08 }}
        className="mt-5 text-[46px] font-black leading-[0.98] tracking-[-0.035em] text-white"
      >
        Your week
        <br />
        on the Plug
        <span className="text-[var(--accent)]">.</span>
      </motion.p>
      <Line delay={0.4}>Seven days, counted honestly. Here&apos;s how it went.</Line>
    </>
  ),

  // 2 — volume, with the week-on-week move
  (w) => (
    <>
      <Kicker>You read</Kicker>
      <div className="mt-4">
        <Big>{w.storiesRead}</Big>
      </div>
      <Line>
        {w.storiesRead === 1 ? "story" : "stories"} across {w.daysCompleted}{" "}
        {w.daysCompleted === 1 ? "finished day" : "finished days"}.
        {w.deltaStories !== null && w.deltaStories !== 0 && (
          <>
            {" "}
            That&apos;s{" "}
            <span className={w.deltaStories > 0 ? "text-[#6EE087]" : "text-white/60"}>
              {Math.abs(w.deltaStories)} {w.deltaStories > 0 ? "more" : "fewer"}
            </span>{" "}
            than last week.
          </>
        )}
      </Line>
    </>
  ),

  // 3 — identity: the topic that owned the week
  (w) =>
    w.topTopic ? (
      <>
        <Kicker>Your topic</Kicker>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="mt-4 text-[56px] font-black leading-[1] tracking-[-0.04em]"
          style={{ color: w.topTopic.color }}
        >
          <Glyph name={w.topTopic.glyph} size={46} strokeWidth={2.1} className="mr-2 inline align-[-7px]" />
          {w.topTopic.label}
        </motion.p>
        <Line>
          {w.topTopic.count} {w.topTopic.count === 1 ? "story" : "stories"}. More than
          anything else you opened.
        </Line>
        {w.runnersUp.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {w.runnersUp.map((r) => (
              <span
                key={r.label}
                className="rounded-pill border px-3 py-1.5 text-[12px] font-semibold"
                style={{ color: r.color, borderColor: `${r.color}55` }}
              >
                {r.label} · {r.count}
              </span>
            ))}
          </motion.div>
        )}
      </>
    ) : null,

  // 4 — breadth, the number this product actually wants to move
  (w) => (
    <>
      <Kicker>Outside your bubble</Kicker>
      <div className="mt-4">
        <Big>{w.outsidePct}%</Big>
      </div>
      <Line>
        {w.outsideCount} of your {w.storiesRead} stories came from desks you never
        picked.
        {w.worldCount > 0 && (
          <>
            {" "}
            <span className="inline-flex items-center gap-1 text-[#6FBFFF]">
              <Globe size={14} /> {w.worldCount}
            </span>{" "}
            off the world wire.
          </>
        )}
      </Line>
      <Line delay={0.42}>
        {w.outsidePct >= 40
          ? "That is a properly wide week."
          : "Worth stretching a little further next week."}
      </Line>
    </>
  ),

  // 5 — understanding, not scrolling
  (w) => (
    <>
      <Kicker>Did you get it</Kicker>
      <div className="mt-4">
        <Big>{w.accuracyPct === null ? "—" : `${w.accuracyPct}%`}</Big>
      </div>
      <Line>
        {w.checksTaken === 0
          ? "You didn't take a comprehension check this week. They're the fastest XP in the app."
          : `${w.checksPassed} of ${w.checksTaken} checks right, and ${w.xpEarned} XP banked.`}
      </Line>
    </>
  ),
];

function Progress({ count, index }: { count: number; index: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-pill bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: i < index ? "100%" : 0 }}
            animate={{ width: i < index ? "100%" : i === index ? "100%" : 0 }}
            transition={{ duration: i === index ? HOLD / 1000 : 0, ease: "linear" }}
          />
        </div>
      ))}
    </div>
  );
}

export function Wrapped() {
  const close = useUI((s) => s.setWrapped);
  const showToast = useUI((s) => s.showToast);
  const dailyReads = useContent((s) => s.dailyReads);
  const daysCompleted = useContent((s) => s.daysCompleted);
  const quizPassed = useContent((s) => s.quizPassed);
  const quizAttempted = useContent((s) => s.quizAttempted);
  const xpLog = useContent((s) => s.xpLog);
  const streak = useContent((s) => s.stats.streak);
  const interests = useSettings((s) => s.interests);
  const accentId = useSettings((s) => s.accent);
  const accent = (ACCENTS.find((a) => a.id === accentId) ?? ACCENTS[0]).hex;

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

  // Slides that return null for this reader are dropped, so nobody taps
  // through an empty screen.
  const slides = useMemo(
    () => SLIDES.map((s) => s(week, accent)).filter(Boolean),
    [week, accent]
  );

  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const last = i >= slides.length;

  /* auto-advance, pausing once the share card is on screen */
  useEffect(() => {
    if (last) return;
    const t = setTimeout(() => setI((n) => n + 1), HOLD);
    return () => clearTimeout(t);
  }, [i, last]);

  useEffect(() => {
    if (last) celebrate({ count: 70 });
  }, [last]);

  const share = async () => {
    setBusy(true);
    try {
      const blob = await renderWrappedCard(week, accent);
      if (!blob) {
        showToast("Couldn't build the card", "alert");
        return;
      }
      const how = await shareWrappedCard(blob, week);
      vibrate([8, 20, 8]);
      showToast(
        how === "shared" ? "Sent" : how === "downloaded" ? "Saved to your downloads" : "Couldn't share that",
        how === "failed" ? "alert" : "megaphone"
      );
    } finally {
      setBusy(false);
    }
  };

  if (!week.ready) {
    return (
      <motion.div
        className="fixed inset-0 z-[90] mx-auto flex max-w-md flex-col items-center justify-center bg-[#0d0b10] px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <span className="text-[44px]">clock</span>
        <h2 className="mt-4 text-[22px] font-extrabold text-white">Not enough week yet</h2>
        <p className="mt-2 max-w-[260px] text-[13.5px] leading-[1.6] text-white/60">
          Read a few more stories and your recap will have something to say. Three is
          the minimum for it to be worth your time.
        </p>
        <button
          onClick={() => close(false)}
          className="mt-6 rounded-pill bg-white px-6 py-3 text-[13.5px] font-bold text-[#0d0b10]"
        >
          Back
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[90] mx-auto max-w-md overflow-hidden bg-[#0d0b10]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* the week's colour, bleeding behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 70% at 50% 18%, ${
            week.topTopic?.color ?? accent
          }38, transparent 62%)`,
        }}
      />

      <div className="relative flex h-full flex-col px-6 pb-8 pt-safe">
        <div className="flex items-center gap-3 pt-3">
          <div className="flex-1">
            <Progress count={slides.length + 1} index={Math.min(i, slides.length)} />
          </div>
          <button
            onClick={() => close(false)}
            aria-label="Close your week"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <X size={17} />
          </button>
        </div>

        {/* tap zones: back on the left third, forward on the rest */}
        {!last && (
          <>
            <button
              aria-label="Previous"
              onClick={() => setI((n) => Math.max(0, n - 1))}
              className="absolute inset-y-0 left-0 z-10 w-1/3"
            />
            <button
              aria-label="Next"
              onClick={() => setI((n) => n + 1)}
              className="absolute inset-y-0 right-0 z-10 w-2/3"
            />
          </>
        )}

        <div className="relative flex flex-1 flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={last ? "final" : i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {last ? (
                <div>
                  <Kicker>That was your week</Kicker>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 190, damping: 18 }}
                    className="mt-4 text-[52px] font-black leading-[0.98] tracking-[-0.04em] text-white"
                  >
                    {weekLabel(week)}
                    <span style={{ color: week.topTopic?.color ?? accent }}>.</span>
                  </motion.p>
                  <Line>
                    {week.storiesRead} stories · {week.daysCompleted}/7 days ·{" "}
                    {week.bestStreak}-day streak
                  </Line>
                </div>
              ) : (
                slides[i]
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {last && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative z-20 flex flex-col gap-2.5"
          >
            <button
              onClick={share}
              disabled={busy}
              className={cn(
                "flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-[15px] font-bold transition-colors",
                busy ? "bg-white/20 text-white/60" : "bg-white text-[#0d0b10]"
              )}
            >
              {busy ? (
                <>
                  <Sparkles size={17} className="animate-pulse" /> Building your card…
                </>
              ) : (
                <>
                  <Share2 size={17} /> Share my week
                </>
              )}
            </button>
            <button
              onClick={() => setI(0)}
              className="w-full py-2 text-center text-[13px] font-semibold text-white/55"
            >
              Watch again
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
