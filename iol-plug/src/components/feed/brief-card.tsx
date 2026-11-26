"use client";

import { Zap } from "lucide-react";
import type { Article } from "@/types";
import { CATEGORY_MAP } from "@/data/categories";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function eyebrow(now: Date): string {
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "GOOD MORNING" : hour < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";
  return `${greeting} · ${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`;
}

/**
 * The card that opens the For You lane: the day's five picks, numbered.
 * Deliberately typographic rather than photographic so it reads as a
 * digest, not another story.
 */
export function BriefCard({ picks }: { picks: Article[] }) {
  return (
    <div
      className="absolute inset-0 flex flex-col px-6 py-[26px]"
      style={{
        background:
          "linear-gradient(168deg, var(--accent) -20%, #160608 60%, #0B0B0E 100%)",
      }}
    >
      <p className="text-[9.5px] font-semibold tracking-[3px] text-white/75">
        {eyebrow(new Date())}
      </p>

      <div className="relative">
        <svg
          viewBox="0 0 200 200"
          aria-hidden
          className="animate-spin-slow absolute -top-[30px] -right-1.5 h-[126px] w-[126px]"
        >
          <polygon
            points="200,100 156,115 187,150 141,141 150,187 115,156 100,200 85,156 50,187 59,141 13,150 44,115 0,100 44,85 13,50 59,59 50,13 85,44 100,0 115,44 150,13 141,59 187,50 156,85"
            fill="rgba(255,255,255,.16)"
          />
        </svg>
        <h2 className="relative mt-2.5 text-[37px] font-black uppercase leading-[0.98] tracking-[-1px] text-white">
          Your
          <br />
          Daily
          <br />
          Brief<span style={{ color: "#FFD166" }}>.</span>
        </h2>
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-white/60">
        <Zap size={13} /> Generated from your interests
      </p>

      <div className="mt-3.5 flex flex-1 flex-col justify-center gap-[15px]">
        {picks.map((a, i) => {
          const cat = CATEGORY_MAP[a.category];
          return (
            <div key={a.id} className="flex items-baseline gap-3.5">
              <span className="w-5 shrink-0 text-[17px] font-extrabold text-white/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold leading-[1.35] text-white">
                  {a.title}
                </p>
                <p
                  className="mt-[3px] text-[10px] font-semibold tracking-[1.5px]"
                  style={{ color: cat.color }}
                >
                  {cat.label.toUpperCase()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="pb-1 text-center text-[11px] text-white/50">
        Tap to read the full brief · 2 min
      </p>
    </div>
  );
}
