"use client";

import * as React from "react";
import { Mails, Sparkles, RefreshCw, Bookmark } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useBrandSelection } from "@/lib/hooks/use-brand-selection";
import { generate } from "@/lib/generator";
import { PageHeader } from "@/components/shared/page-header";
import { BrandSelect } from "@/components/shared/brand-select";
import { OutputSection } from "@/components/shared/output";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { uid } from "@/lib/utils";
import type { Brand, ColorRole, GenerateResult, Tone } from "@/types";

const NEWSLETTER_TYPES = [
  "Breaking news",
  "Sport",
  "Lifestyle",
  "Politics",
  "Business",
  "Entertainment",
  "Weekend roundup",
];

const TYPE_TONE: Record<string, Tone> = {
  "Breaking news": "Urgent",
  Sport: "Sporty",
  Lifestyle: "Youthful",
  Politics: "Serious",
  Business: "Professional",
  Entertainment: "Bold",
  "Weekend roundup": "Editorial",
};

const EXAMPLES = [
  { brandId: "iol", type: "Breaking news", topic: "Load-shedding stage 6 announced" },
  { brandId: "iol-sport", type: "Sport", topic: "Weekend derby fixtures preview" },
  { brandId: "cape-times", type: "Politics", topic: "Budget speech analysis" },
  { brandId: "the-star", type: "Business", topic: "Markets and rand weekly wrap" },
];

function previewColors(brand: Brand) {
  const pick = (role: ColorRole, fallback: string) =>
    brand.palette.find((c) => c.role === role && c.hex)?.hex ?? fallback;
  return {
    header: pick("newsletter-header", `hsl(${brand.uiHue} 55% 42%)`),
    cta: pick("cta", `hsl(${brand.uiHue} 62% 45%)`),
    accent: pick("accent", `hsl(${brand.uiHue} 60% 48%)`),
  };
}

export default function NewsletterPage() {
  const { brands, getBrand, saveOutput } = useHub();
  const { toast } = useToast();
  const [brandId, setBrandId] = useBrandSelection(
    brands.map((b) => b.id),
    brands[0]?.id ?? "",
  );
  const [newsletterType, setNewsletterType] = React.useState("Breaking news");
  const [topic, setTopic] = React.useState("");
  const [result, setResult] = React.useState<GenerateResult | null>(null);
  const seedRef = React.useRef(1);

  function build(bId: string, nType: string, top: string, regen = false) {
    const brand = getBrand(bId);
    if (!brand) return;
    seedRef.current = regen ? seedRef.current + 1 : 1;
    const r = generate({
      brand,
      platform: "Newsletter",
      tone: TYPE_TONE[nType] ?? "Professional",
      outputType: "Full campaign copy",
      topic: top.trim() || `${nType} update`,
      seed: seedRef.current,
    });
    setResult(r);
  }

  const brand = getBrand(brandId) ?? brands[0];
  const colors = brand ? previewColors(brand) : { header: "#444", cta: "#444", accent: "#666" };

  const preview = result ? result.caption.split("\n")[0] : "";
  const footer = brand
    ? `© ${new Date().getFullYear()} ${brand.name}. You're receiving this because you subscribed. Update your preferences or unsubscribe anytime.`
    : "";

  const allText = result
    ? [
        `SUBJECT LINES`,
        ...result.subjectLines.map((s) => `- ${s}`),
        ``,
        `PREVIEW TEXT`,
        preview,
        ``,
        `INTRO`,
        result.intro,
        ``,
        `SECTION HEADINGS`,
        ...result.sectionHeadings.map((s) => `- ${s}`),
        ``,
        `CTA BUTTONS`,
        ...result.ctas.map((s) => `- ${s}`),
        ``,
        `FOOTER`,
        footer,
      ].join("\n")
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create"
        title="Newsletter Helper"
        icon={Mails}
        description="Draft a complete newsletter — subject lines, preview text, intro, section headings, CTAs and footer — then see it in a live preview before you build it."
      />

      {/* Controls */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end">
          <div>
            <Label className="text-xs">Brand</Label>
            <BrandSelect value={brandId} onValueChange={setBrandId} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Newsletter type</Label>
            <Select
              className="mt-1"
              value={newsletterType}
              onValueChange={setNewsletterType}
              options={NEWSLETTER_TYPES.map((t) => ({ label: t, value: t }))}
            />
          </div>
          <div>
            <Label className="text-xs">Lead story / topic (optional)</Label>
            <Input
              className="mt-1"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. New stadium opens in the city"
            />
          </div>
          <Button onClick={() => build(brandId, newsletterType, topic)}>
            <Sparkles />
            Generate
          </Button>
        </div>

        {/* Examples */}
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => {
              const b = getBrand(ex.brandId);
              if (!b) return null;
              return (
                <button
                  key={ex.brandId + ex.type}
                  onClick={() => {
                    setBrandId(ex.brandId);
                    setNewsletterType(ex.type);
                    setTopic(ex.topic);
                    build(ex.brandId, ex.type, ex.topic);
                  }}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {b.shortName} · {ex.type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!result ? (
        <EmptyState
          icon={Mails}
          title="Your newsletter copy will appear here"
          description="Pick a brand and newsletter type, add a lead story if you have one, and hit Generate."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Generated copy */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Generated copy
              </h2>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline" onClick={() => build(brandId, newsletterType, topic, true)}>
                  <RefreshCw />
                  Regenerate
                </Button>
              </div>
            </div>

            <OutputSection title="Subject lines" lines={result.subjectLines} />
            <OutputSection title="Preview text" lines={[preview]} multiline />
            <OutputSection title="Intro paragraph" lines={[result.intro]} multiline />
            <OutputSection title="Section headings" lines={result.sectionHeadings} />
            <OutputSection title="CTA buttons" lines={result.ctas} />
            <OutputSection title="Footer line" lines={[footer]} multiline />

            <div className="flex items-center gap-2">
              <CopyButton value={allText} label="Copy all text" />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  saveOutput({
                    id: uid("out"),
                    title: `${brand?.name} newsletter · ${newsletterType}`,
                    body: allText,
                    brandId,
                    meta: `Newsletter · ${newsletterType}`,
                    createdAt: Date.now(),
                  });
                  toast({ title: "Saved to your library", variant: "success" });
                }}
              >
                <Bookmark />
                Save to prompt library
              </Button>
            </div>
          </div>

          {/* Live preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Live preview
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <div className="px-5 py-4" style={{ background: colors.header }}>
                <p className="text-sm font-semibold text-white">{brand?.name}</p>
                <p className="text-xs text-white/80">{newsletterType} · Newsletter</p>
              </div>
              <div className="space-y-4 p-5 text-zinc-800">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Subject</p>
                  <p className="font-display text-lg font-bold leading-tight text-zinc-900">
                    {result.subjectLines[0]}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{preview}</p>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700">{result.intro}</p>
                <div className="space-y-2">
                  {result.sectionHeadings.map((h, i) => (
                    <div key={i} className="border-t border-zinc-100 pt-2">
                      <p className="text-sm font-semibold text-zinc-900">{h}</p>
                      <div className="mt-1.5 space-y-1">
                        <div className="h-1.5 w-full rounded bg-zinc-100" />
                        <div className="h-1.5 w-4/5 rounded bg-zinc-100" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-1">
                  <span
                    className="inline-block rounded-md px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: colors.cta }}
                  >
                    {result.ctas[0]}
                  </span>
                </div>
                <p className="border-t border-zinc-100 pt-3 text-[11px] leading-relaxed text-zinc-400">{footer}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
