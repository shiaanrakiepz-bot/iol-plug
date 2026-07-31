import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

/** Lightweight CSS-only tooltip (hover + keyboard focus). */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 max-w-[16rem] -translate-x-1/2 whitespace-normal rounded-md bg-popover px-2.5 py-1.5 text-center text-xs font-medium leading-snug text-popover-foreground opacity-0 shadow-md ring-1 ring-border transition-all duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
