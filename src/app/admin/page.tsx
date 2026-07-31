"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Pencil,
  Images,
  Palette,
  X,
  Lock,
  Check,
} from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { createBlankBrand } from "@/data/brands";
import { PageHeader } from "@/components/shared/page-header";
import { BrandAvatar } from "@/components/shared/brand-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { uid } from "@/lib/utils";
import type { ApprovalStatus, Brand, TypographyStatus } from "@/types";

const APPROVAL_OPTIONS = [
  { label: "Approved", value: "approved" },
  { label: "In review", value: "in-review" },
  { label: "Needs official confirmation", value: "needs-confirmation" },
];

function EditBrandModal({ brand, open, onClose }: { brand: Brand | null; open: boolean; onClose: () => void }) {
  const { updateBrand, updateTypography, addColor } = useHub();
  const { toast } = useToast();
  const [d, setD] = React.useState(() => initDraft(brand));
  const [newExample, setNewExample] = React.useState("");

  React.useEffect(() => setD(initDraft(brand)), [brand]);

  function initDraft(b: Brand | null) {
    return {
      name: b?.name ?? "",
      shortName: b?.shortName ?? "",
      category: b?.category ?? "",
      region: b?.region ?? "",
      audience: b?.audience ?? "",
      description: b?.description ?? "",
      tone: b?.tone ?? "",
      designPersonality: b?.designPersonality ?? "",
      designDirection: b?.designDirection ?? "",
      notes: b?.notes ?? "",
      approvalStatus: (b?.approvalStatus ?? "needs-confirmation") as ApprovalStatus,
      tags: (b?.tags ?? []).join(", "),
      campaignExamples: [...(b?.campaignExamples ?? [])],
      typeNotes: b?.typography.notes ?? "",
      typeStatus: (b?.typography.status ?? "needs-confirmation") as TypographyStatus,
    };
  }

  if (!brand) return null;

  function save() {
    updateBrand(brand!.id, {
      name: d.name,
      shortName: d.shortName,
      category: d.category,
      region: d.region,
      audience: d.audience,
      description: d.description,
      tone: d.tone,
      designPersonality: d.designPersonality,
      designDirection: d.designDirection,
      notes: d.notes,
      approvalStatus: d.approvalStatus,
      tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean),
      campaignExamples: d.campaignExamples,
    });
    updateTypography(brand!.id, { notes: d.typeNotes, status: d.typeStatus });
    toast({ title: `${d.name} updated`, variant: "success" });
    onClose();
  }

  const field = (label: string, key: keyof typeof d, textarea = false) => (
    <div>
      <Label className="text-xs">{label}</Label>
      {textarea ? (
        <Textarea
          className="mt-1"
          rows={2}
          value={d[key] as string}
          onChange={(e) => setD({ ...d, [key]: e.target.value })}
        />
      ) : (
        <Input
          className="mt-1"
          value={d[key] as string}
          onChange={(e) => setD({ ...d, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit ${brand.name}`}
      description="Update brand information, typography and status."
      className="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>
            <Check />
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {field("Name", "name")}
          {field("Short name", "shortName")}
          {field("Category", "category")}
          {field("Region", "region")}
        </div>
        {field("Audience", "audience", true)}
        {field("Description", "description", true)}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {field("Tone of voice", "tone")}
          {field("Design personality", "designPersonality")}
        </div>
        {field("Design direction", "designDirection", true)}
        {field("Tags (comma separated)", "tags")}

        {/* Typography */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Typography</p>
          <Textarea
            rows={2}
            value={d.typeNotes}
            onChange={(e) => setD({ ...d, typeNotes: e.target.value })}
            placeholder="Typography notes"
          />
          <div className="mt-2">
            <Select
              value={d.typeStatus}
              onValueChange={(v) => setD({ ...d, typeStatus: v as TypographyStatus })}
              options={[
                { label: "Confirmed", value: "confirmed" },
                { label: "Needs official confirmation", value: "needs-confirmation" },
              ]}
              className="max-w-xs"
            />
          </div>
        </div>

        {/* Campaign examples */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Campaign examples
          </p>
          <div className="flex flex-wrap gap-1.5">
            {d.campaignExamples.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs">
                {c}
                <button
                  onClick={() => setD({ ...d, campaignExamples: d.campaignExamples.filter((_, j) => j !== i) })}
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {d.campaignExamples.length === 0 ? (
              <span className="text-xs text-muted-foreground">None yet.</span>
            ) : null}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Add a campaign example…"
              className="h-9"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!newExample.trim()) return;
                setD({ ...d, campaignExamples: [...d.campaignExamples, newExample.trim()] });
                setNewExample("");
              }}
            >
              <Plus />
              Add
            </Button>
          </div>
        </div>

        {/* Status + quick links */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Label className="text-xs">Approval status</Label>
            <Select
              className="mt-1 w-56"
              value={d.approvalStatus}
              onValueChange={(v) => setD({ ...d, approvalStatus: v as ApprovalStatus })}
              options={APPROVAL_OPTIONS}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                addColor(brand.id, {
                  id: uid("color"),
                  name: "New colour",
                  hex: null,
                  usage: "Describe usage",
                  role: "support",
                  status: "needs-confirmation",
                });
                toast({ title: "Colour added", variant: "success" });
              }}
            >
              <Palette />
              Add colour
            </Button>
            <Link href={`/brands/${brand.id}#logos`}>
              <Button size="sm" variant="outline">
                <Images />
                Logos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminPage() {
  const { brands, adminMode, setAdminMode, addBrand, setApproval, exportData, importData, resetData } = useHub();
  const { toast } = useToast();
  const [editing, setEditing] = React.useState<Brand | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [showReset, setShowReset] = React.useState(false);
  const [newBrand, setNewBrand] = React.useState({ name: "", category: "Publication", region: "" });
  const fileRef = React.useRef<HTMLInputElement>(null);

  function handleExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-hub-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data exported", description: "design-hub-data.json downloaded", variant: "success" });
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = importData(text);
    toast({ title: res.ok ? "Import complete" : "Import failed", description: res.message, variant: res.ok ? "success" : "error" });
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleAddBrand() {
    if (!newBrand.name.trim()) {
      toast({ title: "Give the brand a name", variant: "error" });
      return;
    }
    let brand = createBlankBrand(newBrand.name);
    if (brands.some((b) => b.id === brand.id)) brand = { ...brand, id: `${brand.id}-${Date.now().toString(36).slice(-3)}` };
    brand = { ...brand, category: newBrand.category || brand.category, region: newBrand.region || brand.region };
    addBrand(brand);
    setNewBrand({ name: "", category: "Publication", region: "" });
    setShowAdd(false);
    toast({ title: `${brand.name} added`, description: "Edit it to fill in the details.", variant: "success" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System"
        title="Admin Mode"
        icon={ShieldCheck}
        description="Manage brand data, assets and palettes. Add and edit brands, mark assets approved, and export or import the whole dataset. Changes save to this browser."
      />

      {/* Admin toggle */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={cnTile(adminMode)}>
            {adminMode ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
          <div>
            <p className="font-semibold">Admin view</p>
            <p className="text-sm text-muted-foreground">
              {adminMode ? "Editing is enabled. Be careful with destructive actions." : "Turn on to enable editing, import and reset."}
            </p>
          </div>
        </div>
        <Switch checked={adminMode} onCheckedChange={setAdminMode} aria-label="Toggle admin view" />
      </div>

      {/* Data management */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">Data management</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download />
            Export JSON
          </Button>
          <Button variant="outline" disabled={!adminMode} onClick={() => fileRef.current?.click()}>
            <Upload />
            Import JSON
          </Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
          <Button variant="outline" disabled={!adminMode} onClick={() => setShowReset(true)}>
            <RotateCcw />
            Reset demo data
          </Button>
        </div>
        {!adminMode ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Import and reset are disabled until Admin view is on.
          </p>
        ) : null}
      </div>

      {/* Brands */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Brands ({brands.length})
          </h2>
          <Button size="sm" disabled={!adminMode} onClick={() => setShowAdd(true)}>
            <Plus />
            Add brand
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
          {brands.map((b, i) => (
            <div
              key={b.id}
              className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <BrandAvatar brand={b} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{b.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.category} · {b.region}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-48">
                  <Select
                    value={b.approvalStatus}
                    onValueChange={(v) => setApproval(b.id, v as ApprovalStatus)}
                    options={APPROVAL_OPTIONS}
                    disabled={!adminMode}
                    triggerClassName="h-9"
                  />
                </div>
                <Button size="sm" variant="outline" disabled={!adminMode} onClick={() => setEditing(b)}>
                  <Pencil />
                  Edit
                </Button>
                <Link href={`/brands/${b.id}`}>
                  <Button size="sm" variant="ghost">
                    Open
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit modal */}
      <EditBrandModal brand={editing} open={!!editing} onClose={() => setEditing(null)} />

      {/* Add brand modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add a new brand"
        description="Creates a brand with safe placeholder data you can fill in afterwards."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBrand}>
              <Plus />
              Add brand
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Brand name</Label>
            <Input
              className="mt-1"
              value={newBrand.name}
              onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
              placeholder="e.g. Sunday Tribune"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Category</Label>
              <Input
                className="mt-1"
                value={newBrand.category}
                onChange={(e) => setNewBrand({ ...newBrand, category: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Region</Label>
              <Input
                className="mt-1"
                value={newBrand.region}
                onChange={(e) => setNewBrand({ ...newBrand, region: e.target.value })}
                placeholder="Needs official confirmation"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Reset confirm */}
      <Modal
        open={showReset}
        onClose={() => setShowReset(false)}
        title="Reset demo data?"
        description="This restores all brands to the original demo dataset and clears your uploads, favourites, saved prompts and outputs in this browser. This can't be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowReset(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetData();
                setShowReset(false);
                toast({ title: "Demo data reset", variant: "success" });
              }}
            >
              <RotateCcw />
              Reset everything
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Tip: export your data first if you want to keep a copy.
        </p>
      </Modal>
    </div>
  );
}

function cnTile(active: boolean) {
  return `flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-success/12 text-success" : "bg-muted text-muted-foreground"}`;
}
