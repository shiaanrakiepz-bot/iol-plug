"use client";

import * as React from "react";
import Link from "next/link";
import { Palette, Plus, ArrowRight, Info, LayoutTemplate } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useBrandSelection } from "@/lib/hooks/use-brand-selection";
import { PageHeader } from "@/components/shared/page-header";
import { BrandSelect } from "@/components/shared/brand-select";
import { BrandAvatar } from "@/components/shared/brand-avatar";
import { ColorSwatchCard } from "@/components/shared/color-swatch";
import { Button } from "@/components/ui/button";
import { uid } from "@/lib/utils";
import type { Brand, ColorRole } from "@/types";

const USAGE_GUIDE: { role: ColorRole; label: string; note: string }[] = [
  { role: "background", label: "Primary brand background", note: "Anchors large surfaces and the masthead." },
  { role: "accent", label: "Accent colour", note: "Highlights, links, tags and small emphasis." },
  { role: "text", label: "Text colour", note: "Headlines and body — keep it high-contrast." },
  { role: "cta", label: "CTA colour", note: "Buttons and conversion moments only." },
  { role: "newsletter-header", label: "Newsletter header", note: "Email header band and dividers." },
];

function resolver(brand: Brand) {
  const pick = (role: ColorRole, fallback: string) =>
    brand.palette.find((c) => c.role === role && c.hex)?.hex ?? fallback;
  return {
    bg: pick("background", `hsl(${brand.uiHue} 30% 97%)`),
    accent: pick("accent", `hsl(${brand.uiHue} 60% 48%)`),
    text: pick("text", "#1b1b20"),
    cta: pick("cta", `hsl(${brand.uiHue} 62% 45%)`),
    header: pick("newsletter-header", `hsl(${brand.uiHue} 55% 42%)`),
  };
}

function PreviewFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

export default function PalettesPage() {
  const { brands, addColor } = useHub();
  const [brandId, setBrandId] = useBrandSelection(
    brands.map((b) => b.id),
    brands[0]?.id ?? "",
  );
  const brand = brands.find((b) => b.id === brandId) ?? brands[0];

  if (!brand) return null;
  const c = resolver(brand);
  const roleColor = (role: ColorRole) =>
    role === "newsletter-header"
      ? c.header
      : role === "background"
        ? c.bg
        : role === "text"
          ? c.text
          : role === "cta"
            ? c.cta
            : c.accent;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Brand system"
        title="Colour Palette Manager"
        icon={Palette}
        description="Manage colour swatches across every brand. Add, edit and copy colours, set usage roles, and preview how a palette plays out across formats."
      />

      {/* Brand selector */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BrandAvatar brand={brand} size={44} />
          <div>
            <p className="text-xs text-muted-foreground">Editing palette for</p>
            <p className="font-semibold leading-tight">{brand.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BrandSelect value={brandId} onValueChange={setBrandId} className="w-full sm:w-60" />
          <Link href={`/brands/${brand.id}#palette`}>
            <Button variant="outline" size="icon" aria-label="Open brand guide">
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>

      {/* Swatches */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Swatches ({brand.palette.length})
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              addColor(brand.id, {
                id: uid("color"),
                name: "New colour",
                hex: null,
                usage: "Describe where this colour is used",
                role: "support",
                status: "needs-confirmation",
              })
            }
          >
            <Plus />
            Add colour
          </Button>
        </div>
        {brand.palette.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            No colours yet. Add the first swatch to start building this palette.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brand.palette.map((swatch) => (
              <ColorSwatchCard key={swatch.id} brandId={brand.id} swatch={swatch} />
            ))}
          </div>
        )}
      </section>

      {/* Previews */}
      <section className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Palette previews</h2>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Illustrative only — previews use placeholder colours derived for the Hub until official hex values are
          confirmed.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PreviewFrame title="Poster">
            <div className="overflow-hidden rounded-xl border border-border" style={{ background: c.bg }}>
              <div className="h-1.5" style={{ background: c.accent }} />
              <div className="p-4" style={{ color: c.text }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: c.accent }}>
                  Poster
                </p>
                <p className="mt-2 font-display text-lg font-bold leading-tight">Your headline here</p>
                <p className="mt-1.5 text-[11px] opacity-70">A supporting line for the campaign.</p>
                <span
                  className="mt-3 inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ background: c.cta }}
                >
                  Find out more
                </span>
              </div>
            </div>
          </PreviewFrame>

          <PreviewFrame title="Newsletter">
            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <div className="px-3 py-2.5" style={{ background: c.header }}>
                <p className="text-[11px] font-semibold text-white">Newsletter header</p>
              </div>
              <div className="space-y-2 p-3">
                <div className="h-2 w-2/3 rounded bg-zinc-200" />
                <div className="h-2 w-full rounded bg-zinc-100" />
                <div className="h-2 w-5/6 rounded bg-zinc-100" />
                <span
                  className="mt-2 inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ background: c.cta }}
                >
                  Read more
                </span>
              </div>
            </div>
          </PreviewFrame>

          <PreviewFrame title="Social post">
            <div
              className="flex aspect-square flex-col justify-between overflow-hidden rounded-xl border border-border p-3 text-white"
              style={{ background: c.accent }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">Social</p>
              <p className="font-display text-base font-bold leading-tight">A bold caption that reads at a glance.</p>
              <div className="flex items-center justify-between text-[10px] opacity-80">
                <span>@{brand.shortName.replace(/\s+/g, "").toLowerCase()}</span>
                <span>#Campaign</span>
              </div>
            </div>
          </PreviewFrame>

          <PreviewFrame title="Web banner">
            <div
              className="flex h-full min-h-[140px] flex-col justify-center gap-3 overflow-hidden rounded-xl border border-border p-4"
              style={{ background: c.bg, color: c.text }}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: c.accent }}>
                  Web banner
                </p>
                <p className="mt-1 font-display text-base font-bold leading-tight">Catch the headline here</p>
              </div>
              <span
                className="inline-block w-fit rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{ background: c.cta }}
              >
                Read now
              </span>
            </div>
          </PreviewFrame>
        </div>
      </section>

      {/* Usage guide + contrast */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Suggested usage roles</h2>
          <ul className="space-y-2">
            {USAGE_GUIDE.map((u) => (
              <li key={u.role} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background px-3 py-2">
                <span
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-full ring-1 ring-border"
                  style={{ background: roleColor(u.role) }}
                />
                <div>
                  <p className="text-sm font-medium">{u.label}</p>
                  <p className="text-xs text-muted-foreground">{u.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold">Accessibility & contrast</h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
              Body text needs at least 4.5:1 contrast against its background (3:1 for large text).
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
              Never rely on colour alone to carry meaning — pair it with text or icons.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
              Test CTAs in both light and dark contexts before sign-off.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
              Confirm any swatch marked <span className="font-medium text-warning">Needs official confirmation</span>{" "}
              before final artwork.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
