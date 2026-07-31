"use client";

import Link from "next/link";
import {
  Search,
  Library,
  CheckCircle2,
  Palette,
  Bookmark,
  Sparkles,
  Mails,
  Stethoscope,
  Images,
  AudioLines,
  ArrowRight,
  Megaphone,
  Lightbulb,
  Star,
  Clock,
} from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useCommandMenu } from "@/components/layout/app-shell";
import { StatCard } from "@/components/shared/stat-card";
import { BrandAvatar } from "@/components/shared/brand-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { Brand } from "@/types";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { title: "Find Brand Assets", desc: "Logos, status & rules", href: "/logo-vault", icon: Images, hue: 210 },
  { title: "Generate Headline", desc: "On-brand copy in seconds", href: "/assistant", icon: Sparkles, hue: 348 },
  { title: "Build Newsletter Copy", desc: "Subjects, intros & CTAs", href: "/newsletter", icon: Mails, hue: 150 },
  { title: "Check Brand Tone", desc: "Voice & personality", href: "/brands", icon: AudioLines, hue: 262 },
  { title: "Upload Logo", desc: "Add asset previews", href: "/logo-vault", icon: Images, hue: 24 },
  { title: "Review Design Idea", desc: "Get instant feedback", href: "/design-doctor", icon: Stethoscope, hue: 188 },
];

const INTERN_TIPS = [
  "Always check the brand first. Tone and personality should drive every design decision before you open the canvas.",
  "Anything marked “Needs official confirmation” must be verified with your manager before it goes into final artwork.",
  "Use white logos only on dark or high-contrast backgrounds, and black logos only on light ones.",
  "Read your headline out loud. If it trips you up, it's too long — cut words until it lands.",
  "One clear call-to-action beats five competing links. Tell the reader exactly what to do next.",
  "Preview social posts at thumbnail size. If the headline can't be read tiny, it won't work in the feed.",
  "Save prompts and outputs you like — future-you will thank present-you when the next brief lands.",
  "Match colour to meaning: primary to anchor, accent for one highlight, neutral for readable body text.",
];

function BrandMiniRow({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.id}`}
      className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-accent/50"
    >
      <BrandAvatar brand={brand} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{brand.name}</p>
        <p className="truncate text-xs text-muted-foreground">{brand.region}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

export default function DashboardPage() {
  const { hydrated, brands, stats, recent, favorites, savedPrompts, getBrand } = useHub();
  const { openCommand } = useCommandMenu();

  const recentBrands = recent.map(getBrand).filter(Boolean) as Brand[];
  const favoriteBrands = favorites.map(getBrand).filter(Boolean) as Brand[];
  const tip = INTERN_TIPS[Math.floor(Date.now() / 86400000) % INTERN_TIPS.length];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-9">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4] mask-fade-b" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Design command centre
          </span>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
            Independent Media Design Hub
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            Your central command centre for brand guides, logo assets, colour palettes, typography
            and AI-assisted campaign copy. Everything designers and interns need to produce on-brand
            work — faster, and with confidence.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={openCommand}
              className="group flex h-12 w-full max-w-md items-center gap-3 rounded-xl border border-input bg-background px-4 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent/40"
            >
              <Search className="h-[18px] w-[18px] shrink-0" />
              <span className="truncate">Search brands, logos, colours, campaign ideas…</span>
            </button>
            <div className="flex gap-2">
              <Link href="/assistant">
                <Button size="lg" className="h-12">
                  <Sparkles />
                  Ask the AI
                </Button>
              </Link>
              <Link href="/brands" className="hidden sm:block">
                <Button size="lg" variant="outline" className="h-12">
                  Browse brands
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {hydrated ? (
          <>
            <StatCard icon={Library} label="Total brands" value={stats.totalBrands} hint="Across print & digital" />
            <StatCard
              icon={CheckCircle2}
              label="Approved assets"
              value={`${stats.approvedAssets}/${stats.totalSlots}`}
              hint={stats.approvedAssets === 0 ? "Upload & approve logos" : "Logo slots approved"}
              tone={stats.approvedAssets > 0 ? "success" : "default"}
            />
            <StatCard
              icon={Palette}
              label="Palettes to confirm"
              value={stats.palettesNeedingConfirmation}
              hint="Awaiting official hex codes"
              tone={stats.palettesNeedingConfirmation > 0 ? "warning" : "success"}
            />
            <StatCard icon={Bookmark} label="Saved prompts" value={savedPrompts.length} hint="In your library" />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.title}
                href={a.href}
                className="group flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `hsl(${a.hue} 62% 50% / 0.14)`, color: `hsl(${a.hue} 55% 46%)` }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-tight">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Lower grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recently viewed + favourites */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Recently viewed</h2>
            </div>
            {!hydrated ? (
              <div className="space-y-2">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            ) : recentBrands.length > 0 ? (
              <div className="grid gap-1 sm:grid-cols-2">
                {recentBrands.slice(0, 6).map((b) => (
                  <BrandMiniRow key={b.id} brand={b} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Library}
                title="No brands viewed yet"
                description="Open a brand guide and it'll show up here for quick access."
                action={
                  <Link href="/brands">
                    <Button size="sm" variant="outline">
                      Browse the library
                    </Button>
                  </Link>
                }
              />
            )}
          </div>

          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-warning" />
              <h2 className="text-sm font-semibold">Favourite brands</h2>
            </div>
            {!hydrated ? (
              <Skeleton className="h-12 rounded-lg" />
            ) : favoriteBrands.length > 0 ? (
              <div className="grid gap-1 sm:grid-cols-2">
                {favoriteBrands.map((b) => (
                  <BrandMiniRow key={b.id} brand={b} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Star}
                title="No favourites yet"
                description="Tap the star on any brand to pin it here for one-click access."
              />
            )}
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Start a campaign */}
          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.04] p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Megaphone className="h-5 w-5" />
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold">Start a campaign</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Go from blank page to a polished campaign brief — name, headlines, CTA, social caption,
              colour and layout direction — in a guided flow.
            </p>
            <Link href="/campaign-builder" className="mt-4 block">
              <Button className="w-full">
                Open Campaign Builder
                <ArrowRight />
              </Button>
            </Link>
          </div>

          {/* Intern tip of the day */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <Lightbulb className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-semibold">Intern tip of the day</h2>
            </div>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground/90">{tip}</p>
            <Link
              href="/intern-mode"
              className={cn("mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline")}
            >
              More intern guidance
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
