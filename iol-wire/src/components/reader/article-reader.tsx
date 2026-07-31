"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Headphones,
  Lightbulb,
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  BadgeCheck,
  Clock,
  Square,
  Download,
} from "lucide-react";
import type { Article } from "@/types";
import { getArticle, relatedArticles, posterUrl } from "@/data/articles";
import { CATEGORY_MAP } from "@/data/categories";
import { useContent, useSettings, savedIds } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";
import { nativeShare } from "@/lib/share";
import { Byline } from "@/components/shared/byline";

export function ArticleReader({ articleId }: { articleId: string }) {
  const article = getArticle(articleId);
  const openReader = useUI((s) => s.openReader);
  if (!article) return null;
  return <ReaderInner key={article.id} article={article} close={() => openReader(null)} />;
}

function ReaderInner({ article, close }: { article: Article; close: () => void }) {
  const cat = CATEGORY_MAP[article.category];
  const related = relatedArticles(article);

  const [showTldr, setShowTldr] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [listening, setListening] = useState(false);

  const addHistory = useContent((s) => s.addHistory);
  const liked = useContent((s) => s.liked.includes(article.id));
  const toggleLike = useContent((s) => s.toggleLike);
  const playlists = useContent((s) => s.playlists);
  const saved = savedIds(playlists).includes(article.id);
  const downloads = useContent((s) => s.downloads);
  const toggleDownload = useContent((s) => s.toggleDownload);
  const bumpShares = useContent((s) => s.bumpShares);

  const openReader = useUI((s) => s.openReader);
  const openComments = useUI((s) => s.openComments);
  const openPlaylist = useUI((s) => s.openPlaylist);
  const openShare = useUI((s) => s.openShare);
  const showToast = useUI((s) => s.showToast);
  const dataSaver = useSettings((s) => s.dataSaver);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addHistory(article.id);
  }, [article.id, addHistory]);

  // stop text-to-speech when the reader closes or article changes
  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, [article.id]);

  const toggleListen = () => {
    if (!("speechSynthesis" in window)) {
      showToast("Listening isn't supported in this browser", "🎧");
      return;
    }
    if (listening) {
      window.speechSynthesis.cancel();
      setListening(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      `${article.title}. ${article.body.join(" ")}`
    );
    utter.rate = 1.02;
    utter.onend = () => setListening(false);
    window.speechSynthesis.speak(utter);
    setListening(true);
    showToast("Reading aloud", "🎧");
  };

  const share = async () => {
    const handled = await nativeShare(article);
    if (handled) {
      bumpShares();
      showToast("Shared", "📣");
    } else {
      openShare(article.id);
    }
  };

  const isDownloaded = downloads.includes(article.id);

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-surface"
      initial={{ y: "8%", opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: "100%", opacity: 0.6 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain pb-28">
        {/* hero */}
        <div className="relative h-[42dvh] min-h-[280px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl(article, dataSaver ? 400 : 900, dataSaver ? 620 : 1400)}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 35%, transparent 55%, var(--surface) 100%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-safe">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={close}
              aria-label="Close article"
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-white"
            >
              <ChevronDown size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={share}
              aria-label="Share article"
              className="glass flex h-10 w-10 items-center justify-center rounded-full text-white"
            >
              <Share size={18} />
            </motion.button>
          </div>
        </div>

        <div className="relative mx-auto -mt-10 max-w-xl px-5">
          {/* chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#0B0B0E]"
              style={{ background: cat.color }}
            >
              {cat.label}
            </span>
            {article.factChecked && (
              <span className="flex items-center gap-1.5 rounded-pill bg-[rgba(124,224,179,.14)] px-2.5 py-1.5 text-[10px] font-semibold text-[#7CE0B3]">
                <BadgeCheck size={12} /> Fact checked
              </span>
            )}
          </div>

          <h1 className="mt-3 text-[23px] font-extrabold leading-[1.2] tracking-[-0.5px] text-ink allow-select [text-wrap:pretty]">
            {article.title}
          </h1>

          {/* byline — a desk for wire copy, a creator for posted clips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-ink-dim">
            <Byline article={article} tone="onSurface" />
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {article.readLabel}
            </span>
          </div>

          {/* AI toolbar */}
          <div className="mt-5 flex gap-2">
            <AiPill
              active={showTldr}
              onPress={() => {
                setShowTldr((v) => !v);
                vibrate(4);
              }}
              icon={<Sparkles size={15} />}
              label="TL;DR"
            />
            <AiPill
              active={listening}
              onPress={toggleListen}
              icon={listening ? <Square size={14} fill="currentColor" /> : <Headphones size={15} />}
              label={listening ? "Stop" : "Listen"}
            />
            <AiPill
              active={showExplain}
              onPress={() => {
                setShowExplain((v) => !v);
                vibrate(4);
              }}
              icon={<Lightbulb size={15} />}
              label="Explain it"
            />
          </div>

          <AnimatePresence>
            {showTldr && (
              <AiPanel key="tldr" title="TL;DR" icon={<Sparkles size={15} />}>
                <ul className="space-y-2">
                  {article.tldr.map((line, i) => (
                    <li key={i} className="flex gap-2.5 text-[14px] font-medium leading-snug">
                      <span className="mt-0.5 font-bold text-[var(--accent)]">{i + 1}</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </AiPanel>
            )}
            {showExplain && (
              <AiPanel key="explain" title="Explained simply" icon={<Lightbulb size={15} />}>
                <p className="text-[14px] font-medium leading-relaxed">{article.explain}</p>
              </AiPanel>
            )}
          </AnimatePresence>

          {/* body */}
          <div className="mt-6 space-y-5">
            {article.body.map((p, i) => (
              <p
                key={i}
                className={cn(
                  "text-[15.5px] font-normal leading-[1.75] text-ink/90 allow-select",
                  i === 0 && "text-[17px] font-medium"
                )}
              >
                {p}
              </p>
            ))}
          </div>

          {/* why this matters */}
          <div className="mt-8 rounded-3xl border-l-4 border-[var(--accent)] bg-[var(--accent)]/8 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
              Why this matters
            </p>
            <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-ink">
              {article.whyItMatters}
            </p>
          </div>

          {/* timeline */}
          {article.timeline && (
            <div className="mt-8">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-dim">
                The story so far
              </h3>
              <div className="mt-2.5 flex flex-col">
                {article.timeline.map((ev, i) => (
                  <div key={i} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <span className="mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full bg-[var(--accent)]" />
                      {i < article.timeline!.length - 1 && (
                        <span className="w-[1.5px] flex-1 bg-[var(--glass-border)]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-[10.5px] font-bold tracking-wide text-[var(--accent)]">
                        {ev.label}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-[1.5] text-ink opacity-85">
                        {ev.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* download for offline */}
          <button
            onClick={() => {
              toggleDownload(article.id);
              showToast(
                isDownloaded ? "Removed from downloads" : "Saved for offline reading",
                "⬇️"
              );
            }}
            className={cn(
              "mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-bold transition-colors",
              isDownloaded
                ? "bg-[var(--accent)]/12 text-[var(--accent)]"
                : "bg-ink/6 text-ink-dim"
            )}
          >
            <Download size={17} />
            {isDownloaded ? "Downloaded — available offline" : "Download for offline"}
          </button>

          {/* related */}
          <div className="mt-10">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-dim">
              Keep scrolling
            </h3>
            <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
              {related.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    openReader(r.id);
                    scrollRef.current?.scrollTo({ top: 0 });
                  }}
                  className="w-44 shrink-0 overflow-hidden rounded-2xl bg-surface-raised text-left shadow-card transition-transform active:scale-95"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={posterUrl(r, 320, 200)}
                    alt=""
                    className="h-24 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: CATEGORY_MAP[r.category].color }}>
                      {CATEGORY_MAP[r.category].label}
                    </p>
                    <p className="mt-1 line-clamp-3 text-[12.5px] font-bold leading-snug text-ink">
                      {r.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* sticky action bar */}
      <div className="glass-strong absolute inset-x-4 bottom-4 flex items-center justify-around rounded-pill py-2.5 pb-safe">
        <BarButton
          label={liked ? "Unlike" : "Like"}
          active={liked}
          activeColor="#FF2E54"
          onPress={() => {
            toggleLike(article.id);
            vibrate(8);
          }}
        >
          <Heart size={21} fill={liked ? "#FF2E54" : "none"} />
        </BarButton>
        <BarButton label="Comments" onPress={() => openComments(article.id)}>
          <MessageCircle size={21} />
        </BarButton>
        <BarButton
          label="Save"
          active={saved}
          activeColor="var(--accent)"
          onPress={() => openPlaylist(article.id)}
        >
          <Bookmark size={21} fill={saved ? "var(--accent)" : "none"} />
        </BarButton>
        <BarButton label="Share" onPress={share}>
          <Share size={21} />
        </BarButton>
      </div>
    </motion.div>
  );
}

function AiPill({
  active,
  onPress,
  icon,
  label,
}: {
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onPress}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-pill px-4 py-2.5 text-[13px] font-bold transition-colors",
        active ? "bg-[var(--accent)] text-white shadow-glow" : "glass text-ink"
      )}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function AiPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: "auto", marginTop: 14 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="overflow-hidden"
    >
      <div className="rounded-3xl bg-surface-raised p-5 shadow-card">
        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
          {icon} {title} · AI generated
        </p>
        <div className="text-ink">{children}</div>
      </div>
    </motion.div>
  );
}

function BarButton({
  children,
  label,
  onPress,
  active,
  activeColor,
}: {
  children: React.ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.82 }}
      onClick={onPress}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
      style={active ? { color: activeColor } : undefined}
    >
      {children}
    </motion.button>
  );
}
