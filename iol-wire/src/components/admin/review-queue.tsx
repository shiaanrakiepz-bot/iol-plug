"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Check,
  ChevronLeft,
  FileVideo,
  Inbox,
  MessageSquareQuote,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Submission, SubmissionKind, SubmissionStatus } from "@/types";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";

const KIND_ICON: Record<SubmissionKind, React.ReactNode> = {
  reel: <FileVideo size={15} />,
  take: <MessageSquareQuote size={15} />,
  event: <CalendarPlus size={15} />,
};

const KIND_LABEL: Record<SubmissionKind, string> = {
  reel: "Clip",
  take: "Take",
  event: "Event",
};

const STATUS_COLOR: Record<SubmissionStatus, string> = {
  pending: "#FFD166",
  approved: "#6EE087",
  rejected: "#FF6B5E",
};

/** Reasons a moderator picks from, so rejections are consistent and auditable. */
const REASONS = [
  "Not safe for publication",
  "Someone did not consent to appear",
  "Can't verify this is true",
  "Off-topic for IOL Plug",
];

function Row({ sub }: { sub: Submission }) {
  const review = useContent((s) => s.reviewSubmission);
  const showToast = useUI((s) => s.showToast);
  const [rejecting, setRejecting] = useState(false);

  const decide = (approve: boolean, note?: string) => {
    review(sub.id, approve, note);
    vibrate(approve ? [10, 30, 10] : 6);
    showToast(approve ? "Published" : "Rejected, author notified", approve ? "check" : "cross");
    setRejecting(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[20px] border border-[var(--glass-border)] bg-surface-raised"
    >
      {sub.mediaUrl && (
        <video
          src={sub.mediaUrl}
          controls
          playsInline
          className="max-h-[260px] w-full bg-black object-contain"
        />
      )}

      <div className="p-4">
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{
              background: `${STATUS_COLOR[sub.status]}22`,
              color: STATUS_COLOR[sub.status],
            }}
          >
            {KIND_ICON[sub.kind]}
            {KIND_LABEL[sub.kind]}
          </span>
          <span className="text-[11.5px] text-ink-dim">
            @{sub.author} · {new Date(sub.createdAt).toLocaleString("en-ZA", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="mt-2.5 text-[14.5px] font-bold leading-[1.3] text-ink">{sub.title}</p>
        {sub.body && (
          <p className="allow-select mt-1.5 text-[12.5px] leading-[1.55] text-ink-dim">{sub.body}</p>
        )}
        {sub.mediaName && !sub.mediaUrl && (
          <p className="mt-1.5 text-[11.5px] text-ink-faint">{sub.mediaName}</p>
        )}

        {sub.status === "pending" ? (
          rejecting ? (
            <div className="mt-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Reason — the author sees this
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => decide(false, r)}
                    className="rounded-xl bg-[var(--glass-bg)] px-3.5 py-2.5 text-left text-[12.5px] font-medium text-ink transition-colors active:bg-ink/10"
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRejecting(false)}
                className="mt-2.5 text-[12px] font-semibold text-ink-dim"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-3.5 flex gap-2.5">
              <button
                onClick={() => setRejecting(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[rgba(255,107,94,.4)] py-3 text-[13px] font-bold text-[#FF6B5E]"
              >
                <X size={15} /> Reject
              </button>
              <button
                onClick={() => decide(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#6EE087] py-3 text-[13px] font-bold text-[#06301a]"
              >
                <Check size={15} /> Approve
              </button>
            </div>
          )
        ) : (
          <p
            className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold"
            style={{ color: STATUS_COLOR[sub.status] }}
          >
            {sub.status === "approved" ? <Check size={13} /> : <X size={13} />}
            {sub.status === "approved" ? "Published" : `Rejected — ${sub.reviewNote}`}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function ReviewQueue() {
  const setAdmin = useUI((s) => s.setAdmin);
  const submissions = useContent((s) => s.submissions);
  const [filter, setFilter] = useState<SubmissionStatus>("pending");

  const counts = useMemo(
    () => ({
      pending: submissions.filter((s) => s.status === "pending").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    }),
    [submissions]
  );

  const shown = submissions.filter((s) => s.status === filter);

  return (
    <motion.div
      className="fixed inset-0 z-[80] mx-auto max-w-md overflow-y-auto overscroll-contain bg-surface"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
    >
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-surface/85 px-4 py-3 pt-safe backdrop-blur-xl">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setAdmin(false)}
          aria-label="Close review queue"
          className="glass lg-press flex h-9 w-9 items-center justify-center rounded-full text-ink"
        >
          <ChevronLeft size={18} />
        </motion.button>
        <div className="flex-1">
          <h2 className="flex items-center gap-1.5 text-[16px] font-bold tracking-tight text-ink">
            <ShieldCheck size={16} className="text-[#7CE0B3]" />
            Review queue
          </h2>
          <p className="text-[11px] text-ink-dim">Nothing reaches the feed until it clears here</p>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-3">
        {(["pending", "approved", "rejected"] as SubmissionStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={cn(
              "flex-1 rounded-pill border px-3 py-2.5 text-[11.5px] font-semibold capitalize transition-colors",
              filter === s
                ? "border-transparent bg-ink text-surface"
                : "border-[var(--glass-border)] bg-[var(--glass-bg)] text-ink-dim"
            )}
          >
            {s}
            <span className="ml-1.5 tabular-nums opacity-55">{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 px-4 pb-10">
        {shown.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--glass-bg)] text-ink-dim">
              <Inbox size={30} />
            </span>
            <p className="mt-4 text-[16px] font-bold text-ink">
              {filter === "pending" ? "Queue is clear" : `Nothing ${filter}`}
            </p>
            <p className="mt-1.5 max-w-[250px] text-[12.5px] leading-[1.55] text-ink-dim">
              {filter === "pending"
                ? "New uploads land here the moment someone sends them."
                : `Items you have ${filter} will be listed here.`}
            </p>
          </div>
        ) : (
          shown.map((sub) => <Row key={sub.id} sub={sub} />)
        )}
      </div>
    </motion.div>
  );
}
