"use client";

import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

export function CopyableLine({
  text,
  className,
  multiline,
}: {
  text: string;
  className?: string;
  multiline?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-2 rounded-lg border border-border/60 bg-background px-3 py-2",
        className,
      )}
    >
      <p className={cn("flex-1 text-sm text-foreground/90", multiline && "whitespace-pre-line leading-relaxed")}>
        {text}
      </p>
      <CopyButton
        value={text}
        iconOnly
        variant="ghost"
        className="shrink-0 opacity-50 transition-opacity group-hover:opacity-100"
      />
    </div>
  );
}

export function OutputSection({
  title,
  icon: Icon,
  lines,
  multiline,
  description,
  action,
  className,
}: {
  title: string;
  icon?: React.ElementType;
  lines: string[];
  multiline?: boolean;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const all = lines.join("\n");
  return (
    <div className={cn("rounded-xl border border-border/70 bg-card p-4 shadow-sm", className)}>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {action}
          {lines.length > 1 ? (
            <CopyButton value={all} label="Copy all" variant="ghost" size="sm" />
          ) : null}
        </div>
      </div>
      {description ? <p className="mb-2.5 text-xs text-muted-foreground">{description}</p> : null}
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <CopyableLine key={i} text={l} multiline={multiline} />
        ))}
      </div>
    </div>
  );
}
