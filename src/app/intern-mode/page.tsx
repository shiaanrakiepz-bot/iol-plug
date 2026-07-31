"use client";

import Link from "next/link";
import {
  GraduationCap,
  Library,
  Palette,
  Images,
  Sparkles,
  Mails,
  Stethoscope,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Info,
  Check,
  ListChecks,
} from "lucide-react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HOW_TO = [
  {
    icon: Library,
    title: "Find a brand",
    href: "/brands",
    steps: ["Open the Brand Library", "Search or filter by region, type or tone", "Open the full brand guide"],
  },
  {
    icon: Palette,
    title: "Check the colours",
    href: "/palettes",
    steps: ["Open Colour Palettes", "Copy the hex you need", "Watch for “Needs official confirmation”"],
  },
  {
    icon: Images,
    title: "Upload a logo",
    href: "/logo-vault",
    steps: ["Open the Logo Vault", "Upload into the right slot", "Mark it approved when signed off"],
  },
  {
    icon: Sparkles,
    title: "Use the AI Assistant",
    href: "/assistant",
    steps: ["Set brand, platform & tone", "Describe what you're working on", "Generate, then copy or save"],
  },
  {
    icon: Mails,
    title: "Write newsletter copy",
    href: "/newsletter",
    steps: ["Pick a brand & newsletter type", "Add your lead story", "Generate and check the live preview"],
  },
  {
    icon: Stethoscope,
    title: "Check a design idea",
    href: "/design-doctor",
    steps: ["Open the Design Doctor", "Paste your idea", "Review the feedback before sharing"],
  },
];

const MISTAKES = [
  "Treating placeholder or unconfirmed colours as if they're official.",
  "Stretching, squashing or recolouring a logo.",
  "Low-contrast text that's hard to read on a phone.",
  "Using the wrong tone for the brand (check the brand guide!).",
  "Cluttered layouts with no clear single call-to-action.",
  "Publishing before getting manager approval.",
];

const APPROVAL = [
  "Final artwork before it's published anywhere external.",
  "Any change to a logo (colour, size, lockup).",
  "New or changed brand colours and fonts.",
  "Anything still marked “Needs official confirmation”.",
  "Campaigns going out under a brand's name.",
];

const CHECKLIST = [
  "Check the brand first",
  "Use approved logos only",
  "Check the colour palette",
  "Match the tone of voice",
  "Keep copy clear",
  "Test readability",
  "Ask for approval before publishing",
  "Save useful prompts",
];

export default function InternModePage() {
  const [checked, setChecked] = useLocalStorage<boolean[]>(
    "imdh:intern-checklist:v1",
    CHECKLIST.map(() => false),
  );

  const completed = checked.filter(Boolean).length;

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resources"
        title="Intern Mode"
        icon={GraduationCap}
        description="New to the Design Hub? Start here. This is a friendly, practical guide to finding brands, checking colours, uploading logos, using the AI tools and getting work ready for your manager."
      />

      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-50 mask-fade-b" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-xl font-semibold">Welcome to the team 👋</h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/85">
            The Design Hub is your one-stop shop for everything brand-related at Independent Media. Instead of
            hunting through folders and asking around, you can find brand guides, grab the right colours, upload
            logo previews, and generate on-brand copy — all in one place. Take a few minutes to explore, and use the
            checklist at the bottom every time you start a new piece of work.
          </p>
        </div>
      </div>

      {/* How it works */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          How to get things done
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_TO.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="flex flex-col rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="font-semibold">{h.title}</h3>
                </div>
                <ol className="mt-3 flex-1 space-y-1.5">
                  {h.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <Link href={h.href} className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Open
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mistakes + approval */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h2 className="text-sm font-semibold">Common mistakes to avoid</h2>
          </div>
          <ul className="space-y-2">
            {MISTAKES.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">What needs manager approval</h2>
          </div>
          <ul className="space-y-2">
            {APPROVAL.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Needs confirmation explainer */}
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
          <Info className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">What “Needs official confirmation” means</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
            You'll see this label on some colours, fonts and logo slots. It means we haven't yet verified the exact
            official value from the brand guide — so we've deliberately <span className="font-medium">not guessed</span>.
            You can still design and mock things up, but treat those values as placeholders: always confirm them with
            your manager (or the official brand guide) before anything goes to final artwork or gets published.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <section className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Intern checklist</h2>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {completed}/{CHECKLIST.length} done
          </span>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(completed / CHECKLIST.length) * 100}%` }}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHECKLIST.map((item, i) => (
            <button
              key={item}
              onClick={() => toggle(i)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                checked[i]
                  ? "border-success/30 bg-success/5"
                  : "border-border bg-background hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                  checked[i] ? "border-success bg-success text-success-foreground" : "border-border",
                )}
              >
                {checked[i] ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span className={cn("font-medium", checked[i] && "text-muted-foreground line-through")}>{item}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
