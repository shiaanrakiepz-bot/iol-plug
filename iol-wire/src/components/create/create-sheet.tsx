"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, FileVideo, MessageSquareQuote, ShieldCheck, Upload, X } from "lucide-react";
import type { SubmissionKind } from "@/types";
import { Sheet } from "@/components/sheets/sheet";
import { useContent, useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";

const KINDS: {
  id: SubmissionKind;
  label: string;
  hint: string;
  icon: React.ReactNode;
  color: string;
  needsMedia: boolean;
  placeholder: string;
}[] = [
  {
    id: "reel",
    label: "Post a clip",
    hint: "Up to 60 seconds, shot vertically",
    icon: <FileVideo size={19} />,
    color: "#FF8FB1",
    needsMedia: true,
    placeholder: "What are we looking at?",
  },
  {
    id: "take",
    label: "Share a take",
    hint: "Your angle on a story people are arguing about",
    icon: <MessageSquareQuote size={19} />,
    color: "#6FBFFF",
    needsMedia: false,
    placeholder: "Say the thing. 500 characters.",
  },
  {
    id: "event",
    label: "Add an event",
    hint: "Something happening near you worth showing up for",
    icon: <CalendarPlus size={19} />,
    color: "#6EE087",
    needsMedia: false,
    placeholder: "Where, when, and why should anyone come?",
  },
];

export function CreateSheet() {
  const setCreate = useUI((s) => s.setCreate);
  const showToast = useUI((s) => s.showToast);
  const submit = useContent((s) => s.submit);
  const user = useSettings((s) => s.user);

  const [kind, setKind] = useState<SubmissionKind | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const active = KINDS.find((k) => k.id === kind);
  const ready =
    !!active && title.trim().length >= 4 && (!active.needsMedia || !!file);

  const send = () => {
    if (!ready || !active) return;
    submit({
      kind: active.id,
      title: title.trim(),
      body: body.trim(),
      mediaUrl: file ? URL.createObjectURL(file) : undefined,
      mediaName: file?.name,
      author: user?.name ?? "Guest",
    });
    vibrate([8, 20, 8]);
    showToast("Sent for review", "shield");
    setCreate(false);
  };

  return (
    <Sheet
      onClose={() => setCreate(false)}
      title={active ? active.label : "Create"}
      className="max-h-[88dvh] overflow-y-auto"
    >
      {!kind && (
        <>
          <div className="flex flex-col gap-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => {
                  vibrate(4);
                  setKind(k.id);
                }}
                className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors active:bg-ink/10"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${k.color}22`, color: k.color }}
                >
                  {k.icon}
                </span>
                <span className="flex-1">
                  <span className="block text-[14.5px] font-semibold text-ink">{k.label}</span>
                  <span className="block text-[11.5px] leading-[1.45] text-ink-dim">{k.hint}</span>
                </span>
              </button>
            ))}
          </div>

          {/*
            Said up front, not buried in terms. People should know before they
            film that a human reads it first.
          */}
          <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[var(--glass-bg)] px-3.5 py-3 text-[11.5px] leading-[1.55] text-ink-dim">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#7CE0B3]" />
            Everything you post is read by an IOL moderator before anyone else sees
            it. Most things clear within a few hours.
          </p>
        </>
      )}

      {active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          {active.needsMedia && (
            <>
              <input
                ref={fileInput}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <button
                onClick={() => fileInput.current?.click()}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed px-4 py-7 text-center transition-colors",
                  file
                    ? "border-[var(--accent)] bg-[var(--accent)]/8"
                    : "border-[var(--glass-border)]"
                )}
              >
                <Upload size={22} className={file ? "text-[var(--accent)]" : "text-ink-dim"} />
                <span className="text-[13px] font-semibold text-ink">
                  {file ? file.name : "Choose a video"}
                </span>
                <span className="text-[11px] text-ink-faint">
                  {file
                    ? `${(file.size / 1048576).toFixed(1)} MB · tap to replace`
                    : "MP4 or MOV, up to 60 seconds"}
                </span>
              </button>
              {file && (
                <button
                  onClick={() => setFile(null)}
                  className="flex items-center gap-1.5 self-start text-[11.5px] font-semibold text-ink-dim"
                >
                  <X size={13} /> Remove
                </button>
              )}
            </>
          )}

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a title"
            maxLength={90}
            aria-label="Title"
            className="allow-select w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3.5 text-[14px] font-medium text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-[var(--accent)]"
          />

          <div className="relative">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 500))}
              placeholder={active.placeholder}
              rows={4}
              aria-label="Description"
              className="allow-select w-full resize-none rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3.5 text-[13.5px] leading-[1.55] text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-[var(--accent)]"
            />
            <span className="absolute bottom-3 right-4 text-[10.5px] tabular-nums text-ink-faint">
              {body.length}/500
            </span>
          </div>

          <p className="flex items-start gap-2.5 rounded-2xl bg-[var(--glass-bg)] px-3.5 py-3 text-[11.5px] leading-[1.55] text-ink-dim">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#7CE0B3]" />
            This goes to the IOL review queue, not straight to the feed. You&apos;ll be
            told either way.
          </p>

          <div className="mt-1 flex gap-2.5">
            <button
              onClick={() => {
                setKind(null);
                setFile(null);
              }}
              className="rounded-2xl border border-[var(--glass-border)] px-5 py-3.5 text-[13.5px] font-semibold text-ink-dim"
            >
              Back
            </button>
            <motion.button
              whileTap={ready ? { scale: 0.98 } : undefined}
              onClick={send}
              disabled={!ready}
              className={cn(
                "flex-1 rounded-2xl py-3.5 text-[14px] font-bold transition-colors",
                ready
                  ? "bg-[var(--accent)] text-white shadow-glow"
                  : "bg-[var(--glass-bg)] text-ink-faint"
              )}
            >
              Send for review
            </motion.button>
          </div>
        </motion.div>
      )}
    </Sheet>
  );
}
