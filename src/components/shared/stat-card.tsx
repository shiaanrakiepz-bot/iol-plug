import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "success" | "warning";
  className?: string;
}

export function StatCard({ icon: Icon, label, value, hint, tone = "default", className }: StatCardProps) {
  const toneClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning",
  }[tone];

  return (
    <div className={cn("rounded-xl border border-border/70 bg-card p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", toneClasses)}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
