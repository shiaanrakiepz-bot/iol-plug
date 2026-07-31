"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Heart, Search } from "lucide-react";
import type { Article } from "@/types";
import { ARTICLES, posterUrl } from "@/data/articles";
import { CATEGORY_MAP, matchesGenre } from "@/data/categories";
import { useContent, useSettings, useTint } from "@/lib/store";
import { useUI, type FeedLane } from "@/lib/ui-store";
import { StoryCard } from "./story-card";
import { BriefCard } from "./brief-card";
import { nativeShare } from "@/lib/share";
import { vibrate } from "@/lib/utils";

const SWIPE_DIST = 90;
const SWIPE_VEL = 500;

/** The Daily Brief rides at the head of the personalised lanes. */
type FeedItem =
  | { kind: "brief"; id: "brief"; picks: Article[] }
  | { kind: "story"; id: string; article: Article };

function buildFeed(
  lane: FeedLane,
  interests: string[],
  followed: string[],
  notInterested: string[]
): FeedItem[] {
  const pool = ARTICLES.filter((a) => !notInterested.includes(a.id));
  const pref = new Set([...interests, ...followed]);
  const isPreferred = (a: Article) =>
    pref.has(a.category) || pref.has(a.section);

  const withBrief = (list: Article[]): FeedItem[] => {
    if (!list.length) return [];
    return [
      { kind: "brief", id: "brief", picks: list.slice(0, 5) },
      ...list.map((a): FeedItem => ({ kind: "story", id: a.id, article: a })),
    ];
  };

  if (lane === "foryou") {
    // Matches first, everything else after — never hide a story, just re-rank.
    const ranked = pref.size
      ? [...pool.filter(isPreferred), ...pool.filter((a) => !isPreferred(a))]
      : pool;
    return withBrief(ranked);
  }

  if (lane === "following") {
    return withBrief(pool.filter(isPreferred));
  }

  if (lane === "breaking") {
    return pool
      .filter((a) => a.breaking)
      .map((a) => ({ kind: "story", id: a.id, article: a }));
  }

  return pool
    .filter((a) => matchesGenre(a, lane))
    .map((a) => ({ kind: "story", id: a.id, article: a }));
}

function laneLabel(lane: FeedLane): string {
  if (lane === "foryou") return "For You";
  if (lane === "following") return "Following";
  return CATEGORY_MAP[lane]?.label ?? lane;
}

export function Feed() {
  const lane = useUI((s) => s.feedGenre);
  const setLane = useUI((s) => s.setFeedGenre);
  const interests = useSettings((s) => s.interests);
  const followed = useContent((s) => s.followedTopics);
  const notInterested = useContent((s) => s.notInterested);
  const setTint = useTint((s) => s.setTint);

  const feed = useMemo(
    () => buildFeed(lane, interests, followed, notInterested),
    [lane, interests, followed, notInterested]
  );

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Swapping lanes shows a brief skeleton so the change reads as a fetch
  // rather than a jump cut.
  useEffect(() => {
    setIndex(0);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 480);
    return () => clearTimeout(t);
  }, [lane]);

  const current = feed.length ? feed[index % feed.length] : undefined;
  const next = feed.length > 1 ? feed[(index + 1) % feed.length] : undefined;
  const prev =
    feed.length > 1 ? feed[(index - 1 + feed.length) % feed.length] : undefined;

  // Paint the shell with whatever story is on screen.
  const tint =
    current?.kind === "story"
      ? CATEGORY_MAP[current.article.category]?.color ?? null
      : null;
  useEffect(() => {
    setTint(tint);
    return () => setTint(null);
  }, [tint, setTint]);

  const watermark =
    lane === "foryou" || lane === "following" ? null : laneLabel(lane).toUpperCase();

  return (
    <div className="absolute inset-0">
      {/* genre watermark behind the stack */}
      {watermark && (
        <div className="pointer-events-none absolute inset-x-0 top-[90px] z-[1] flex justify-center">
          <span
            className="px-5 text-center font-black uppercase leading-[1.05] tracking-[1px] text-ink opacity-95"
            style={{ fontSize: watermark.length > 9 ? 30 : 46 }}
          >
            {watermark}
          </span>
        </div>
      )}

      {/* the story behind you, peeking above */}
      {prev && !loading && (
        <div className="absolute inset-x-[34px] top-[132px] z-[1] h-[46px] overflow-hidden rounded-[24px] bg-surface-raised opacity-85 shadow-card">
          <PeekArt item={prev} position="bottom" />
        </div>
      )}

      {/* the story ahead, peeking below */}
      {next && !loading && (
        <div className="absolute inset-x-5 bottom-[92px] top-[150px] translate-y-[22px] scale-[.96] overflow-hidden rounded-[34px] bg-surface-raised opacity-55">
          <PeekArt item={next} position="center" />
        </div>
      )}

      {loading && <FeedSkeleton />}

      {!loading && !feed.length && (
        <EmptyLane label={laneLabel(lane)} onReset={() => setLane("foryou")} />
      )}

      {!loading && current && (
        <CardStack
          key={`${lane}-${index}-${current.id}`}
          item={current}
          onAdvance={() => setIndex((i) => i + 1)}
        />
      )}

      <GestureHints />
    </div>
  );
}

/* ------------------------------------------------------------------ */
function PeekArt({
  item,
  position,
}: {
  item: FeedItem;
  position: "center" | "bottom";
}) {
  return (
    <>
      {item.kind === "story" ? (
        <div
          className="absolute inset-0 bg-[#101014] bg-cover"
          style={{
            backgroundImage: `url(${posterUrl(item.article)})`,
            backgroundPosition: position === "bottom" ? "center bottom" : "center",
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(168deg, var(--accent) -20%, #160608 60%, #0B0B0E 100%)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
    </>
  );
}

/* ------------------------------------------------------------------ */
function CardStack({
  item,
  onAdvance,
}: {
  item: FeedItem;
  onAdvance: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);

  const [heartBurst, setHeartBurst] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressTap = useRef(false);

  const article = item.kind === "story" ? item.article : null;

  const toggleLike = useContent((s) => s.toggleLike);
  const liked = useContent((s) =>
    article ? s.liked.includes(article.id) : false
  );
  const bumpShares = useContent((s) => s.bumpShares);
  const openPlaylist = useUI((s) => s.openPlaylist);
  const openContext = useUI((s) => s.openContext);
  const openReader = useUI((s) => s.openReader);
  const openVideo = useUI((s) => s.openVideo);
  const openShare = useUI((s) => s.openShare);
  const setBrief = useUI((s) => s.setBrief);
  const showToast = useUI((s) => s.showToast);
  const addHistory = useContent((s) => s.addHistory);

  const burst = () => {
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 780);
  };

  const snapBack = () => {
    animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
    animate(y, 0, { type: "spring", stiffness: 420, damping: 32 });
  };

  const onDragEnd = async (
    _: unknown,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    const { offset, velocity } = info;
    const horizontal = Math.abs(offset.x) > Math.abs(offset.y);

    if (!horizontal && (offset.y < -SWIPE_DIST || velocity.y < -SWIPE_VEL)) {
      vibrate(6);
      if (article) addHistory(article.id);
      await animate(y, -window.innerHeight, {
        duration: 0.29,
        ease: [0.32, 0.72, 0, 1],
      });
      onAdvance();
      return;
    }
    if (!horizontal && (offset.y > SWIPE_DIST || velocity.y > SWIPE_VEL)) {
      vibrate(8);
      if (article) openPlaylist(article.id);
      snapBack();
      return;
    }
    if (horizontal && (offset.x < -SWIPE_DIST || velocity.x < -SWIPE_VEL)) {
      if (article) {
        if (!liked) {
          toggleLike(article.id);
          burst();
          vibrate([10, 30, 10]);
        } else {
          showToast("Already in your likes", "❤️");
        }
      }
      snapBack();
      return;
    }
    if (horizontal && (offset.x > SWIPE_DIST || velocity.x > SWIPE_VEL)) {
      vibrate(6);
      snapBack();
      if (!article) return;
      const handled = await nativeShare(article);
      if (handled) {
        bumpShares();
        showToast("Shared", "📣");
      } else {
        openShare(article.id);
      }
      return;
    }
    snapBack();
  };

  const startPress = () => {
    suppressTap.current = false;
    pressTimer.current = setTimeout(() => {
      if (!article) return;
      suppressTap.current = true;
      vibrate(12);
      if (article.type === "video") setPreviewing(true);
      else openContext(article.id);
    }, 430);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (previewing) setPreviewing(false);
  };

  const onTapCard = () => {
    if (suppressTap.current) {
      suppressTap.current = false;
      return;
    }
    if (!article) {
      setBrief(true);
      return;
    }
    addHistory(article.id);
    if (article.type === "video") openVideo(article.id);
    else openReader(article.id);
  };

  return (
    <motion.div
      className="absolute inset-x-5 bottom-[92px] top-[150px] z-[2] cursor-grab overflow-hidden rounded-[34px] bg-[#101014] shadow-card active:cursor-grabbing"
      drag
      dragElastic={0.55}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      style={{ x, y, rotate }}
      animate={{ scale: previewing ? 1.045 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onDragStart={cancelPress}
      onDragEnd={onDragEnd}
      onTapStart={startPress}
      onTap={() => {
        cancelPress();
        onTapCard();
      }}
      onTapCancel={cancelPress}
    >
      {item.kind === "brief" ? (
        <BriefCard picks={item.picks} />
      ) : (
        <StoryCard
          article={item.article}
          active
          preview={previewing}
          onLikeBurst={burst}
        />
      )}

      <AnimatePresence>
        {heartBurst && (
          <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center">
            <Heart
              size={118}
              fill="var(--accent)"
              stroke="none"
              className="animate-heart-pop drop-shadow-[0_10px_30px_rgba(0,0,0,.5)]"
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
function FeedSkeleton() {
  return (
    <div className="absolute inset-x-5 bottom-[92px] top-[150px] overflow-hidden rounded-[34px] bg-surface-raised">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 25%, rgba(255,255,255,.05) 45%, transparent 65%)",
          backgroundSize: "720px 100%",
          animation: "shimmer 1.1s linear infinite",
        }}
      />
      <div className="absolute inset-x-[22px] bottom-7 flex flex-col gap-3">
        <div className="h-[22px] w-[84px] rounded-pill bg-white/[.07]" />
        <div className="h-5 w-[90%] rounded-lg bg-white/[.09]" />
        <div className="h-5 w-[70%] rounded-lg bg-white/[.09]" />
        <div className="h-3 w-[95%] rounded-md bg-white/[.06]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function EmptyLane({ label, onReset }: { label: string; onReset: () => void }) {
  return (
    <div className="absolute inset-x-5 bottom-[92px] top-[150px] flex flex-col items-center justify-center gap-2.5 rounded-[34px] border-[1.5px] border-dashed border-[var(--glass-border)] px-8 text-center text-ink-dim">
      <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[var(--glass-bg)]">
        <Search size={24} />
      </span>
      <p className="text-[16px] font-bold text-ink">Nothing here yet</p>
      <p className="text-[12px] leading-[1.5]">
        No {label} stories on the wire right now.
        <br />
        Check back soon.
      </p>
      <button
        onClick={onReset}
        className="mt-2 rounded-pill border border-[var(--glass-border)] bg-[var(--glass-bg)] px-[22px] py-[11px] text-[12.5px] font-semibold text-ink"
      >
        Back to For You
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
const MOVES = [
  { glyph: "↑", color: "#6EE087", title: "Swipe up", detail: "Next story" },
  { glyph: "↓", color: "#FFD166", title: "Swipe down", detail: "Save to a playlist" },
  { glyph: "←", color: "#FF8FB1", title: "Swipe left", detail: "Like it" },
  { glyph: "→", color: "#7CC4FF", title: "Swipe right", detail: "Share it" },
  { glyph: "◉", color: "#D9A0FF", title: "Hold", detail: "More options · video preview" },
  { glyph: "●", color: "#9EF0F0", title: "Tap", detail: "Open the full story" },
];

function GestureHints() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("wire-hints-seen")) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("wire-hints-seen", "1");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/55 backdrop-blur-[14px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="w-[79%] rounded-[28px] border border-white/[.14] bg-[rgba(24,24,30,.9)] px-6 py-[26px] text-white"
          >
            <h3 className="text-[20px] font-extrabold leading-tight tracking-[-0.4px]">
              One feed.
              <br />
              Four moves.
            </h3>
            <div className="mt-[18px] flex flex-col gap-[13px]">
              {MOVES.map((m) => (
                <div key={m.title} className="flex items-center gap-[13px]">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[.12] bg-white/[.08] text-sm font-bold"
                    style={{ color: m.color }}
                    aria-hidden
                  >
                    {m.glyph}
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold">{m.title}</p>
                    <p className="text-[11px] text-white/55">{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={dismiss}
              className="mt-5 w-full rounded-[15px] bg-[var(--accent)] py-[13px] text-[13px] font-bold text-white"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
