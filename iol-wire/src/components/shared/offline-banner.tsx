"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useUI } from "@/lib/ui-store";
import { useContent } from "@/lib/store";

export function OfflineBanner() {
  const online = useUI((s) => s.online);
  const downloads = useContent((s) => s.downloads);

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed inset-x-4 top-3 z-[105]"
          role="alert"
        >
          <div className="glass-strong flex items-center gap-3 rounded-2xl px-4 py-3 text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
              <WifiOff size={17} />
            </span>
            <div>
              <p className="text-[13px] font-bold">You&apos;re offline</p>
              <p className="text-[11.5px] font-medium text-ink-dim">
                {downloads.length > 0
                  ? `${downloads.length} downloaded ${downloads.length === 1 ? "story is" : "stories are"} still available`
                  : "Saved stories will appear when you reconnect"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
