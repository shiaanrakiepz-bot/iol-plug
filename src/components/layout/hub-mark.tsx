import { PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The Design Hub's own product mark (an internal tool identity). It is NOT a
 * reproduction of any publication's official logo — those live in the Logo
 * Vault as upload slots.
 */
export function HubMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <PenTool style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  );
}
