"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Draggable glass bottom sheet with blurred backdrop. */
export function Sheet({
  onClose,
  children,
  title,
  className,
}: {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        aria-label="Close"
        className="absolute inset-0 bg-black/55"
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "glass-strong lg-refract relative w-full max-w-md rounded-t-[2rem] px-5 pb-8 pt-3 text-ink",
          className
        )}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 90 || info.velocity.y > 500) onClose();
        }}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink-faint/40" aria-hidden />
        {title && (
          <h3 className="mb-4 text-center text-[15px] font-bold tracking-tight">
            {title}
          </h3>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}
