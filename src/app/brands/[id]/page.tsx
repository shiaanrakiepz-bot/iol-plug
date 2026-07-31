"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Star,
  ArrowLeft,
  Users,
  AudioLines,
  Wand2,
  Compass,
  Images,
  Palette,
  Type,
  Megaphone,
  MessageSquareQuote,
  ShieldCheck,
  StickyNote,
  Check,
  X,
  Plus,
  Info,
  Mail,
  Hash,
} from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { BrandAvatar } from "@/components/shared/brand-avatar";
import { LogoSlot } from "@/components/shared/logo-slot";
import { ColorSwatchCard } from "@/components/shared/color-swatch";
import { NeedsConfirmation } from "@/components/shared/needs-confirmation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, uid } from "@/lib/utils";
import { NEEDS_CONFIRMATION, type Brand, type LogoType } from "@/types";

const SECTION_NAV = [
  { id: "overview", label: "Overview" },
  { id: "audience", label: "Audience" },
  { id: "voice", label: "Tone & voice" },
  { id: "direction", label: "Design direction" },
  { id: "logos", label: "Logos" },
  { id: "palette", label: "Palette" },
  { id: "typography", label: "Typography" },
  { id: "campaigns", label: "Campaigns" },
  { id: "copy", label: "Copy examples" },
  { id: "rules", label: "Do's & don'ts" },
  { id: "approval", label: "Approval" },
  { id: "notes", label: "Notes" },
];

const LOGO_RULES = [
  "Do not stretch, squash or distort logos — keep original proportions.",
  "Do not recolour logos without official approval.",
  "Keep clear space around the logo equal to at least the height of its mark.",
  "Use white logos only on dark or high-contrast backgrounds.",
  "Use black logos only on light backgrounds.",
  "Never add shadows, outlines or effects to the logo.",
];

function Section({
  id,
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="font-semibold leading-tight">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function PillList({ items, icon: Icon }: { items: string[]; icon?: React.ElementType }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
          {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : null}
          <span className="text-foreground/90">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TypographyEditor({ brand }: { brand: Brand }) {
  const { updateTypography } = useHub();
  const { toast } = useToast();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(brand.typography);

  React.useEffect(() => setDraft(brand.typography), [brand.typography]);

  const rows: { key: "heading" | "body" | "digital"; label: string }[] = [
    { key: "heading", label: "Primary heading font" },
    { key: "body", label: "Body font" },
    { key: "digital", label: "Digital / social font" },
  ];

  if (editing) {
    return (
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.key}>
            <Label className="text-xs">{r.label}</Label>
            <Input
              className="mt-1"
              value={draft[r.key]}
              onChange={(e) => setDraft({ ...draft, [r.key]: e.target.value })}
              placeholder={NEEDS_CONFIRMATION}
            />
          </div>
        ))}
        <div>
          <Label className="text-xs">Notes</Label>
          <Textarea
            className="mt-1"
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">Status</Label>
          <Select
            className="mt-1 max-w-xs"
            value={draft.status}
            onValueChange={(v) => setDraft({ ...draft, status: v as Brand["typography"]["status"] })}
            options={[
              { label: "Confirmed", value: "confirmed" },
              { label: "Needs official confirmation", value: "needs-confirmation" },
            ]}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => { setDraft(brand.typography); setEditing(false); }}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              updateTypography(brand.id, draft);
              setEditing(false);
              toast({ title: "Typography updated", variant: "success" });
            }}
          >
            <Check />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {rows.map((r) => {
          const unknown = brand.typography[r.key] === NEEDS_CONFIRMATION;
          return (
            <div key={r.key} className="rounded-lg border border-border/60 bg-background p-3">
              <p className="text-xs text-muted-foreground">{r.label}</p>
              {unknown ? (
                <div className="mt-1.5">
                  <NeedsConfirmation compact />
                </div>
              ) : (
                <p className="mt-1 font-display text-base font-medium">{brand.typography[r.key]}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
        {brand.typography.notes}
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={brand.typography.status} />
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          <Type />
          Edit typography
        </Button>
      </div>
    </div>
  );
}

function NotesPanel({ brand }: { brand: Brand }) {
  const { updateBrand } = useHub();
  const { toast } = useToast();
  const [draft, setDraft] = React.useState(brand.notes);
  React.useEffect(() => setDraft(brand.notes), [brand.notes]);
  const dirty = draft !== brand.notes;

  return (
    <div className="space-y-3">
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        placeholder="Add internal notes, reminders or context for this brand…"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!dirty}
          onClick={() => {
            updateBrand(brand.id, { notes: draft });
            toast({ title: "Notes saved", variant: "success" });
          }}
        >
          Save notes
        </Button>
      </div>
    </div>
  );
}

function ChecklistRow({ ok, label, hint }: { ok: boolean; label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2.5">
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          ok ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
        )}
      >
        {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}

export default function BrandDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { brands, getBrand, isFavorite, toggleFavorite, addRecent, addColor, getLogo, getLogoStatus } =
    useHub();
  const brand = getBrand(id);

  React.useEffect(() => {
    if (brands.some((b) => b.id === id)) addRecent(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, brands.length]);

  const [manual, setManual] = React.useState({ tone: false, proofed: false });

  if (!brand) {
    return (
      <EmptyState
        icon={Info}
        title="Brand not found"
        description="We couldn't find that brand. It may have been removed or renamed."
        action={
          <Link href="/brands">
            <Button variant="outline" size="sm">
              <ArrowLeft />
              Back to Brand Library
            </Button>
          </Link>
        }
      />
    );
  }

  const fav = isFavorite(brand.id);
  const logoTypes: { type: LogoType; label: string; description: string }[] = brand.logoAssets.map((a) => ({
    type: a.type,
    label: a.label,
    description: a.description,
  }));

  const logosApproved = brand.logoAssets.every((a) => getLogoStatus(brand.id, a.type) === "approved");
  const anyLogo = brand.logoAssets.some((a) => getLogo(brand.id, a.type));
  const paletteConfirmed = !brand.palette.some((c) => c.status === "needs-confirmation");
  const typographyConfirmed = brand.typography.status === "confirmed";

  return (
    <div className="space-y-6">
      <Link
        href="/brands"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Brand Library
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ background: `radial-gradient(60% 120% at 100% 0%, hsl(${brand.uiHue} 60% 50%), transparent 60%)` }}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <BrandAvatar brand={brand} size={64} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{brand.name}</h1>
                {brand.established ? (
                  <Badge variant="outline" className="font-normal">
                    Est. {brand.established}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {brand.category} · {brand.region}
              </p>
              <p className="mt-3 max-w-2xl text-pretty text-sm text-foreground/90 sm:text-[15px]">
                {brand.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <StatusBadge status={brand.approvalStatus} />
                {brand.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col">
            <Link href={`/assistant?brand=${brand.id}`}>
              <Button className="w-full">
                <Sparkles />
                Open in AI Assistant
              </Button>
            </Link>
            <Button variant="outline" onClick={() => toggleFavorite(brand.id)} className="w-full">
              <Star className={cn("h-4 w-4", fav && "fill-warning text-warning")} />
              {fav ? "Favourited" : "Add to favourites"}
            </Button>
          </div>
        </div>
      </section>

      {/* Sticky section nav */}
      <nav className="sticky top-[4.25rem] z-20 -mx-1 overflow-x-auto rounded-xl border border-border bg-background/80 px-1 py-1.5 backdrop-blur-md">
        <div className="flex gap-1">
          {SECTION_NAV.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="space-y-5">
        <Section id="overview" icon={Compass} title="Brand overview">
          <p className="text-pretty text-sm leading-relaxed text-foreground/90">{brand.description}</p>
        </Section>

        <Section id="audience" icon={Users} title="Audience">
          <p className="text-pretty text-sm leading-relaxed text-foreground/90">{brand.audience}</p>
        </Section>

        <Section id="voice" icon={AudioLines} title="Tone of voice & design personality">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tone of voice</p>
              <p className="mt-2 text-sm text-foreground/90">{brand.tone}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Design personality
              </p>
              <p className="mt-2 text-sm text-foreground/90">{brand.designPersonality}</p>
            </div>
          </div>
        </Section>

        <Section id="direction" icon={Wand2} title="Suggested design direction">
          <p className="text-pretty text-sm leading-relaxed text-foreground/90">{brand.designDirection}</p>
        </Section>

        <Section
          id="logos"
          icon={Images}
          title="Logo assets"
          description="Upload previews — they save to this browser. Mark each as approved when signed off."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {logoTypes.map((l) => (
              <LogoSlot key={l.type} brand={brand} type={l.type} label={l.label} description={l.description} />
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Logo rules
            </p>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {LOGO_RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="palette"
          icon={Palette}
          title="Colour palette"
          description="Edit swatches, copy hex codes, and confirm official values."
          action={
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
          }
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brand.palette.map((swatch) => (
              <ColorSwatchCard key={swatch.id} brandId={brand.id} swatch={swatch} />
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-foreground/80">
              <span className="font-medium">Contrast guidance:</span> always check text/background pairs meet WCAG
              AA (4.5:1 for body text, 3:1 for large text). Don't place light text on light backgrounds, and confirm
              any swatch marked <span className="font-medium text-warning">Needs official confirmation</span> before
              final artwork.
            </p>
          </div>
        </Section>

        <Section id="typography" icon={Type} title="Typography">
          <TypographyEditor brand={brand} />
        </Section>

        <Section id="campaigns" icon={Megaphone} title="Campaign use cases">
          <PillList items={brand.bestUseCases} icon={Check} />
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Campaign example slots
            </p>
            <div className="flex flex-wrap gap-2">
              {brand.campaignExamples.map((c, i) => (
                <Badge key={i} variant="outline" className="font-normal">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </Section>

        <Section id="copy" icon={MessageSquareQuote} title="Copy examples">
          <div className="space-y-5">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <MessageSquareQuote className="h-3.5 w-3.5" /> Copywriting examples
              </p>
              <div className="space-y-2">
                {brand.copyExamples.map((c, i) => (
                  <blockquote
                    key={i}
                    className="rounded-lg border-l-2 border-primary bg-background px-4 py-3 text-sm"
                  >
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {c.label}
                    </span>
                    <span className="mt-1 block font-display text-base text-foreground/90">&ldquo;{c.text}&rdquo;</span>
                  </blockquote>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> Newsletter uses
                </p>
                <PillList items={brand.newsletterUses} />
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Social media uses
                </p>
                <PillList items={brand.socialUses} />
              </div>
            </div>
          </div>
        </Section>

        <Section id="rules" icon={ShieldCheck} title="Design do's and don'ts">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success">
                <Check className="h-4 w-4" /> Do
              </p>
              <ul className="space-y-2">
                {brand.dos.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-foreground/90">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-destructive">
                <X className="h-4 w-4" /> Don't
              </p>
              <ul className="space-y-2">
                {brand.donts.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span className="text-foreground/90">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="approval"
          icon={ShieldCheck}
          title="Approval checklist"
          description="A quick readiness check before this brand's work goes to a manager."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <ChecklistRow ok={anyLogo} label="Logo assets uploaded" hint="At least one logo file added" />
            <ChecklistRow ok={logosApproved} label="All logos approved" hint="Every slot marked approved" />
            <ChecklistRow ok={paletteConfirmed} label="Palette confirmed" hint="No swatches awaiting confirmation" />
            <ChecklistRow ok={typographyConfirmed} label="Typography confirmed" hint="Official fonts verified" />
            <button
              type="button"
              onClick={() => setManual((m) => ({ ...m, tone: !m.tone }))}
              className="text-left"
            >
              <ChecklistRow ok={manual.tone} label="Tone matched to the brief" hint="Tap to confirm" />
            </button>
            <button
              type="button"
              onClick={() => setManual((m) => ({ ...m, proofed: !m.proofed }))}
              className="text-left"
            >
              <ChecklistRow ok={manual.proofed} label="Copy proofed & signed off" hint="Tap to confirm" />
            </button>
          </div>
        </Section>

        <Section id="notes" icon={StickyNote} title="Notes">
          <NotesPanel brand={brand} />
        </Section>
      </div>
    </div>
  );
}
