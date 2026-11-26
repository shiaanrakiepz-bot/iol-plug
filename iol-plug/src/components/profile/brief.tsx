"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Headphones, Square } from "lucide-react";
import { ARTICLES, posterUrl } from "@/data/articles";
import { CATEGORY_MAP } from "@/data/categories";
import { useSettings, useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { SubPageHeader } from "./shared";
import { Glyph } from "@/components/icons/glyphs";

/** AI Daily Brief — top stories picked from the user's interests. */
export function DailyBrief() {
  const setProfilePage = useUI((s) => s.setProfilePage);
  const openReader = useUI((s) => s.openReader);
  const openVideo = useUI((s) => s.openVideo);
  const user = useSettings((s) => s.user);
  const interests = useSettings((s) => s.interests);
  const followed = useContent((s) => s.followedTopics);
  const [listening, setListening] = useState(false);

  const picks = useMemo(() => {
    const pref = new Set([...interests, ...followed]);
    const scored = [...ARTICLES].sort(
      (a, b) =>
        (pref.has(b.category) ? 2 : 0) +
        (b.trending ? 1 : 0) -
        ((pref.has(a.category) ? 2 : 0) + (a.trending ? 1 : 0))
    );
    return scored.slice(0, 5);
  }, [interests, followed]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const toggleListen = () => {
    if (!("speechSynthesis" in window)) return;
    if (listening) {
      window.speechSynthesis.cancel();
      setListening(false);
      return;
    }
    const script = `${greeting}. Here is your IOL Plug daily brief. ${picks
      .map((p, i) => `Story ${i + 1}: ${p.title}. ${p.tldr[0]}`)
      .join(" ")}`;
    const utter = new SpeechSynthesisUtterance(script);
    utter.rate = 1.03;
    utter.onend = () => setListening(false);
    window.speechSynthesis.speak(utter);
    setListening(true);
  };

  return (
    <div>
      <SubPageHeader title="Daily Brief" onBack={() => setProfilePage("main")} />

      <div
        className="mt-3 overflow-hidden rounded-3xl p-6 text-white shadow-card"
        style={{ background: "linear-gradient(130deg, var(--accent), #7c3aed)" }}
      >
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
          <Sparkles size={13} /> AI generated · {today}
        </p>
        <h1 className="mt-2 text-[24px] font-bold leading-tight">
          {greeting}, {user?.name.split(" ")[0] ?? "there"}.
        </h1>
        <p className="mt-1 text-[13.5px] font-medium text-white/85">
          Five stories picked from your interests — readable in about a minute.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleListen}
          className="mt-4 flex items-center gap-2 rounded-pill bg-white/20 px-4 py-2.5 text-[13px] font-bold backdrop-blur"
        >
          {listening ? <Square size={14} fill="currentColor" /> : <Headphones size={15} />}
          {listening ? "Stop listening" : "Listen to your brief"}
        </motion.button>
      </div>

      <div className="mt-4 space-y-3 pb-4">
        {picks.map((a, i) => {
          const cat = CATEGORY_MAP[a.category];
          return (
            <motion.button
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (a.type === "video" ? openVideo(a.id) : openReader(a.id))}
              className="flex w-full gap-3.5 rounded-3xl bg-surface-raised p-4 text-left shadow-card"
            >
              <span className="text-[22px] font-black text-[var(--accent)]">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: cat.color }}>
                  <Glyph name={cat.glyph} size={12} className="inline align-[-2px] mr-1" />{cat.label}
                </span>
                <p className="text-[14.5px] font-bold leading-snug text-ink">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-[12.5px] font-medium leading-snug text-ink-dim">
                  {a.tldr[0]}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={posterUrl(a, 140, 140)} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
