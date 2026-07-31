"use client";

import Link from "next/link";
import { Sun, Moon, Info, Sparkles, Database, Rocket, Presentation, Check } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn-style UI",
  "lucide-react",
  "framer-motion",
];

const FEATURES = [
  "Searchable brand library for every Independent Media title",
  "Logo Vault with upload previews, status tracking and rules",
  "Editable colour palettes with copy-ready hex codes",
  "AI Campaign Assistant for on-brand headlines, captions and CTAs",
  "Newsletter Helper with a live email preview",
  "Design Doctor for instant, encouraging design feedback",
  "Campaign Builder for end-to-end campaign briefs",
  "Prompt Library you can extend and reuse",
];

const PRESENT_TIPS = [
  "Open with the brand and the goal — show you started from the brand guide.",
  "Use the Design Doctor's manager note as a talking-track for your rationale.",
  "Flag anything still marked “Needs official confirmation” up front.",
  "Show the work in context using the palette and newsletter previews.",
];

export default function AboutPage() {
  const { theme, setTheme, mounted } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System"
        title="Settings & About"
        icon={Info}
        description="Preferences, product information and a quick guide to presenting your work. Everything you create here is stored privately in your browser."
      />

      {/* Appearance */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Appearance</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors sm:flex-none sm:px-8",
              mounted && theme === "light"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-accent",
            )}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors sm:flex-none sm:px-8",
              mounted && theme === "dark"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-accent",
            )}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Independent Media Design Hub</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The central command centre for designers and interns.
            </p>
          </div>
          <Badge variant="secondary">v1.0</Badge>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/85">
          This internal tool brings brand guidance, logo assets, colour palettes, typography and AI-assisted copy
          into one place — so the team can produce on-brand work faster and with more confidence. It deliberately
          never invents official logos, colours or fonts: anything unverified is clearly marked{" "}
          <span className="font-medium text-warning">Needs official confirmation</span> so it can be confirmed before
          publishing.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {STACK.map((s) => (
            <Badge key={s} variant="outline" className="font-normal">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">What it does</h2>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Presenting */}
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Presentation className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Presenting to your manager</h2>
          </div>
          <ul className="space-y-2">
            {PRESENT_TIPS.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-foreground/85">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Roadmap */}
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">What's next</h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground/85">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Connect the AI Assistant to the Claude or OpenAI API for richer, smarter output.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Sync data to Supabase or Firebase so the whole team shares one source of truth.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Load official brand guides to replace every “Needs official confirmation”.
            </li>
          </ul>
        </div>
      </div>

      {/* Data */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Your data & privacy</h2>
        </div>
        <p className="text-sm leading-relaxed text-foreground/85">
          All your edits, uploads, favourites, saved prompts and outputs are stored locally in your browser via
          localStorage — nothing is sent to a server. You can export everything to a JSON file or reset to the demo
          data anytime from{" "}
          <Link href="/admin" className="font-medium text-primary hover:underline">
            Admin Mode
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
