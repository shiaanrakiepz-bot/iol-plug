"use client";

import * as React from "react";
import {
  Sparkles,
  Send,
  RefreshCw,
  Trash2,
  Bookmark,
  Wand2,
  Palette,
  LayoutTemplate,
  AudioLines,
  Lightbulb,
  Info,
  User,
} from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useBrandSelection } from "@/lib/hooks/use-brand-selection";
import { generate, PLATFORMS, TONES, OUTPUT_TYPES } from "@/lib/generator";
import { PageHeader } from "@/components/shared/page-header";
import { BrandSelect } from "@/components/shared/brand-select";
import { OutputSection } from "@/components/shared/output";
import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { uid } from "@/lib/utils";
import type { ChatMessage, GenerateResult, OutputType, Platform, Tone } from "@/types";

const toOptions = (arr: readonly string[]) => arr.map((v) => ({ label: v, value: v }));

const EXAMPLES = [
  "A back-to-school promo",
  "Match-day derby hype",
  "A premium weekend feature",
  "Breaking news alert",
  "Black Friday subscription offer",
];

function resultToText(r: GenerateResult): string {
  return [
    `${r.meta.brand} · ${r.meta.platform} · ${r.meta.tone} tone · ${r.meta.outputType}`,
    "",
    "RECOMMENDED HEADLINE",
    r.headline,
    "",
    "ALTERNATIVE HEADLINES",
    ...r.alternativeHeadlines.map((h) => `- ${h}`),
    "",
    "CAPTION",
    r.caption,
    "",
    "CTA OPTIONS",
    ...r.ctas.map((c) => `- ${c}`),
    "",
    "DESIGN DIRECTION",
    ...r.designDirection.map((d) => `- ${d}`),
    `Colour: ${r.colourUsage}`,
    `Layout: ${r.layoutSuggestion}`,
    "",
    "TONE NOTE",
    r.toneNote,
    "",
    "INTERN TIP",
    r.internTip,
  ].join("\n");
}

function AssistantCard({
  result,
  brandId,
  onSave,
}: {
  result: GenerateResult;
  brandId: string;
  onSave: () => void;
}) {
  const showSubjects =
    result.meta.outputType === "Subject line" ||
    result.meta.platform === "Newsletter" ||
    result.meta.platform === "Email campaign";
  const showIntro =
    result.meta.outputType === "Intro paragraph" || result.meta.platform === "Newsletter";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="default">{result.meta.brand}</Badge>
        <Badge variant="secondary">{result.meta.platform}</Badge>
        <Badge variant="secondary">{result.meta.tone}</Badge>
        <Badge variant="outline">{result.meta.outputType}</Badge>
      </div>

      {/* Recommended headline */}
      <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Recommended headline</p>
          <CopyButton value={result.headline} iconOnly variant="ghost" />
        </div>
        <p className="font-display text-xl font-semibold leading-tight">{result.headline}</p>
      </div>

      <OutputSection title="Alternative headlines" icon={Wand2} lines={result.alternativeHeadlines} />
      <OutputSection title="Short caption" icon={AudioLines} lines={[result.caption]} multiline />
      <OutputSection title="CTA options" icon={Send} lines={result.ctas} />

      {showSubjects ? (
        <OutputSection title="Subject lines" icon={Send} lines={result.subjectLines} />
      ) : null}
      {showIntro ? <OutputSection title="Intro paragraph" lines={[result.intro]} multiline /> : null}

      <OutputSection
        title="Design direction"
        icon={LayoutTemplate}
        lines={result.designDirection}
        description="How to lay it out for this platform."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Palette className="h-3.5 w-3.5" /> Colour usage
          </p>
          <p className="text-sm text-foreground/90">{result.colourUsage}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <AudioLines className="h-3.5 w-3.5" /> Tone note
          </p>
          <p className="text-sm text-foreground/90">{result.toneNote}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/5 p-4">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-warning">Intern tip</p>
          <p className="mt-0.5 text-sm text-foreground/90">{result.internTip}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CopyButton value={resultToText(result)} label="Copy output" />
        <Button size="sm" variant="secondary" onClick={onSave}>
          <Bookmark />
          Save output
        </Button>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const { brands, getBrand, saveOutput } = useHub();
  const { toast } = useToast();
  const [brandId, setBrandId] = useBrandSelection(
    brands.map((b) => b.id),
    brands[0]?.id ?? "",
  );
  const [platform, setPlatform] = React.useState<Platform>("Social media");
  const [tone, setTone] = React.useState<Tone>("Bold");
  const [outputType, setOutputType] = React.useState<OutputType>("Headline");
  const [topic, setTopic] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const seedRef = React.useRef(1);
  const lastRef = React.useRef<{ brandId: string; platform: Platform; tone: Tone; outputType: OutputType; topic: string } | null>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Prefill the brief from a ?topic= deep link (e.g. from the Prompt Library).
  React.useEffect(() => {
    try {
      const t = new URLSearchParams(window.location.search).get("topic");
      if (t) setTopic(t);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  function runGenerate(regenerate = false) {
    const req = regenerate ? lastRef.current : { brandId, platform, tone, outputType, topic };
    if (!req) return;
    const brand = getBrand(req.brandId);
    if (!brand) return;
    seedRef.current = regenerate ? seedRef.current + 1 : 1;
    const result = generate({
      brand,
      platform: req.platform,
      tone: req.tone,
      outputType: req.outputType,
      topic: req.topic,
      seed: seedRef.current,
    });
    lastRef.current = req;
    const aiMsg: ChatMessage = { id: uid("m"), role: "assistant", content: "", result, createdAt: Date.now() };
    if (regenerate) {
      setMessages((m) => [...m, aiMsg]);
    } else {
      const userMsg: ChatMessage = {
        id: uid("m"),
        role: "user",
        content: req.topic.trim() || `${req.outputType} for a ${req.platform.toLowerCase()}`,
        createdAt: Date.now(),
      };
      setMessages((m) => [...m, userMsg, aiMsg]);
    }
  }

  function handleSave(result: GenerateResult) {
    saveOutput({
      id: uid("out"),
      title: `${result.meta.brand} · ${result.meta.outputType}`,
      body: resultToText(result),
      brandId: brandId,
      meta: `${result.meta.platform} · ${result.meta.tone}`,
      createdAt: Date.now(),
    });
    toast({ title: "Saved to your outputs", description: "Find it later in the Prompt Library.", variant: "success" });
  }

  const currentBrand = getBrand(brandId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create"
        title="AI Campaign Assistant"
        icon={Sparkles}
        description="Generate on-brand headlines, captions, CTAs and design direction. Set the brand, platform, tone and output, describe what you're working on, and get polished options in seconds."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* Setup */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">Setup</h2>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Brand</Label>
                <BrandSelect value={brandId} onValueChange={setBrandId} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Platform</Label>
                <Select
                  className="mt-1"
                  value={platform}
                  onValueChange={(v) => setPlatform(v as Platform)}
                  options={toOptions(PLATFORMS)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Tone</Label>
                  <Select
                    className="mt-1"
                    value={tone}
                    onValueChange={(v) => setTone(v as Tone)}
                    options={toOptions(TONES)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Output</Label>
                  <Select
                    className="mt-1"
                    value={outputType}
                    onValueChange={(v) => setOutputType(v as OutputType)}
                    options={toOptions(OUTPUT_TYPES)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Notes */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">About this assistant</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• This version uses smart local template generation — no data leaves your browser.</li>
              <li>• A future version can connect to the Claude or OpenAI API for richer output.</li>
              <li>• It should eventually draw on official brand guides and approved company data.</li>
              <li>• Always check generated copy against the brand's do's and don'ts before publishing.</li>
            </ul>
          </div>
        </div>

        {/* Chat */}
        <div className="flex min-h-[60vh] flex-col">
          <div className="flex-1 space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">
                  {currentBrand ? `Ready to write for ${currentBrand.name}` : "Ready when you are"}
                </h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  Describe what you're working on below and I'll draft on-brand options. Try one of these to start:
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setTopic(ex)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="flex max-w-[80%] items-start gap-2.5">
                      <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                        {m.content}
                      </div>
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-border bg-card p-4 shadow-sm">
                      {m.result ? (
                        <AssistantCard result={m.result} brandId={brandId} onSave={() => handleSave(m.result!)} />
                      ) : null}
                    </div>
                  </div>
                ),
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="sticky bottom-0 mt-4 rounded-xl border border-border bg-background/90 p-3 shadow-sm backdrop-blur">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe what you are working on…"
              rows={2}
              className="resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  runGenerate(false);
                }
              }}
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={messages.length === 0}
                  onClick={() => {
                    setMessages([]);
                    lastRef.current = null;
                  }}
                >
                  <Trash2 />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!lastRef.current}
                  onClick={() => runGenerate(true)}
                >
                  <RefreshCw />
                  <span className="hidden sm:inline">Regenerate</span>
                </Button>
              </div>
              <Button size="sm" onClick={() => runGenerate(false)}>
                <Sparkles />
                Generate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
