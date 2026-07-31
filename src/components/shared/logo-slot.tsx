"use client";

import * as React from "react";
import { Upload, Check, Clock, Trash2, ImageOff } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { Brand, LogoType } from "@/types";

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downscale(dataUrl: string, max: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function fileToStorableUrl(file: File): Promise<string> {
  // Keep SVGs as vectors; downscale raster images to keep localStorage small.
  if (file.type === "image/svg+xml") return readAsDataURL(file);
  const raw = await readAsDataURL(file);
  try {
    return await downscale(raw, 512);
  } catch {
    return raw;
  }
}

export function LogoSlot({
  brand,
  type,
  label,
  description,
}: {
  brand: Brand;
  type: LogoType;
  label: string;
  description: string;
}) {
  const { getLogo, setLogo, removeLogo, getLogoStatus, setLogoStatus } = useHub();
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);

  const logo = getLogo(brand.id, type);
  const status = getLogoStatus(brand.id, type);
  const previewOnDark = type === "white";

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToStorableUrl(file);
      setLogo(brand.id, type, url);
      toast({
        title: `${label} uploaded`,
        description: "Saved to this browser · marked Needs review",
        variant: "success",
      });
    } catch {
      toast({ title: "Couldn't read that file", variant: "error" });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border/70 bg-card p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-tight">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div
        className={cn(
          "mt-3 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border",
          previewOnDark ? "bg-zinc-900" : "bg-muted/40",
        )}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={`${brand.name} ${label}`} className="max-h-full max-w-full object-contain p-2" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImageOff className="h-5 w-5" />
            <span className="text-xs">No file yet</span>
          </span>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*,.svg" className="hidden" onChange={onFile} />

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
          <Upload />
          {logo ? "Replace" : "Upload"}
        </Button>
        {logo && status !== "approved" ? (
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              setLogoStatus(brand.id, type, "approved");
              toast({ title: `${label} approved`, variant: "success" });
            }}
          >
            <Check />
            Approve
          </Button>
        ) : null}
        {logo && status === "approved" ? (
          <Button size="sm" variant="outline" onClick={() => setLogoStatus(brand.id, type, "needs-review")}>
            <Clock />
            Mark review
          </Button>
        ) : null}
        {logo ? (
          <Button
            size="sm"
            variant="ghost"
            aria-label="Remove logo"
            onClick={() => {
              removeLogo(brand.id, type);
              toast({ title: `${label} removed` });
            }}
          >
            <Trash2 />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
