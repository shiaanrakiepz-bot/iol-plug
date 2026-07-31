"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/lib/ui-store";

export function Toast() {
  const toast = useUI((s) => s.toast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => {
      // clear only if it's still the same toast
      const cur = useUI.getState().toast;
      if (cur?.id === toast.id) useUI.setState({ toast: null });
    }, 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="pointer-events-none fixed left-1/2 top-16 z-[110] -translate-x-1/2"
          role="status"
        >
          <div className="glass-strong flex items-center gap-2 rounded-pill px-5 py-3 text-[13.5px] font-bold text-ink shadow-lift">
            {toast.emoji && <span aria-hidden>{toast.emoji}</span>}
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
