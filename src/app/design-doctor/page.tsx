"use client";

import * as React from "react";
import {
  Stethoscope,
  Sparkles,
  Check,
  AlertTriangle,
  Compass,
  Palette,
  Type,
  LayoutTemplate,
  ListOrdered,
  Eye,
  PenLine,
  Presentation,
} from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useBrandSelection } from "@/lib/hooks/use-brand-selection";
import { reviewDesign, PROJECT_TYPES, CONFIDENCE_LEVELS } from "@/lib/design-doctor";
import { PageHeader } from "@/components/shared/page-header";
import { BrandSelect } from "@/components/shared/brand-select";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Confidence, DesignReview } from "@/types";

function scoreLabel(score: number): string {
  if (score < 50) return "Just getting started";
  if (score < 65) return "Taking shape";
  if (score < 78) return "Coming together";
  if (score < 88) return "Almost there";
  return "Looking strong";
}

function Assessment({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="mb-1.5 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-foreground/85">{body}</p>
    </div>
  );
}

export default function DesignDoctorPage() {
  const { brands, getBrand } = useHub();
  const [brandId, setBrandId] = useBrandSelection(
    brands.map((b) => b.id),
    brands[0]?.id ?? "",
  );
  const [projectType, setProjectType] = React.useState(PROJECT_TYPES[0]);
  const [confidence, setConfidence] = React.useState<Confidence>("I have a rough layout");
  const [idea, setIdea] = React.useState("");
  const [review, setReview] = React.useState<DesignReview | null>(null);

  function handleReview() {
    const brand = getBrand(brandId);
    if (!brand) return;
    setReview(reviewDesign(brand, projectType, idea, confidence));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create"
        title="Design Doctor"
        icon={Stethoscope}
        description="Paste a rough design idea and get structured, encouraging feedback — brand fit, colour, type, layout, hierarchy and copy — plus next steps and a note for presenting to your manager."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* Input */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Brand</Label>
                <BrandSelect value={brandId} onValueChange={setBrandId} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Project type</Label>
                <Select
                  className="mt-1"
                  value={projectType}
                  onValueChange={setProjectType}
                  options={PROJECT_TYPES.map((t) => ({ label: t, value: t }))}
                />
              </div>
              <div>
                <Label className="text-xs">Your design idea</Label>
                <Textarea
                  className="mt-1"
                  rows={6}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your idea: the goal, the layout, colours, fonts, imagery and the main message…"
                />
              </div>
              <div>
                <Label className="text-xs">How far along are you?</Label>
                <Select
                  className="mt-1"
                  value={confidence}
                  onValueChange={(v) => setConfidence(v as Confidence)}
                  options={CONFIDENCE_LEVELS.map((c) => ({ label: c, value: c }))}
                />
              </div>
              <Button className="w-full" onClick={handleReview}>
                <Sparkles />
                Review My Idea
              </Button>
            </div>
          </div>
          <p className="px-1 text-xs text-muted-foreground">
            The Design Doctor is here to help you improve before you share — it's encouraging, not a grade.
          </p>
        </div>

        {/* Output */}
        <div>
          {!review ? (
            <EmptyState
              icon={Stethoscope}
              title="Your feedback will appear here"
              description="Fill in the details on the left and hit Review My Idea. The more you describe, the more useful the feedback."
              className="min-h-[400px]"
            />
          ) : (
            <div className="space-y-5">
              {/* Score */}
              <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Readiness
                    </p>
                    <p className="font-display text-2xl font-semibold">{scoreLabel(review.score)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-bold text-primary">{review.score}%</p>
                  </div>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${review.score}%` }}
                  />
                </div>
              </div>

              {/* Working / Improve */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-success/25 bg-success/5 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success">
                    <Check className="h-4 w-4" /> What's working
                  </p>
                  <ul className="space-y-2">
                    {review.working.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-warning">
                    <AlertTriangle className="h-4 w-4" /> What needs improvement
                  </p>
                  <ul className="space-y-2">
                    {review.improve.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed assessment */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Assessment icon={Compass} title="Brand fit" body={review.brandFit} />
                <Assessment icon={Palette} title="Colour usage" body={review.colourUsage} />
                <Assessment icon={Type} title="Typography" body={review.typography} />
                <Assessment icon={LayoutTemplate} title="Layout" body={review.layout} />
                <Assessment icon={Eye} title="Visual hierarchy" body={review.hierarchy} />
                <Assessment icon={PenLine} title="Copy strength" body={review.copyStrength} />
              </div>

              {/* Next steps */}
              <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ListOrdered className="h-4 w-4 text-primary" /> Suggested next steps
                </p>
                <ol className="space-y-2">
                  {review.nextSteps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Manager note */}
              <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <Presentation className="h-4 w-4" /> Presenting to your manager
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">{review.managerNote}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
