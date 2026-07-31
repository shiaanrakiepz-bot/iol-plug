"use client";

import * as React from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";
import type { ColorStatus, ColorRole, ColorSwatch } from "@/types";

const ROLE_OPTIONS = [
  { label: "Primary background", value: "background" },
  { label: "Accent colour", value: "accent" },
  { label: "Text / ink", value: "text" },
  { label: "Call-to-action", value: "cta" },
  { label: "Newsletter header", value: "newsletter-header" },
  { label: "Support colour", value: "support" },
];

const STATUS_OPTIONS = [
  { label: "Approved", value: "approved" },
  { label: "Needs official confirmation", value: "needs-confirmation" },
  { label: "Needs review", value: "needs-review" },
];

const HATCH =
  "repeating-linear-gradient(45deg, hsl(var(--muted)) 0 7px, hsl(var(--muted-foreground) / 0.18) 7px 14px)";

export function ColorSwatchCard({
  brandId,
  swatch,
  editable = true,
}: {
  brandId: string;
  swatch: ColorSwatch;
  editable?: boolean;
}) {
  const { updateColor, removeColor } = useHub();
  const { toast } = useToast();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState<ColorSwatch>(swatch);

  React.useEffect(() => {
    setDraft(swatch);
  }, [swatch]);

  const hasHex = Boolean(swatch.hex);

  function save() {
    const hex = draft.hex?.trim() ? draft.hex.trim() : null;
    const status: ColorStatus = !hex ? "needs-confirmation" : draft.status;
    updateColor(brandId, swatch.id, { ...draft, hex, status });
    setEditing(false);
    toast({ title: `${draft.name || "Colour"} updated`, variant: "success" });
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-primary/30 bg-card p-4 shadow-sm ring-1 ring-primary/10">
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Colour name</Label>
            <Input
              className="mt-1"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Primary red"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs">Hex code</Label>
              <Input
                className="mt-1 font-mono"
                value={draft.hex ?? ""}
                onChange={(e) => setDraft({ ...draft, hex: e.target.value })}
                placeholder="#RRGGBB · blank = needs confirmation"
              />
            </div>
            <input
              type="color"
              aria-label="Pick colour"
              value={draft.hex && /^#[0-9a-fA-F]{6}$/.test(draft.hex) ? draft.hex : "#999999"}
              onChange={(e) => setDraft({ ...draft, hex: e.target.value.toUpperCase() })}
              className="h-10 w-12 cursor-pointer rounded-lg border border-input bg-background p-1"
            />
          </div>
          <div>
            <Label className="text-xs">Usage note</Label>
            <Input
              className="mt-1"
              value={draft.usage}
              onChange={(e) => setDraft({ ...draft, usage: e.target.value })}
              placeholder="Where this colour is used"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Role</Label>
              <Select
                className="mt-1"
                value={draft.role}
                onValueChange={(v) => setDraft({ ...draft, role: v as ColorRole })}
                options={ROLE_OPTIONS}
              />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select
                className="mt-1"
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as ColorStatus })}
                options={STATUS_OPTIONS}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => { setDraft(swatch); setEditing(false); }}>
            <X />
            Cancel
          </Button>
          <Button size="sm" onClick={save}>
            <Check />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div
        className="relative h-20 w-full"
        style={hasHex ? { backgroundColor: swatch.hex as string } : { backgroundImage: HATCH }}
      >
        {!hasHex ? (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted-foreground">
            Awaiting hex
          </span>
        ) : null}
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight">{swatch.name}</p>
          <StatusBadge status={swatch.status} />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          {hasHex ? (
            <>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{swatch.hex}</code>
              <CopyButton value={swatch.hex as string} iconOnly variant="ghost" toastLabel="Hex copied" />
            </>
          ) : (
            <span className="text-xs font-medium text-warning">Needs official confirmation</span>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{swatch.usage}</p>
        {editable ? (
          <div className="mt-3 flex items-center gap-1.5">
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil />
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Delete colour"
              onClick={() => {
                removeColor(brandId, swatch.id);
                toast({ title: `${swatch.name} removed` });
              }}
            >
              <Trash2 />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
