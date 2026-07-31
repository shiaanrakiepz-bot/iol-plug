"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { BrandAvatar } from "./brand-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

export function BrandCard({ brand, view = "grid" }: { brand: Brand; view?: "grid" | "list" }) {
  const { isFavorite, toggleFavorite, getLogo, getLogoStatus } = useHub();
  const fav = isFavorite(brand.id);

  const total = brand.logoAssets.length;
  let approved = 0;
  let uploaded = 0;
  for (const a of brand.logoAssets) {
    if (getLogoStatus(brand.id, a.type) === "approved") approved += 1;
    if (getLogo(brand.id, a.type)) uploaded += 1;
  }
  const assetsReady = total > 0 && approved === total;
  const assetVariant = assetsReady ? "success" : uploaded > 0 ? "warning" : "muted";
  const assetLabel = assetsReady
    ? "Assets approved"
    : uploaded > 0
      ? `${uploaded}/${total} uploaded`
      : "Awaiting logos";
  const paletteNeeds = brand.palette.some((c) => c.status === "needs-confirmation");

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
        view === "list" && "sm:flex-row sm:items-center sm:gap-6",
      )}
    >
      {/* hue accent */}
      <span
        className="pointer-events-none absolute inset-x-5 top-0 h-0.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: `hsl(${brand.uiHue} 60% 50%)` }}
      />

      <div className={cn("flex items-start gap-3", view === "list" && "sm:flex-1")}>
        <BrandAvatar brand={brand} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold leading-tight">{brand.name}</h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{brand.category}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(brand.id)}
              aria-label={fav ? "Remove from favourites" : "Add to favourites"}
              className="-mr-1 -mt-1 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Star className={cn("h-4 w-4", fav && "fill-warning text-warning")} />
            </button>
          </div>
          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{brand.region}</p>
          <p className="mt-1 line-clamp-1 text-[13px] text-foreground/80">{brand.tone}</p>
        </div>
      </div>

      <div className={cn("mt-4 flex flex-wrap gap-1.5", view === "list" && "sm:mt-0 sm:w-44 sm:flex-col sm:items-start")}>
        <Badge variant={assetVariant}>{assetLabel}</Badge>
        <Badge variant={paletteNeeds ? "warning" : "success"}>
          {paletteNeeds ? "Palette: confirm" : "Palette set"}
        </Badge>
      </div>

      <div className={cn("mt-4 flex gap-2", view === "list" && "sm:mt-0 sm:w-auto")}>
        <Link href={`/brands/${brand.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Open Brand Guide
            <ArrowRight />
          </Button>
        </Link>
        <Link href={`/assistant?brand=${brand.id}`}>
          <Button variant="secondary" size="sm" aria-label="Generate copy">
            <Sparkles />
            <span className="hidden sm:inline">Generate</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
