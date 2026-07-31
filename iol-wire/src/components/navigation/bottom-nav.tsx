"use client";

import { motion } from "framer-motion";
import { Compass, Zap, User } from "lucide-react";
import { useUI, type Tab } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "foryou", label: "For You", icon: Zap },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const tab = useUI((s) => s.tab);
  const setTab = useUI((s) => s.setTab);

  return (
    <nav
      aria-label="Main"
      className="glass-strong absolute inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-pill px-2 py-2 pb-safe"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => {
              vibrate(4);
              setTab(id);
            }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-pill",
              active ? "text-white" : "text-ink-dim"
            )}
          >
            {active && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-x-2 inset-y-0 rounded-pill bg-[var(--accent)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative flex flex-col items-center gap-0.5">
              <Icon size={id === "foryou" ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
