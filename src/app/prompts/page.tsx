"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquareText, Star, Plus, Trash2, Sparkles, Bookmark, ChevronDown } from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { useToast } from "@/components/providers/toast-provider";
import { PROMPT_LIBRARY, PROMPT_CATEGORIES } from "@/data/prompts";
import { PageHeader } from "@/components/shared/page-header";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import { cn, uid, formatRelativeTime } from "@/lib/utils";
import type { PromptCategory, PromptTemplate } from "@/types";

const BUILTIN_IDS = new Set(PROMPT_LIBRARY.map((p) => p.id));

function PromptCard({
  prompt,
  isFav,
  isCustom,
  onFav,
  onRemove,
}: {
  prompt: PromptTemplate;
  isFav: boolean;
  isCustom: boolean;
  onFav: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-tight">{prompt.title}</h3>
        {isCustom ? (
          <button
            onClick={onRemove}
            aria-label="Delete prompt"
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onFav}
            aria-label={isFav ? "Remove from saved" : "Save prompt"}
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Star className={cn("h-4 w-4", isFav && "fill-warning text-warning")} />
          </button>
        )}
      </div>
      <div className="mb-3 flex items-center gap-1.5">
        <Badge variant="secondary" className="font-normal">
          {prompt.category}
        </Badge>
        {isCustom ? <Badge variant="outline">Custom</Badge> : null}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-foreground/80">{prompt.text}</p>
      <div className="mt-4 flex items-center gap-1.5">
        <CopyButton value={prompt.text} />
        <Link href={`/assistant?topic=${encodeURIComponent(prompt.text)}`} className="ml-auto">
          <Button size="sm" variant="secondary">
            <Sparkles />
            Use in Assistant
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PromptLibraryPage() {
  const { savedPrompts, savePrompt, removePrompt, savedOutputs, removeOutput } = useHub();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("All");
  const [showAdd, setShowAdd] = React.useState(false);
  const [showOutputs, setShowOutputs] = React.useState(true);

  // new prompt draft
  const [draft, setDraft] = React.useState<{ title: string; category: PromptCategory; text: string }>({
    title: "",
    category: "Headlines",
    text: "",
  });

  const customPrompts = savedPrompts.filter((p) => !BUILTIN_IDS.has(p.id));
  const allPrompts = [...PROMPT_LIBRARY, ...customPrompts];

  const filtered = allPrompts.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q);
  });

  function isFav(id: string) {
    return savedPrompts.some((p) => p.id === id);
  }

  function toggleFav(p: PromptTemplate) {
    if (isFav(p.id)) {
      removePrompt(p.id);
    } else {
      savePrompt(p);
      toast({ title: "Saved to your prompts", variant: "success" });
    }
  }

  function addCustom() {
    if (!draft.title.trim() || !draft.text.trim()) {
      toast({ title: "Add a title and prompt text", variant: "error" });
      return;
    }
    savePrompt({ id: uid("prompt"), title: draft.title.trim(), category: draft.category, text: draft.text.trim() });
    setDraft({ title: "", category: "Headlines", text: "" });
    setShowAdd(false);
    toast({ title: "Prompt added to your library", variant: "success" });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resources"
        title="Prompt Library"
        icon={MessageSquareText}
        description="Reusable, copy-ready prompts for headlines, captions, newsletters, feedback and more. Save your favourites, add your own, and send any prompt straight to the AI Assistant."
        actions={
          <Button onClick={() => setShowAdd(true)}>
            <Plus />
            New prompt
          </Button>
        }
      />

      {/* Controls */}
      <div className="space-y-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search prompts…"
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...PROMPT_CATEGORIES].map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No prompts here yet"
          description="Try another category or add your own prompt to the library."
          action={
            <Button size="sm" variant="outline" onClick={() => setShowAdd(true)}>
              <Plus />
              New prompt
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PromptCard
              key={p.id}
              prompt={p}
              isFav={isFav(p.id)}
              isCustom={!BUILTIN_IDS.has(p.id)}
              onFav={() => toggleFav(p)}
              onRemove={() => {
                removePrompt(p.id);
                toast({ title: "Prompt removed" });
              }}
            />
          ))}
        </div>
      )}

      {/* Saved AI outputs */}
      <section>
        <button
          onClick={() => setShowOutputs((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-card px-5 py-3.5 text-left shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Saved AI outputs</h2>
            <Badge variant="secondary">{savedOutputs.length}</Badge>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showOutputs && "rotate-180")} />
        </button>

        {showOutputs ? (
          savedOutputs.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={Bookmark}
                title="No saved outputs yet"
                description="When you generate copy in the AI Assistant, Newsletter Helper or Campaign Builder, hit Save and it'll land here."
              />
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {savedOutputs.map((o) => (
                <div key={o.id} className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">{o.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {o.meta ? `${o.meta} · ` : ""}
                        {formatRelativeTime(o.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeOutput(o.id);
                        toast({ title: "Output removed" });
                      }}
                      aria-label="Delete output"
                      className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <details className="mt-2 group">
                    <summary className="cursor-pointer list-none text-xs font-medium text-primary hover:underline">
                      View output
                    </summary>
                    <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-foreground/80">
                      {o.body}
                    </pre>
                  </details>
                  <div className="mt-3">
                    <CopyButton value={o.body} label="Copy output" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </section>

      {/* Add prompt modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add a prompt"
        description="Save a reusable prompt to your library."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={addCustom}>
              <Plus />
              Add prompt
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              className="mt-1"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Punchy poster headline"
            />
          </div>
          <div>
            <Label className="text-xs">Category</Label>
            <Select
              className="mt-1"
              value={draft.category}
              onValueChange={(v) => setDraft({ ...draft, category: v as PromptCategory })}
              options={PROMPT_CATEGORIES.map((c) => ({ label: c, value: c }))}
            />
          </div>
          <div>
            <Label className="text-xs">Prompt text</Label>
            <Textarea
              className="mt-1"
              rows={4}
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="Write the reusable prompt…"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
