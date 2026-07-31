import { Check, Clock, CircleDashed, AlertCircle } from "lucide-react";
import { Badge, type BadgeProps } from "./badge";

type StatusMeta = {
  label: string;
  variant: BadgeProps["variant"];
  Icon: React.ElementType;
};

const META: Record<string, StatusMeta> = {
  approved: { label: "Approved", variant: "success", Icon: Check },
  confirmed: { label: "Confirmed", variant: "success", Icon: Check },
  "needs-review": { label: "Needs review", variant: "warning", Icon: Clock },
  "in-review": { label: "In review", variant: "warning", Icon: Clock },
  "needs-confirmation": { label: "Needs confirmation", variant: "warning", Icon: AlertCircle },
  missing: { label: "Missing", variant: "muted", Icon: CircleDashed },
};

export function StatusBadge({
  status,
  className,
  labelOverride,
}: {
  status: string;
  className?: string;
  labelOverride?: string;
}) {
  const meta = META[status] ?? { label: status, variant: "muted" as const, Icon: AlertCircle };
  const Icon = meta.Icon;
  return (
    <Badge variant={meta.variant} className={className}>
      <Icon />
      {labelOverride ?? meta.label}
    </Badge>
  );
}
