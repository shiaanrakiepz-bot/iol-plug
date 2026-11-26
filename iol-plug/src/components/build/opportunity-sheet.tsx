"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  Check,
  Clock,
  ExternalLink,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { Sheet } from "@/components/sheets/sheet";
import { imageUrl } from "@/data/articles";
import { TYPE_COLOR, closingLabel, daysUntilClose, getOpportunity } from "@/data/opportunities";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";
import { Segmented } from "@/components/ui/segmented";

type Tab = "about" | "requirements" | "benefits";

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "requirements", label: "What you need" },
  { id: "benefits", label: "What you get" },
];

export function OpportunitySheet({ id }: { id: string }) {
  const opp = getOpportunity(id);
  const close = useUI((s) => s.openOpportunity);
  const showToast = useUI((s) => s.showToast);
  const applications = useContent((s) => s.applications);
  const apply = useContent((s) => s.apply);
  const [tab, setTab] = useState<Tab>("about");
  const [confirming, setConfirming] = useState(false);

  if (!opp) return null;

  const applied = applications.some((a) => a.opportunityId === opp.id);
  const closing = daysUntilClose(opp);
  const list = tab === "requirements" ? opp.requirements : tab === "benefits" ? opp.benefits : null;

  const submit = () => {
    if (opp.applyMethod === "external") {
      window.open(opp.applyUrl, "_blank", "noopener,noreferrer");
      showToast("Opening the employer's site", "link");
      return;
    }
    // Two taps, because the first one shows exactly what the employer receives.
    if (!confirming) {
      setConfirming(true);
      return;
    }
    apply(opp.id);
    vibrate([10, 30, 10]);
    showToast("Application sent", "check");
    close(null);
  };

  return (
    <Sheet onClose={() => close(null)} detents={[0.62, 0.94]}>
      <div className="relative -mx-5 -mt-1 h-[150px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={opp.image ?? imageUrl(opp.imageSeed, 800, 500)}
          alt=""
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 20%, color-mix(in oklab, var(--surface-overlay) 92%, transparent))",
          }}
        />
        <span
          className="absolute left-5 top-4 rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0B0B0E]"
          style={{ background: TYPE_COLOR[opp.type] }}
        >
          {opp.type}
        </span>
      </div>

      <div className="-mt-2">
        <h2 className="text-[21px] font-extrabold leading-[1.18] tracking-[-0.02em] text-ink [text-wrap:pretty]">
          {opp.title}
        </h2>

        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-dim">
          <span className="font-semibold text-ink">{opp.org}</span>
          {opp.verified ? (
            <span className="flex items-center gap-1 text-[#7CE0B3]">
              <BadgeCheck size={12} /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#FFD166]">
              <ShieldAlert size={12} /> Unverified
            </span>
          )}
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {opp.remote ? "Remote · " : ""}
            {opp.location}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[11px] font-semibold",
              closing <= 3
                ? "bg-[rgba(232,25,44,.14)] text-[var(--accent)]"
                : "bg-[var(--glass-bg)] text-ink-dim"
            )}
          >
            <Clock size={12} /> {closingLabel(opp)}
          </span>
          {opp.stipend && (
            <span className="flex items-center gap-1.5 rounded-pill bg-[var(--glass-bg)] px-3 py-1.5 text-[11px] font-semibold text-ink-dim">
              <Banknote size={12} /> {opp.stipend}
            </span>
          )}
        </div>

        {!opp.verified && (
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-[rgba(255,209,102,.12)] px-3 py-2.5 text-[11.5px] leading-[1.5] text-[#FFD166]">
            <ShieldAlert size={14} className="mt-0.5 shrink-0" />
            IOL has not verified this employer. Never pay a fee to apply, and never
            send ID documents before you have met them.
          </p>
        )}

        <Segmented
          className="mt-5"
          layoutGroupId="opportunity-tabs"
          value={tab}
          onChange={setTab}
          segments={TABS.map((t) => ({ id: t.id, label: t.label }))}
        />

        <div className="mt-4 min-h-[128px]">
          {list ? (
            <ul className="flex flex-col gap-2.5">
              {list.map((line) => (
                <li key={line} className="flex gap-2.5 text-[13.5px] leading-[1.5] text-ink">
                  <Check size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13.5px] leading-[1.65] text-ink opacity-90">{opp.about}</p>
          )}
        </div>

        {opp.skills.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
              Skills
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {opp.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-pill border border-[var(--glass-border)] px-3 py-1.5 text-[11.5px] font-medium text-ink-dim"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* The consent step: you see exactly what leaves your profile. */}
        {confirming && !applied && opp.applyMethod === "in-app" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-[var(--glass-border)] bg-surface-raised p-4"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
              Shared with {opp.org}
            </p>
            <ul className="mt-2.5 flex flex-col gap-1.5 text-[12.5px] text-ink-dim">
              <li>· Your name and contact details</li>
              <li>· Your saved CV</li>
              <li>· The skills on your profile</li>
            </ul>
            <p className="mt-2.5 text-[11.5px] leading-[1.5] text-ink-faint">
              Nothing else is sent. You can withdraw from Applications at any time.
            </p>
          </motion.div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={submit}
          disabled={applied || closing < 0}
          className={cn(
            "mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold transition-colors",
            applied || closing < 0
              ? "bg-[var(--glass-bg)] text-ink-faint"
              : "bg-[var(--accent)] text-white shadow-glow"
          )}
        >
          {applied ? (
            <>
              <Check size={17} /> Applied
            </>
          ) : closing < 0 ? (
            "Applications closed"
          ) : opp.applyMethod === "external" ? (
            <>
              Apply on {opp.org} <ExternalLink size={15} />
            </>
          ) : confirming ? (
            "Confirm and send"
          ) : (
            "Apply with Plug"
          )}
        </motion.button>
      </div>
    </Sheet>
  );
}
