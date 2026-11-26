"use client";

import { motion } from "framer-motion";
import { Compass, Plus, Briefcase, Zap, User } from "lucide-react";
import { useContent } from "@/lib/store";
import { useUI, type Tab } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";

const TABS: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { id: "foryou", label: "For You", icon: Zap },
  { id: "build", label: "Build", icon: Briefcase },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "profile", label: "You", icon: User },
];

export function BottomNav() {
  const tab = useUI((s) => s.tab);
  const setTab = useUI((s) => s.setTab);
  const setCreate = useUI((s) => s.setCreate);
  const pending = useContent(
    (s) => s.submissions.filter((x) => x.status === "pending").length
  );

  /** Create sits in the middle as a button, not a tab: you don't navigate to
   *  it, you open it, make something, and come back where you were. */
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  const Item = ({ id, label, icon: Icon }: (typeof TABS)[number]) => {
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
            className="absolute inset-x-1 inset-y-0 rounded-pill bg-[var(--accent)]"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <span className="relative flex flex-col items-center gap-0.5">
          <Icon size={19} strokeWidth={active ? 2.5 : 2} />
          <span className="whitespace-nowrap text-[9.5px] font-bold">{label}</span>
        </span>
      </button>
    );
  };

  return (
    <nav
      aria-label="Main"
      className="lg lg-bar lg-refract lg-pill absolute inset-x-4 bottom-4 z-30 flex items-center gap-1 rounded-pill px-2 py-2 pb-safe"
    >
      {left.map(Item)}

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          vibrate(6);
          setCreate(true);
        }}
        aria-label="Create"
        className="relative mx-0.5 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-glow"
      >
        <Plus size={22} strokeWidth={2.6} />
        {/* Your own items still waiting on a moderator. */}
        {pending > 0 && (
          <span
            aria-label={`${pending} awaiting review`}
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FFD166] px-1 text-[9.5px] font-extrabold tabular-nums text-[#3a2600]"
          >
            {pending}
          </span>
        )}
      </motion.button>

      {right.map(Item)}
    </nav>
  );
}
