"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Briefcase, Heart, Star } from "lucide-react";
import type { ApplicationStatus, SwipeDirection } from "@/types";
import { imageUrl } from "@/data/articles";
import { TYPE_COLOR, closingLabel, getOpportunity } from "@/data/opportunities";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { SubPageHeader, EmptyState } from "./shared";
import { Segmented } from "@/components/ui/segmented";

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  Saved: "#FFD166",
  Applied: "#6FBFFF",
  Interviewing: "#D9A0FF",
  Accepted: "#6EE087",
  Rejected: "#FF6B5E",
};

/** The three lists the swipe produces, plus anything actually applied for. */
type View = "applied" | "right" | "up" | "down";

const VIEWS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "applied", label: "Applied", icon: <Briefcase size={13} /> },
  { id: "right", label: "Interested", icon: <Heart size={13} /> },
  { id: "up", label: "Starred", icon: <Star size={13} /> },
  { id: "down", label: "Saved", icon: <Bookmark size={13} /> },
];

export function Applications() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const setTab = useUI((s) => s.setTab);
  const openOpportunity = useUI((s) => s.openOpportunity);
  const applications = useContent((s) => s.applications);
  const swipes = useContent((s) => s.swipes);
  const [view, setView] = useState<View>("applied");

  const counts = useMemo(
    () => ({
      applied: applications.length,
      right: swipes.filter((s) => s.direction === "right").length,
      up: swipes.filter((s) => s.direction === "up").length,
      down: swipes.filter((s) => s.direction === "down").length,
    }),
    [applications, swipes]
  );

  /** Rows are derived from stored swipes, so what you threw is what you see. */
  const rows = useMemo(() => {
    if (view === "applied") {
      return applications.map((a) => ({
        key: a.id,
        opp: getOpportunity(a.opportunityId),
        status: a.status as ApplicationStatus | null,
        at: a.updatedAt,
      }));
    }
    return swipes
      .filter((s) => s.direction === (view as SwipeDirection))
      .map((s) => ({
        key: s.opportunityId,
        opp: getOpportunity(s.opportunityId),
        status: null,
        at: s.at,
      }));
  }, [view, applications, swipes]);

  return (
    <div>
      <SubPageHeader title="Applications" onBack={() => setProfilePage("main")} />

      <Segmented
        className="mt-3"
        size="sm"
        layoutGroupId="applications-view"
        value={view}
        onChange={setView}
        segments={VIEWS.map((v) => ({
          id: v.id,
          label: (
            <span className="flex items-center gap-1">
              {v.label}
              <span className="tabular-nums opacity-55">{counts[v.id]}</span>
            </span>
          ),
          srLabel: `${v.label}, ${counts[v.id]}`,
        }))}
      />

      {rows.length === 0 ? (
        <EmptyState
          glyph={view === "applied" ? "megaphone" : "archive"}
          title={view === "applied" ? "No applications yet" : "Nothing here yet"}
          text={
            view === "applied"
              ? "Open an opportunity from Build and apply — it lands here with its status."
              : "Swipe a card in Build and it shows up in this list."
          }
          cta="Go to Build"
          onCta={() => {
            setTab("build");
          }}
        />
      ) : (
        <div className="mt-3 space-y-2.5">
          {rows.map(({ key, opp, status, at }, i) =>
            opp ? (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.2) }}
                onClick={() => openOpportunity(opp.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-surface-raised p-2.5 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={opp.image ?? imageUrl(opp.imageSeed, 160, 160)}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span
                    className="text-[9.5px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: TYPE_COLOR[opp.type] }}
                  >
                    {opp.type}
                  </span>
                  <p className="mt-0.5 line-clamp-1 text-[13px] font-bold leading-snug text-ink">
                    {opp.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-dim">
                    {opp.org} · {closingLabel(opp)}
                  </p>
                </div>
                {status ? (
                  <span
                    className="shrink-0 rounded-pill px-2.5 py-1 text-[10px] font-bold"
                    style={{
                      background: `${STATUS_COLOR[status]}22`,
                      color: STATUS_COLOR[status],
                    }}
                  >
                    {status}
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] text-ink-faint">
                    {new Date(at).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </motion.button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
