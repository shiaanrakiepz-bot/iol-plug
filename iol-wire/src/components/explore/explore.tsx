"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Play, X } from "lucide-react";
import type { Article, CategoryId } from "@/types";
import { ARTICLES, posterUrl } from "@/data/articles";
import { CATEGORY_MAP, EXPLORE_CHIPS, matchesGenre, type ExploreChip } from "@/data/categories";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

/** Chip label → the genre it filters by. "All"/"Trending"/"Breaking" are special. */
const CHIP_GENRE: Partial<Record<ExploreChip, CategoryId>> = {
  Sport: "sport",
  Entertainment: "entertainment",
  Technology: "technology",
  AI: "ai",
  Cars: "cars",
  Gaming: "gaming",
  Music: "music",
};

/** Staggered tile heights, cycled, so the masonry never lines up in rows. */
const HEIGHTS = [210, 150, 185, 150, 235, 165, 195, 150, 215, 170, 150, 190, 170];

export function Explore() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<ExploreChip>("All");

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    let list = ARTICLES;
    if (chip === "Trending") list = list.slice(0, 8);
    else if (chip === "Breaking") list = list.filter((a) => a.breaking);
    else if (chip !== "All") {
      const genre = CHIP_GENRE[chip];
      if (genre) list = list.filter((a) => matchesGenre(a, genre));
    }
    if (q) {
      list = list.filter((a) =>
        `${a.title} ${CATEGORY_MAP[a.category].label} ${CATEGORY_MAP[a.section].label} ${a.source}`
          .toLowerCase()
          .includes(q)
      );
    }
    return list;
  }, [q, chip]);

  const breaking = ARTICLES.find((a) => a.breaking);
  const showBanner = Boolean(breaking) && chip === "All" && !q;

  return (
    <div className="absolute inset-x-0 bottom-[86px] top-0 overflow-y-auto overscroll-contain px-4 pb-6 pt-[58px]">
      <div className="flex items-baseline justify-between">
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px] text-ink">
          Explore
        </h1>
        <span className="text-[10px] font-semibold tracking-[2.5px] text-[var(--accent)]">
          LIVE WIRE
        </span>
      </div>

      {/* search */}
      <div className="mt-3 flex items-center gap-2.5 rounded-[17px] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3">
        <Search size={16} className="shrink-0 text-ink-dim" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the wire"
          className="w-full min-w-0 bg-transparent text-[13px] text-ink placeholder:text-ink-faint focus:outline-none allow-select"
          aria-label="Search the wire"
        />
        {q && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--glass-bg)] text-ink-dim"
          >
            <X size={11} strokeWidth={2.4} />
          </button>
        )}
      </div>

      {/* filter chips */}
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1.5 pt-0.5">
        {EXPLORE_CHIPS.map((c) => {
          const active = chip === c;
          return (
            <button
              key={c}
              onClick={() => setChip(c)}
              aria-pressed={active}
              className={cn(
                "shrink-0 rounded-pill border border-[var(--glass-border)] px-[15px] py-[9px] text-[11.5px] font-semibold transition-all duration-200",
                active
                  ? "bg-ink text-surface"
                  : "bg-[var(--glass-bg)] text-ink"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      {showBanner && breaking && <BreakingBanner article={breaking} />}

      <div className="masonry mt-3">
        {results.map((a, i) => (
          <ExploreCard key={a.id} article={a} height={HEIGHTS[i % HEIGHTS.length]} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="px-6 py-[52px] text-center text-ink-dim">
          <p className="text-[15px] font-bold text-ink">
            No results for “{query.trim() || chip}”
          </p>
          <p className="mt-1.5 text-[12px]">Try a topic, a city or a source.</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function useOpenStory() {
  const openReader = useUI((s) => s.openReader);
  const openVideo = useUI((s) => s.openVideo);
  return (a: Article) => (a.type === "video" ? openVideo(a.id) : openReader(a.id));
}

function BreakingBanner({ article }: { article: Article }) {
  const open = useOpenStory();
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => open(article)}
      className="relative mt-3 block h-[118px] w-full overflow-hidden rounded-[22px] text-left"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${posterUrl(article, 800, 440)})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(160,10,25,.92), rgba(160,10,25,.4) 65%, transparent)",
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-[18px] py-4">
        <span className="flex items-center gap-1.5 text-[9.5px] font-bold tracking-[2px] text-white">
          <span className="animate-pulse-soft h-[7px] w-[7px] rounded-full bg-white" />
          BREAKING
        </span>
        <p className="max-w-[82%] text-[14.5px] font-bold leading-[1.3] text-white [text-wrap:pretty]">
          {article.title}
        </p>
      </div>
    </motion.button>
  );
}

function ExploreCard({ article, height }: { article: Article; height: number }) {
  const open = useOpenStory();
  const cat = CATEGORY_MAP[article.category];
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => open(article)}
      style={{ height }}
      className="relative block w-full overflow-hidden rounded-[22px] bg-surface-raised text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterUrl(article, 400, 560)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,.86))",
        }}
      />
      <span
        className="absolute left-[11px] top-[11px] rounded-pill px-2.5 py-1 text-[8.5px] font-bold tracking-[1px] text-[#0B0B0E]"
        style={{ background: cat.color }}
      >
        {cat.label.toUpperCase()}
      </span>
      {article.type === "video" && (
        <span className="absolute left-1/2 top-1/2 flex h-[38px] w-[38px] -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md">
          <Play size={14} fill="currentColor" strokeWidth={0} className="ml-0.5" />
        </span>
      )}
      <div className="absolute inset-x-[13px] bottom-3">
        <p className="text-[12.5px] font-bold leading-[1.3] text-white [text-wrap:pretty]">
          {article.title}
        </p>
        <p className="mt-1 text-[9.5px] font-medium text-white/60">
          {article.source} · {article.publishedAt}
        </p>
      </div>
    </motion.button>
  );
}
