import { Info } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function NeedsConfirmation({
  className,
  compact,
  text = "This value hasn't been confirmed from the official brand guide yet. An admin can update it once verified.",
}: {
  className?: string;
  compact?: boolean;
  text?: string;
}) {
  return (
    <Tooltip content={text}>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning",
          className,
        )}
      >
        <Info className="h-3 w-3" />
        {compact ? "Needs confirmation" : "Needs official confirmation"}
      </span>
    </Tooltip>
  );
}
