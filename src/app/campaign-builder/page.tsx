"use client";

import * as React from "react";
import {
  Megaphone,
  Check,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Pencil,
  Bookmark,
} from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useBrandSelection } from "@/lib/hooks/use-brand-selection";
import { generate, PLATFORMS, TONES } from "@/lib/generator";
import { PageHeader } from "@/components/shared/page-header";
import { BrandSelect } from "@/components/shared/brand-select";
import { BrandAvatar } from "@/components/shared/brand-avatar";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn, uid } from "@/lib/utils";
import type { GenerateResult, Platform, Tone } from "@/types";

const CAMPAIGN_TYPES = [
  "Product launch",
  "Promotion / sale",
  "Brand awareness",
  "Event",
  "Subscription drive",
  "Seasonal",
  "Announcement",
];

const STEPS = ["Brand", "Platform", "Campaign type", "Tone", "Brief"];

function OptionGrid({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  columns?: number;
}) {
  return (
    <div className={cn("grid gap-2", columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground/80 hover:border-primary/40",
            )}
          >
            <span>{o}</span>
            {active ? <Check className="h-4 w-4 shrink-0" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function BriefField({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3.5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <CopyButton value={value} iconOnly variant="ghost" />
      </div>
      <p className={cn("text-sm text-foreground/90", multiline && "leading-relaxed")}>{value}</p>
    </div>
  );
}

export default function CampaignBuilderPage() {
  const { brands, getBrand, saveOutput } = useHub();
  const { toast } = useToast();
  const [step, setStep] = React.useState(0);
  const [brandId, setBrandId] = useBrandSelection(
    brands.map((b) => b.id),
    brands[0]?.id ?? "",
  );
  const [platform, setPlatform] = React.useState<Platform>("Poster");
  const [campaignType, setCampaignType] = React.useState(CAMPAIGN_TYPES[0]);
  const [tone, setTone] = React.useState<Tone>("Bold");
  const [description, setDescription] = React.useState("");
  const [brief, setBrief] = React.useState<GenerateResult | null>(null);
  const seedRef = React.useRef(1);

  const brand = getBrand(brandId);

  function buildBrief(regen = false) {
    if (!brand) return;
    seedRef.current = regen ? seedRef.current + 1 : 1;
    const result = generate({
      brand,
      platform,
      tone,
      outputType: "Full campaign copy",
      topic: description.trim() || `${campaignType} campaign`,
      seed: seedRef.current,
    });
    setBrief(result);
  }

  function briefText(b: GenerateResult): string {
    return [
      `CAMPAIGN BRIEF — ${b.meta.brand}`,
      `${b.meta.platform} · ${campaignType} · ${b.meta.tone} tone`,
      "",
      `Campaign name: ${b.campaignName}`,
      `Main headline: ${b.headline}`,
      `Supporting headline: ${b.supportingHeadline}`,
      `CTA: ${b.ctas[0]}`,
      `Social caption: ${b.caption}`,
      `Newsletter subject line: ${b.subjectLines[0]}`,
      "",
      `Design direction: ${b.designDirection.join("; ")}`,
      `Colour usage: ${b.colourUsage}`,
      `Layout: ${b.layoutSuggestion}`,
    ].join("\n");
  }

  // ---- Brief view ----------------------------------------------------------
  if (brief && brand) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Create"
          title="Campaign Builder"
          icon={Megaphone}
          actions={
            <>
              <Button variant="outline" onClick={() => buildBrief(true)}>
                <RefreshCw />
                Regenerate
              </Button>
              <Button variant="secondary" onClick={() => setBrief(null)}>
                <Pencil />
                Edit inputs
              </Button>
            </>
          }
        />

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div
            className="relative p-6 sm:p-8"
            style={{ background: `linear-gradient(135deg, hsl(${brand.uiHue} 55% 50% / 0.12), transparent 70%)` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <BrandAvatar brand={brand} size={56} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Campaign brief
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">{brief.campaignName}</h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="default">{brand.name}</Badge>
                    <Badge variant="secondary">{platform}</Badge>
                    <Badge variant="secondary">{campaignType}</Badge>
                    <Badge variant="outline">{tone}</Badge>
                  </div>
                </div>
              </div>
              <CopyButton value={briefText(brief)} label="Copy full brief" />
            </div>
          </div>

          <div className="space-y-3 p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <BriefField label="Campaign name" value={brief.campaignName} />
              <BriefField label="Main headline" value={brief.headline} />
              <BriefField label="Supporting headline" value={brief.supportingHeadline} />
              <BriefField label="Call-to-action" value={brief.ctas[0]} />
              <BriefField label="Newsletter subject line" value={brief.subjectLines[0]} />
              <BriefField label="Social caption" value={brief.caption} multiline />
            </div>
            <BriefField label="Design direction" value={brief.designDirection.join(" · ")} multiline />
            <div className="grid gap-3 sm:grid-cols-2">
              <BriefField label="Colour usage recommendation" value={brief.colourUsage} multiline />
              <BriefField label="Layout suggestion" value={brief.layoutSuggestion} multiline />
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <CopyButton value={briefText(brief)} label="Copy full brief" />
              <Button
                variant="secondary"
                onClick={() => {
                  saveOutput({
                    id: uid("out"),
                    title: `${brief.campaignName} · ${brand.name}`,
                    body: briefText(brief),
                    brandId,
                    meta: `${platform} · ${campaignType}`,
                    createdAt: Date.now(),
                  });
                  toast({ title: "Campaign brief saved", variant: "success" });
                }}
              >
                <Bookmark />
                Save brief
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Wizard view ---------------------------------------------------------
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create"
        title="Campaign Builder"
        icon={Megaphone}
        description="A guided flow from blank page to a polished campaign brief. Work through five quick steps and generate everything you need to start designing."
      />

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-2">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <button
              onClick={() => setStep(i)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                i === step ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  i < step
                    ? "bg-success text-success-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 ? <span className="h-px w-3 shrink-0 bg-border" /> : null}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[280px] rounded-xl border border-border/70 bg-card p-6 shadow-sm">
        {step === 0 ? (
          <div>
            <h2 className="font-semibold">Choose a brand</h2>
            <p className="mt-1 text-sm text-muted-foreground">Which title is this campaign for?</p>
            <div className="mt-4 flex items-center gap-4">
              {brand ? <BrandAvatar brand={brand} size={52} /> : null}
              <BrandSelect value={brandId} onValueChange={setBrandId} className="w-full max-w-sm" />
            </div>
            {brand ? (
              <div className="mt-4 rounded-lg border border-border/60 bg-background p-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{brand.name}</span> — {brand.tone}.{" "}
                {brand.audience}
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h2 className="font-semibold">Choose a platform</h2>
            <p className="mt-1 text-sm text-muted-foreground">Where will this campaign run?</p>
            <div className="mt-4">
              <OptionGrid options={PLATFORMS} value={platform} onChange={(v) => setPlatform(v as Platform)} />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="font-semibold">Choose a campaign type</h2>
            <p className="mt-1 text-sm text-muted-foreground">What kind of campaign is this?</p>
            <div className="mt-4">
              <OptionGrid options={CAMPAIGN_TYPES} value={campaignType} onChange={setCampaignType} />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h2 className="font-semibold">Choose a tone</h2>
            <p className="mt-1 text-sm text-muted-foreground">How should it feel?</p>
            <div className="mt-4">
              <OptionGrid options={TONES} value={tone} onChange={(v) => setTone(v as Tone)} columns={4} />
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <h2 className="font-semibold">Add a project description</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us what the campaign is about — the more detail, the better the brief.
            </p>
            <Textarea
              className="mt-4"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A two-week subscription drive offering 50% off the first three months, aimed at lapsed digital readers."
            />
            <div className="mt-3 rounded-lg border border-border/60 bg-background p-3 text-sm text-muted-foreground">
              Summary: <span className="font-medium text-foreground">{brand?.name}</span> · {platform} ·{" "}
              {campaignType} · {tone} tone
            </div>
          </div>
        ) : null}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          <ArrowLeft />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
            Next
            <ArrowRight />
          </Button>
        ) : (
          <Button onClick={() => buildBrief(false)}>
            <Sparkles />
            Generate campaign brief
          </Button>
        )}
      </div>
    </div>
  );
}
