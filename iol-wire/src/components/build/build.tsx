"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Bookmark, Star } from "lucide-react";
import type { OpportunityType } from "@/types";
import { OPPORTUNITIES, OPPORTUNITY_TYPES, daysUntilClose } from "@/data/opportunities";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";
import { SwipeStack } from "./swipe-stack";

export function Build() {
  const [filter, setFilter] = useState<OpportunityType | "All">("All");
  const swipes = useContent((s) => s.swipes);
  const setProfilePage = useUI((s) => s.setProfilePage);
  const setTab = useUI((s) => s.setTab);

  /** Closed listings never reach the stack — a dead deadline is not an
   *  opportunity, and showing one wastes the only swipe that matters. */
  const open = useMemo(
    () => OPPORTUNITIES.filter((o) => daysUntilClose(o) >= 0),
    []
  );

  const items = useMemo(
    () => (filter === "All" ? open : open.filter((o) => o.type === filter)),
    [filter, open]
  );

  const counts = useMemo(() => {
    const by = (d: string) => swipes.filter((s) => s.direction === d).length;
    return { interested: by("right"), starred: by("up"), saved: by("down") };
  }, [swipes]);

  const goApplications = () => {
    setTab("profile");
    setProfilePage("applications");
  };

  return (
    <div className="absolute inset-x-0 bottom-[86px] top-0 overflow-y-auto overscroll-contain pb-6 pt-[58px]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="px-5"
      >
        <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          Build your <span className="text-[var(--accent)]">future.</span>
        </h1>
        <p className="mt-1.5 text-[12.5px] leading-[1.5] text-ink-dim">
          Right if you want it, left to pass. Up to star, down to save.
        </p>
      </motion.div>

      <div className="-mx-0 mt-4 flex gap-2 overflow-x-auto px-5 pb-1.5">
        {OPPORTUNITY_TYPES.map((t) => {
          const active = filter === t;
          const n = t === "All" ? open.length : open.filter((o) => o.type === t).length;
          return (
            <button
              key={t}
              onClick={() => {
                vibrate(4);
                setFilter(t);
              }}
              aria-pressed={active}
              className={cn(
                "shrink-0 rounded-pill border px-[15px] py-[9px] text-[11.5px] font-semibold transition-colors duration-200",
                active
                  ? "border-transparent bg-ink text-surface"
                  : "border-[var(--glass-border)] bg-[var(--glass-bg)] text-ink"
              )}
            >
              {t === "All" ? "All" : t + "s"}
              <span className={cn("ml-1.5 tabular-nums", active ? "opacity-55" : "opacity-45")}>
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Keyed on the filter so the deck resets cleanly when it changes. */}
      <div className="mt-4">
        <SwipeStack key={filter} items={items} />
      </div>

      <div className="mt-7 px-5">
        <div className="flex overflow-hidden rounded-[20px] border border-[var(--glass-border)] bg-surface-raised">
          {[
            { label: "Interested", value: counts.interested, icon: <Heart size={13} />, color: "#6EE087" },
            { label: "Starred", value: counts.starred, icon: <Star size={13} />, color: "#D9A0FF" },
            { label: "Saved", value: counts.saved, icon: <Bookmark size={13} />, color: "#FFD166" },
          ].map((s, i) => (
            <div key={s.label} className={cn("flex-1 py-3.5 text-center", i > 0 && "border-l border-[var(--glass-border)]")}>
              <p className="text-[19px] font-extrabold tabular-nums text-ink">{s.value}</p>
              <p
                className="mt-0.5 flex items-center justify-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: s.color }}
              >
                {s.icon}
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={goApplications}
          className="mt-3 flex w-full items-center gap-3.5 rounded-[20px] border border-[var(--glass-border)] bg-surface-raised px-4 py-4 text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)]">
            <Bookmark size={17} />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-ink">Applications</span>
            <span className="block text-[11.5px] text-ink-dim">
              Everything you swiped, and where it stands
            </span>
          </span>
          <ChevronRight size={17} className="shrink-0 text-ink-faint" />
        </button>
      </div>
    </div>
  );
}
