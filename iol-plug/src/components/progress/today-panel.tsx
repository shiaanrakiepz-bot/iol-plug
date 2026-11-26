"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Shield, Sparkles } from "lucide-react";
import { useContent, useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import {
  DAILY_GOAL,
  dailyMissions,
  dayKey,
  levelFromXp,
  missionProgress,
} from "@/lib/progress";
import { celebrate } from "@/lib/celebrate";
import { cn, vibrate } from "@/lib/utils";

function Ring({ pct, size = 72 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--glass-border)"
        strokeWidth="6"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - Math.min(1, pct)) }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />
    </svg>
  );
}

/**
 * The day's loop in one card: how far through today's three you are, what the
 * three side-quests are, and where that leaves your level.
 *
 * Everything here is bounded. There is a point at which it is all done and the
 * card says so — which is the part most engagement design quietly removes.
 */
export function TodayPanel() {
  const today = dayKey();
  const dailyReads = useContent((s) => s.dailyReads);
  const daysCompleted = useContent((s) => s.daysCompleted);
  const quizPassed = useContent((s) => s.quizPassed);
  const missionsClaimed = useContent((s) => s.missionsClaimed);
  const claimMission = useContent((s) => s.claimMission);
  const swipes = useContent((s) => s.swipes);
  const xp = useContent((s) => s.xp);
  const streak = useContent((s) => s.stats.streak);
  const freezes = useContent((s) => s.streakFreezes);
  const interests = useSettings((s) => s.interests);
  const showToast = useUI((s) => s.showToast);
  const setTab = useUI((s) => s.setTab);

  const readToday = useMemo(() => dailyReads[today] ?? [], [dailyReads, today]);
  const done = Math.min(readToday.length, DAILY_GOAL);
  const complete = daysCompleted.includes(today);
  const level = levelFromXp(xp);

  const missions = useMemo(() => dailyMissions(today), [today]);

  const data = useMemo(
    () => ({
      reads: readToday,
      quizCorrect: quizPassed.length,
      saves: swipes.filter((s) => s.direction === "down").length,
      interests: interests as string[],
    }),
    [readToday, quizPassed, swipes, interests]
  );

  /* One burst the first time the day closes out, never on re-render. */
  const celebrated = useRef(false);
  useEffect(() => {
    if (complete && !celebrated.current) {
      celebrated.current = true;
      celebrate({ count: 80 });
    }
  }, [complete]);

  return (
    <div className="rounded-[22px] border border-[var(--glass-border)] bg-surface-raised p-4 shadow-card">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Ring pct={done / DAILY_GOAL} />
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            {complete ? (
              <Check size={26} className="text-[var(--accent)]" strokeWidth={3} />
            ) : (
              <>
                <span className="text-[19px] font-extrabold leading-none tabular-nums text-ink">
                  {done}
                </span>
                <span className="text-[10px] font-semibold text-ink-faint">
                  of {DAILY_GOAL}
                </span>
              </>
            )}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold tracking-[-0.01em] text-ink">
            {complete ? "Today's done" : "Today's three"}
          </p>
          <p className="mt-0.5 text-[11.5px] leading-[1.45] text-ink-dim">
            {complete
              ? "Streak safe. Anything else today is for you, not the number."
              : `Finish ${DAILY_GOAL - done} more to keep your streak.`}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-pill bg-[#FF6B5E]/14 px-2.5 py-1 text-[10.5px] font-bold text-[#FF6B5E]">
              <Flame size={11} /> {streak}
            </span>
            {freezes > 0 && (
              <span
                className="flex items-center gap-1 rounded-pill bg-[#6FBFFF]/14 px-2.5 py-1 text-[10.5px] font-bold text-[#6FBFFF]"
                title="Covers one missed day"
              >
                <Shield size={11} /> {freezes}
              </span>
            )}
            <span className="rounded-pill bg-[var(--glass-bg)] px-2.5 py-1 text-[10.5px] font-bold text-ink-dim">
              Lv {level.level} · {level.rank}
            </span>
          </div>
        </div>
      </div>

      {/* level bar */}
      <div className="mt-3.5">
        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-[var(--glass-bg)]">
          <motion.div
            className="h-full rounded-pill bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${level.pct * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
        <p className="mt-1.5 text-[10px] font-semibold tabular-nums text-ink-faint">
          {level.into} / {level.needed} XP to {level.rank === "Oracle" ? "the top" : "next rank"}
        </p>
      </div>

      {/* missions */}
      <p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
        <Sparkles size={11} /> Today&apos;s missions
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        {missions.map((m) => {
          const prog = Math.min(missionProgress(m.kind, data), m.goal);
          const met = prog >= m.goal;
          const claimed = missionsClaimed.includes(m.id);
          return (
            <button
              key={m.id}
              disabled={!met || claimed}
              onClick={() => {
                claimMission(m.id, m.xp);
                vibrate([8, 20, 8]);
                celebrate({ count: 40 });
                showToast(`+${m.xp} XP`, "target");
              }}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                claimed
                  ? "bg-[#6EE087]/10"
                  : met
                    ? "bg-[var(--accent)]/12 active:bg-[var(--accent)]/20"
                    : "bg-[var(--glass-bg)]"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold tabular-nums",
                  claimed
                    ? "bg-[#6EE087] text-[#06301a]"
                    : met
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--glass-border)] text-ink-faint"
                )}
              >
                {claimed ? <Check size={13} strokeWidth={3} /> : `${prog}/${m.goal}`}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-[12.5px] font-semibold",
                    claimed ? "text-ink-dim line-through" : "text-ink"
                  )}
                >
                  {m.label}
                </span>
                <span className="block text-[10.5px] leading-[1.4] text-ink-faint">
                  {claimed ? "Claimed" : met ? "Tap to claim" : m.hint}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 text-[11px] font-extrabold",
                  met && !claimed ? "text-[var(--accent)]" : "text-ink-faint"
                )}
              >
                +{m.xp}
              </span>
            </button>
          );
        })}
      </div>

      {!complete && (
        <button
          onClick={() => setTab("foryou")}
          className="mt-3 w-full rounded-2xl bg-[var(--accent)] py-3 text-[13.5px] font-bold text-white shadow-glow"
        >
          Read today&apos;s stories
        </button>
      )}
    </div>
  );
}
