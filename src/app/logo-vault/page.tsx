"use client";

import * as React from "react";
import Link from "next/link";
import { Images, Search, ShieldCheck, CircleDashed, CheckCircle2, Upload, ArrowRight } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { BrandAvatar } from "@/components/shared/brand-avatar";
import { LogoSlot } from "@/components/shared/logo-slot";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LogoType } from "@/types";

const TYPE_FILTERS: { label: string; value: LogoType }[] = [
  { label: "Primary", value: "primary" },
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
  { label: "Icon", value: "icon" },
  { label: "SVG", value: "svg" },
  { label: "PNG", value: "png" },
];

const LOGO_RULES = [
  "Keep original proportions — never stretch or distort.",
  "Don't recolour logos without official approval.",
  "Keep clear space around the logo at all times.",
  "White logos only on dark / high-contrast backgrounds.",
  "Black logos only on light backgrounds.",
  "No shadows, outlines or effects on the logo.",
];

export default function LogoVaultPage() {
  const { brands, hydrated, stats, getLogo, getLogoStatus } = useHub();
  const [query, setQuery] = React.useState("");
  const [types, setTypes] = React.useState<LogoType[]>([]);

  function toggleType(t: LogoType) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  const visibleBrands = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return brands.filter((b) => !q || b.name.toLowerCase().includes(q) || b.region.toLowerCase().includes(q));
  }, [brands, query]);

  const activeTypes = types.length ? types : (TYPE_FILTERS.map((t) => t.value) as LogoType[]);

  const missing = React.useMemo(
    () =>
      brands
        .map((b) => ({
          brand: b,
          count: b.logoAssets.filter((a) => !getLogo(b.id, a.type)).length,
        }))
        .filter((m) => m.count > 0)
        .sort((a, b) => b.count - a.count),
    [brands, getLogo],
  );

  const ready = React.useMemo(
    () =>
      brands.flatMap((b) =>
        b.logoAssets
          .filter((a) => getLogoStatus(b.id, a.type) === "approved")
          .map((a) => ({ brand: b, asset: a })),
      ),
    [brands, getLogoStatus],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Brand system"
        title="Logo Vault"
        icon={Images}
        description="Upload, preview and track every brand's logo assets. Previews save to this browser so you can mock up and review before official files arrive."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {hydrated ? (
          <>
            <StatCard icon={Images} label="Total slots" value={stats.totalSlots} hint="Across all brands" />
            <StatCard icon={Upload} label="Uploaded" value={stats.uploadedAssets} hint="Files added" />
            <StatCard
              icon={CheckCircle2}
              label="Approved"
              value={stats.approvedAssets}
              tone={stats.approvedAssets > 0 ? "success" : "default"}
              hint="Signed off for use"
            />
            <StatCard
              icon={CircleDashed}
              label="Still missing"
              value={stats.totalSlots - stats.uploadedAssets}
              tone="warning"
              hint="Awaiting upload"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
        )}
      </div>

      {/* Missing & Ready panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <CircleDashed className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold">Missing assets</h2>
          </div>
          {missing.length === 0 ? (
            <p className="text-sm text-muted-foreground">Every brand has at least one file uploaded. 🎉</p>
          ) : (
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {missing.map((m) => (
                <Link
                  key={m.brand.id}
                  href={`/brands/${m.brand.id}#logos`}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-accent/50"
                >
                  <BrandAvatar brand={m.brand} size={30} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{m.brand.name}</span>
                  <span className="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                    {m.count} needed
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <h2 className="text-sm font-semibold">Ready for use</h2>
          </div>
          {ready.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No approved assets yet"
              description="Upload a logo, then mark it as approved to see it listed here as ready to use."
              className="py-8"
            />
          ) : (
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {ready.map(({ brand, asset }) => (
                <div
                  key={`${brand.id}-${asset.type}`}
                  className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 px-2 py-1.5"
                >
                  <BrandAvatar brand={brand} size={30} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{brand.name}</span>
                  <span className="shrink-0 text-xs font-medium text-success">{asset.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logo rules */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Logo usage rules
        </p>
        <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {LOGO_RULES.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logos by brand name or region…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Type:</span>
          {TYPE_FILTERS.map((t) => {
            const active = types.includes(t.value);
            return (
              <button
                key={t.value}
                onClick={() => toggleType(t.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Per-brand slots */}
      {!hydrated ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : visibleBrands.length === 0 ? (
        <EmptyState icon={Search} title="No brands match your search" description="Try a different brand name." />
      ) : (
        <div className="space-y-5">
          {visibleBrands.map((b) => {
            const slots = b.logoAssets.filter((a) => activeTypes.includes(a.type));
            if (slots.length === 0) return null;
            return (
              <div key={b.id} className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BrandAvatar brand={b} size={40} />
                    <div>
                      <h3 className="font-semibold leading-tight">{b.name}</h3>
                      <p className="text-xs text-muted-foreground">{b.category}</p>
                    </div>
                  </div>
                  <Link
                    href={`/brands/${b.id}#logos`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Brand guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {slots.map((a) => (
                    <LogoSlot key={a.type} brand={b} type={a.type} label={a.label} description={a.description} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
