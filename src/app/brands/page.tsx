"use client";

import * as React from "react";
import { Library, Search, LayoutGrid, Rows3, X, Star } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { PageHeader } from "@/components/shared/page-header";
import { BrandCard } from "@/components/shared/brand-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FILTER_TAGS } from "@/data/brands";
import { cn } from "@/lib/utils";

export default function BrandLibraryPage() {
  const { brands, hydrated, favorites } = useHub();
  const [query, setQuery] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [favOnly, setFavOnly] = React.useState(false);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return brands.filter((b) => {
      if (favOnly && !favorites.includes(b.id)) return false;
      if (tags.length && !tags.some((t) => b.tags.includes(t))) return false;
      if (!q) return true;
      const haystack = [b.name, b.region, b.category, b.tone, b.audience, b.description, b.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [brands, query, tags, favOnly, favorites]);

  const hasFilters = query || tags.length > 0 || favOnly;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Brand system"
        title="Brand Library"
        icon={Library}
        description="Every Independent Media title in one place. Search by name, region, type or tone, then open a full brand guide or jump straight to generating copy."
      />

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands by name, region, type or tone…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={favOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setFavOnly((v) => !v)}
          >
            <Star className={cn("h-4 w-4", favOnly && "fill-current")} />
            Favourites
          </Button>
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                view === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                view === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Rows3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_TAGS.map((tag) => {
          const active = tags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {tag}
            </button>
          );
        })}
        {hasFilters ? (
          <button
            onClick={() => {
              setQuery("");
              setTags([]);
              setFavOnly(false);
            }}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      {/* Result count */}
      {hydrated ? (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
          {brands.length} brands
        </p>
      ) : null}

      {/* Results */}
      {!hydrated ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No brands match your filters"
          description="Try a different search term or clear the filters to see the full library."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setTags([]);
                setFavOnly(false);
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-3",
          )}
        >
          {filtered.map((b) => (
            <BrandCard key={b.id} brand={b} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}
