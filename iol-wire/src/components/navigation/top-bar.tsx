"use client";

import { motion } from "framer-motion";
import { Menu, Share } from "lucide-react";
import { useUI, type FeedLane } from "@/lib/ui-store";
import { useContent } from "@/lib/store";
import { cn } from "@/lib/utils";

const LANES: { id: FeedLane; label: string }[] = [
  { id: "following", label: "Following" },
  { id: "foryou", label: "For You" },
  { id: "breaking", label: "Breaking" },
];

export function TopBar() {
  const setDrawer = useUI((s) => s.setDrawer);
  const lane = useUI((s) => s.feedGenre);
  const setLane = useUI((s) => s.setFeedGenre);
  const tab = useUI((s) => s.tab);
  const showToast = useUI((s) => s.showToast);
  const bumpShares = useContent((s) => s.bumpShares);

  const shareApp = async () => {
    const data = {
      title: "IOL Plug",
      text: "News that actually gets you. Swipe it on IOL Plug.",
      url: "https://iol.co.za/plug",
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        bumpShares();
        showToast("Shared", "megaphone");
      } else {
        await navigator.clipboard.writeText(data.url);
        showToast("Link copied", "link");
      }
    } catch {
      /* user dismissed */
    }
  };

  return (
    <div className="absolute inset-x-0 top-0 z-30 flex h-[60px] items-center justify-between px-3.5 pt-safe">
      <GlassButton label="Choose genre" onPress={() => setDrawer(true)}>
        <Menu size={18} />
      </GlassButton>

      {tab === "foryou" && (
        <div className="flex items-center gap-0.5">
          {LANES.map(({ id, label }) => {
            const active = lane === id;
            return (
              <button
                key={id}
                onClick={() => setLane(id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-pill border transition-all duration-200",
                  active
                    ? "border-[var(--glass-border)] bg-[var(--glass-bg)] px-3.5 py-2 text-[12px] font-extrabold text-ink"
                    : "border-transparent px-[5px] py-2 text-[11px] font-semibold text-ink-dim"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <GlassButton label="Share IOL Plug" onPress={shareApp}>
        <Share size={17} />
      </GlassButton>
    </div>
  );
}

function GlassButton({
  children,
  label,
  onPress,
}: {
  children: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onPress}
      aria-label={label}
      className="lg lg-thin lg-press flex h-[42px] w-[42px] items-center justify-center rounded-full text-ink"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.03))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.32), 0 6px 18px rgba(0,0,0,.32)",
      }}
    >
      {children}
    </motion.button>
  );
}
