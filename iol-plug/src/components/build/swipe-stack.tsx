"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  Bookmark,
  BadgeCheck,
  Check,
  Clock,
  Heart,
  MapPin,
  RotateCcw,
  ShieldAlert,
  Star,
  X,
} from "lucide-react";
import type { Opportunity, SwipeDirection } from "@/types";
import { imageUrl } from "@/data/articles";
import { TYPE_COLOR, closingLabel, daysUntilClose } from "@/data/opportunities";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";
import type { GlyphName } from "@/components/icons/glyphs";

const THROW = 110;
const VELOCITY = 420;

/** What each direction means, in one place — the stamps, the toasts and the
 *  buttons all read from here so they can never drift apart. */
const MOVES: Record<
  SwipeDirection,
  { label: string; toast: string; glyph: GlyphName; color: string }
> = {
  right: { label: "Interested", toast: "Added to Interested", glyph: "check", color: "#6EE087" },
  left: { label: "Pass", toast: "Hidden from your stack", glyph: "cross", color: "#FF6B5E" },
  up: { label: "Love it", toast: "Starred", glyph: "star", color: "#D9A0FF" },
  down: { label: "Saved", toast: "Saved for later", glyph: "pin", color: "#FFD166" },
};

function Stamp({
  direction,
  opacity,
  className,
}: {
  direction: SwipeDirection;
  opacity: ReturnType<typeof useTransform<number, number>>;
  className: string;
}) {
  const move = MOVES[direction];
  return (
    <motion.span
      style={{ opacity, color: move.color, borderColor: move.color }}
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-2xl border-[3px] px-3 py-1 text-[20px] font-extrabold uppercase tracking-wide",
        className
      )}
    >
      {move.label}
    </motion.span>
  );
}

function Card({
  opp,
  isTop,
  onSwipe,
}: {
  opp: Opportunity;
  isTop: boolean;
  onSwipe: (d: SwipeDirection) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-14, 14]);
  const right = useTransform(x, [24, 130], [0, 1]);
  const left = useTransform(x, [-130, -24], [1, 0]);
  const up = useTransform(y, [-130, -24], [1, 0]);
  const down = useTransform(y, [24, 130], [0, 1]);

  const openOpportunity = useUI((s) => s.openOpportunity);
  const closing = daysUntilClose(opp);

  return (
    <motion.div
      style={{ x, y, rotate }}
      drag={isTop}
      dragElastic={0.7}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        const { offset, velocity } = info;
        const horizontal = Math.abs(offset.x) > Math.abs(offset.y);
        if (horizontal && (Math.abs(offset.x) > THROW || Math.abs(velocity.x) > VELOCITY)) {
          onSwipe(offset.x > 0 ? "right" : "left");
          return;
        }
        if (!horizontal && (Math.abs(offset.y) > THROW || Math.abs(velocity.y) > VELOCITY)) {
          onSwipe(offset.y < 0 ? "up" : "down");
          return;
        }
        animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
        animate(y, 0, { type: "spring", stiffness: 420, damping: 32 });
      }}
      initial={{ scale: 0.95, opacity: 0, y: 18 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "absolute inset-0 overflow-hidden rounded-card bg-[#0d0d11] shadow-card",
        isTop && "cursor-grab active:cursor-grabbing"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={opp.image ?? imageUrl(opp.imageSeed, 700, 1000)}
        alt=""
        draggable={false}
        className="no-drag absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,.5), transparent 30%, transparent 40%, rgba(0,0,0,.92) 88%)",
        }}
      />

      {/*
        Only the top card paints its copy. The prototype rendered every card in
        the stack, so the text of the ones underneath bled through the one on
        top — the visual bug called out in the handoff.
      */}
      {isTop && (
        <>
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            <span
              className="rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0B0B0E]"
              style={{ background: TYPE_COLOR[opp.type] }}
            >
              {opp.type}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[10px] font-bold backdrop-blur-md",
                closing <= 3
                  ? "bg-[rgba(232,25,44,.92)] text-white"
                  : "bg-black/55 text-white"
              )}
            >
              <Clock size={11} />
              {closingLabel(opp)}
            </span>
          </div>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              openOpportunity(opp.id);
            }}
            className="absolute inset-x-0 bottom-0 p-5 text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[14px] font-extrabold text-white backdrop-blur-md">
                {opp.org[0]}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white/85">
                  {opp.org}
                  {opp.verified && (
                    <BadgeCheck
                      size={12}
                      className="ml-1 inline align-[-2px] text-[#7CE0B3]"
                      aria-label="Verified employer"
                    />
                  )}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-white/60">
                  <MapPin size={10} />
                  {opp.remote ? "Remote · " : ""}
                  {opp.location}
                </p>
              </div>
            </div>

            <h3 className="mt-3 text-[21px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white [text-wrap:pretty]">
              {opp.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-[1.5] text-white/72">
              {opp.blurb}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {opp.stipend && (
                <span className="rounded-pill bg-white/15 px-2.5 py-1 text-[10.5px] font-semibold text-white">
                  {opp.stipend}
                </span>
              )}
              {opp.skills.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="rounded-pill bg-white/10 px-2.5 py-1 text-[10.5px] font-medium text-white/85"
                >
                  {s}
                </span>
              ))}
            </div>

            {/*
              Unverified listings say so on the card itself. Fake job ads aimed
              at young South Africans are common, and this one carries the IOL
              masthead — the warning belongs where the decision is made, not
              buried in a detail screen.
            */}
            {!opp.verified && (
              <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-[rgba(255,209,102,.16)] px-2.5 py-2 text-[10.5px] font-semibold text-[#FFD166]">
                <ShieldAlert size={12} className="shrink-0" />
                Employer not verified by IOL — never pay to apply
              </p>
            )}
          </button>

          <Stamp direction="right" opacity={right} className="left-6 top-8 -rotate-12" />
          <Stamp direction="left" opacity={left} className="right-6 top-8 rotate-12" />
          <Stamp direction="up" opacity={up} className="left-1/2 top-24 -translate-x-1/2" />
          <Stamp
            direction="down"
            opacity={down}
            className="bottom-32 left-1/2 -translate-x-1/2"
          />
        </>
      )}
    </motion.div>
  );
}

function ActionButton({
  direction,
  big,
  onPress,
  children,
}: {
  direction: SwipeDirection;
  big?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const move = MOVES[direction];
  return (
    <motion.button
      whileTap={{ scale: 0.86 }}
      onClick={onPress}
      aria-label={move.label}
      className={cn(
        "glass lg-press flex items-center justify-center rounded-full",
        big ? "h-[58px] w-[58px]" : "h-[48px] w-[48px]"
      )}
      style={{ color: move.color }}
    >
      {children}
    </motion.button>
  );
}

export function SwipeStack({ items }: { items: Opportunity[] }) {
  const swipes = useContent((s) => s.swipes);
  const recordSwipe = useContent((s) => s.recordSwipe);
  const undoSwipe = useContent((s) => s.undoSwipe);
  const clearSwipes = useContent((s) => s.clearSwipes);
  const showToast = useUI((s) => s.showToast);

  const [burst, setBurst] = useState<SwipeDirection | null>(null);

  /** The deck is whatever hasn't been judged yet — derived, never duplicated
   *  into local state, so a swipe elsewhere in the app is reflected here. */
  const deck = useMemo(() => {
    const seen = new Set(swipes.map((s) => s.opportunityId));
    return items.filter((o) => !seen.has(o.id));
  }, [items, swipes]);

  const act = (direction: SwipeDirection) => {
    const top = deck[0];
    if (!top) return;
    const move = MOVES[direction];
    vibrate(direction === "left" ? 6 : [10, 30, 10]);
    recordSwipe(top.id, direction);
    setBurst(direction);
    setTimeout(() => setBurst(null), 420);
    showToast(move.toast, move.glyph);
  };

  const undo = () => {
    const id = undoSwipe();
    if (!id) return;
    vibrate(6);
    showToast("Back it comes", "undo");
  };

  const visible = deck.slice(0, 3);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-5 h-[456px] w-[calc(100%-40px)]">
        <AnimatePresence initial={false}>
          {visible.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-card border border-[var(--glass-border)] bg-surface-raised px-8 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-glow">
                <Check size={30} strokeWidth={2.6} />
              </span>
              <p className="text-[18px] font-extrabold text-ink">Stack cleared</p>
              <p className="max-w-[240px] text-[12.5px] leading-[1.55] text-ink-dim">
                You&apos;ve been through everything here. Your Interested and Saved
                lists are in Applications.
              </p>
              <button
                onClick={() => {
                  clearSwipes();
                  showToast("Stack reset", "undo");
                }}
                className="mt-1 flex items-center gap-2 rounded-pill border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-[12.5px] font-semibold text-ink"
              >
                <RotateCcw size={14} /> Start over
              </button>
            </motion.div>
          )}

          {/* Painted back-to-front so the first item sits on top. */}
          {visible
            .map((opp, i) => ({ opp, i }))
            .reverse()
            .map(({ opp, i }) => (
              <motion.div
                key={opp.id}
                className="absolute inset-0"
                animate={{ scale: 1 - i * 0.04, y: i * 12 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: visible.length - i }}
              >
                <Card opp={opp} isTop={i === 0} onSwipe={act} />
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Colour wash confirming the verdict, matched to the stamp. */}
        <AnimatePresence>
          {burst && (
            <motion.div
              key={burst}
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-card"
              style={{ background: MOVES[burst].color }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Every gesture has a button. The stack is unusable with a screen
          reader or a keyboard otherwise. */}
      {deck.length > 0 && (
        <div className="mt-5 flex items-center gap-3.5">
          <ActionButton direction="left" big onPress={() => act("left")}>
            <X size={24} />
          </ActionButton>
          <ActionButton direction="down" onPress={() => act("down")}>
            <Bookmark size={19} />
          </ActionButton>
          <ActionButton direction="up" onPress={() => act("up")}>
            <Star size={19} />
          </ActionButton>
          <ActionButton direction="right" big onPress={() => act("right")}>
            <Heart size={24} />
          </ActionButton>
        </div>
      )}

      {swipes.length > 0 && (
        <button
          onClick={undo}
          className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-ink-dim"
        >
          <RotateCcw size={13} /> Undo last swipe
        </button>
      )}
    </div>
  );
}
