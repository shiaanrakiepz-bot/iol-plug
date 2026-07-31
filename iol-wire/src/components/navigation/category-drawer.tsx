"use client";

import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import { DRAWER_GENRES, CATEGORY_MAP } from "@/data/categories";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";

/** Left slide-in genre drawer. Picking a genre refilters the feed. */
export function CategoryDrawer() {
  const setDrawer = useUI((s) => s.setDrawer);
  const feedGenre = useUI((s) => s.feedGenre);
  const setFeedGenre = useUI((s) => s.setFeedGenre);
  const setTab = useUI((s) => s.setTab);
  const showToast = useUI((s) => s.showToast);

  const pick = (genre: typeof feedGenre) => {
    vibrate(5);
    setFeedGenre(genre);
    setTab("foryou");
    if (genre === "foryou") {
      showToast("Back to your feed", "⚡");
    } else if (genre === "following") {
      showToast("Following lane", "✅");
    } else {
      showToast(`${CATEGORY_MAP[genre].label} lane`, CATEGORY_MAP[genre].emoji);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[75]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/55"
        style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        onClick={() => setDrawer(false)}
      />
      <motion.div
        className="glass-strong absolute bottom-0 left-0 top-0 flex w-[78%] max-w-xs flex-col rounded-r-[2rem] p-5 pt-safe"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 360, damping: 34 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.5, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70) setDrawer(false);
        }}
        role="dialog"
        aria-label="Genres"
      >
        <div className="flex items-center justify-between pb-2 pt-2">
          <h2 className="text-lg font-bold tracking-tight text-ink">Genres</h2>
          <button
            onClick={() => setDrawer(false)}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/8 text-ink"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-2 flex-1 space-y-1 overflow-y-auto pb-6">
          <GenreRow
            active={feedGenre === "foryou"}
            color="var(--accent)"
            label="For You"
            emoji={<Zap size={17} />}
            onPress={() => pick("foryou")}
          />
          {DRAWER_GENRES.map((id, i) => {
            const cat = CATEGORY_MAP[id];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 * i }}
              >
                <GenreRow
                  active={feedGenre === id}
                  color={cat.color}
                  label={cat.label}
                  emoji={<span aria-hidden>{cat.emoji}</span>}
                  onPress={() => pick(id)}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GenreRow({
  active,
  color,
  label,
  emoji,
  onPress,
}: {
  active: boolean;
  color: string;
  label: string;
  emoji: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <button
      onClick={onPress}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[14.5px] font-semibold transition-colors",
        active ? "text-white" : "text-ink active:bg-ink/8"
      )}
      style={active ? { background: color } : undefined}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          active ? "bg-white/20" : "bg-ink/6"
        )}
        style={!active ? { color } : undefined}
      >
        {emoji}
      </span>
      {label}
    </button>
  );
}
