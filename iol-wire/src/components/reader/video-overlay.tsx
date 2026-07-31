"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  Sparkles,
} from "lucide-react";
import type { Article } from "@/types";
import { Byline } from "@/components/shared/byline";
import { getArticle, posterUrl } from "@/data/articles";
import { CATEGORY_MAP } from "@/data/categories";
import { useContent, savedIds, useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";
import { nativeShare } from "@/lib/share";

/** Fullscreen video player opened by tapping a video story card. */
export function VideoOverlay({ articleId }: { articleId: string }) {
  const article = getArticle(articleId);
  const openVideo = useUI((s) => s.openVideo);
  const openComments = useUI((s) => s.openComments);
  const openPlaylist = useUI((s) => s.openPlaylist);
  const openShare = useUI((s) => s.openShare);
  const showToast = useUI((s) => s.showToast);
  const addHistory = useContent((s) => s.addHistory);
  const toggleLike = useContent((s) => s.toggleLike);
  const bumpShares = useContent((s) => s.bumpShares);
  const liked = useContent((s) => s.liked.includes(articleId));
  const playlists = useContent((s) => s.playlists);
  const saved = savedIds(playlists).includes(articleId);

  const captions = useSettings((s) => s.captions);
  const setSetting = useSettings((s) => s.set);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showArticle, setShowArticle] = useState(false);

  useEffect(() => {
    if (article) addHistory(article.id);
  }, [article, addHistory]);

  if (!article || !article.videoUrl) return null;
  const cat = CATEGORY_MAP[article.category];
  const close = () => openVideo(null);
  // Placeholder clips are pulled from a remote sample bucket; real footage
  // supplied with a story is served from /public alongside its poster.
  const isStockClip = /^https?:/.test(article.videoUrl);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => undefined);
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const share = async () => {
    vibrate(6);
    const handled = await nativeShare(article);
    if (handled) {
      bumpShares();
      showToast("Shared", "📣");
    } else {
      openShare(article.id);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onPanEnd={(_, info) => {
        if (info.offset.y < -70 || info.velocity.y < -500) setShowArticle(true);
      }}
    >
      {/* poster fills the letterbox behind a cover-cropped video */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${posterUrl(article)})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/25" />

      <video
        ref={videoRef}
        src={article.videoUrl}
        poster={posterUrl(article)}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        autoPlay
        muted={muted}
        playsInline
        loop
        onClick={togglePlay}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress(v.currentTime / v.duration);
        }}
      />

      {!playing && (
        <button
          onClick={togglePlay}
          aria-label="Play"
          className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-xl"
        >
          <Play size={28} fill="currentColor" strokeWidth={0} className="ml-1" />
        </button>
      )}

      {/* top controls */}
      <div className="absolute inset-x-3.5 top-3.5 z-[3] flex justify-between pt-safe">
        <GlassCircle label="Close video" onPress={close}>
          <ChevronDown size={18} />
        </GlassCircle>
        <div className="flex gap-2">
          <button
            onClick={() => setSetting("captions", !captions)}
            aria-pressed={captions}
            aria-label="Toggle captions"
            className={cn(
              "flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/[.18] text-[10.5px] font-extrabold text-white backdrop-blur-[18px]",
              !captions && "bg-[rgba(20,20,24,.45)]"
            )}
            style={captions ? { background: "var(--accent)" } : undefined}
          >
            CC
          </button>
          <GlassCircle
            label={muted ? "Unmute" : "Mute"}
            onPress={() => setMuted((m) => !m)}
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </GlassCircle>
        </div>
      </div>

      {/* action rail */}
      <div className="absolute bottom-[150px] right-3 z-[3] flex flex-col items-center gap-[13px]">
        <GlassCircle
          label={liked ? "Unlike" : "Like"}
          onPress={() => {
            const now = toggleLike(article.id);
            vibrate(now ? [10, 30, 10] : 6);
          }}
          color={liked ? "var(--accent)" : "#fff"}
        >
          <Heart size={19} fill={liked ? "currentColor" : "none"} />
        </GlassCircle>
        <GlassCircle label="Comments" onPress={() => openComments(article.id)}>
          <MessageCircle size={19} />
        </GlassCircle>
        <GlassCircle
          label="Save"
          onPress={() => openPlaylist(article.id)}
          color={saved ? "#FFD166" : "#fff"}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </GlassCircle>
        <GlassCircle label="Share" onPress={share}>
          <Share size={18} />
        </GlassCircle>
      </div>

      {/* caption + meta */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2] px-5 pb-6 pt-5 pb-safe"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,.88) 60%)",
        }}
      >
        {captions && article.caption && (
          <div className="mb-3">
            <p className="inline-block max-w-[80%] rounded-[10px] bg-black/65 px-3 py-[7px] text-[12px] font-semibold leading-[1.4] text-white">
              {article.caption}
            </p>
          </div>
        )}
        <span
          className="inline-block rounded-pill px-3 py-[5px] text-[9.5px] font-bold tracking-[1.5px] text-[#0B0B0E]"
          style={{ background: cat.color }}
        >
          {cat.label.toUpperCase()}
        </span>
        <h2 className="mt-2 max-w-[82%] text-[17px] font-extrabold leading-[1.25] text-white [text-wrap:pretty]">
          {article.title}
        </h2>
        <div className="mt-1.5 flex items-center gap-2">
          <Byline article={article} />
          {isStockClip && (
            <span className="text-[11px] text-white/50">· Demo footage</span>
          )}
        </div>

        <button
          onClick={() => setShowArticle(true)}
          className="mt-3 flex w-full flex-col items-center gap-0.5 text-white/70"
          aria-label="Read the full story"
        >
          <ChevronUp size={16} className="animate-float-up" />
          <span className="text-[10px] font-semibold uppercase tracking-[2px]">
            Swipe up to read
          </span>
        </button>
        <div className="mt-3.5 h-[3px] overflow-hidden rounded-pill bg-white/20">
          <div
            className="h-full rounded-pill bg-[var(--accent)] transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence>
        {showArticle && (
          <ArticleSheet article={article} onClose={() => setShowArticle(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * The written story, pulled up over the still-playing clip. Dragging it back
 * down returns you to the video.
 */
function ArticleSheet({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const cat = CATEGORY_MAP[article.category];
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 top-[18%] z-[8] flex flex-col overflow-hidden rounded-t-[28px] border-t border-[var(--glass-border)] bg-surface"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 90 || info.velocity.y > 500) onClose();
      }}
    >
      <button
        onClick={onClose}
        aria-label="Back to the video"
        className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-pill bg-[var(--glass-border)]"
      />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-4">
        <span
          className="inline-block rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#0B0B0E]"
          style={{ background: cat.color }}
        >
          {cat.label}
        </span>
        <h2 className="mt-3 text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] text-ink [text-wrap:pretty]">
          {article.title}
        </h2>
        <Byline article={article} tone="onSurface" className="mt-3" />

        <div className="mt-4 rounded-[18px] border border-[var(--glass-border)] bg-surface-raised p-4">
          <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[2px] text-[var(--accent)]">
            <Sparkles size={11} /> TL;DR
          </p>
          <div className="mt-2.5 flex flex-col gap-2">
            {article.tldr.map((line) => (
              <div key={line} className="flex gap-2.5 text-[12.5px] leading-[1.5] text-ink">
                <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[var(--accent)]" />
                <span className="opacity-90">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {article.body.map((para, i) => (
          <p
            key={i}
            className="mt-4 leading-[1.78] text-ink opacity-[.86] allow-select"
            style={{ fontSize: "var(--afs)" }}
          >
            {para}
          </p>
        ))}

        <div className="mt-6 rounded-[18px] border border-[var(--glass-border)] bg-surface-raised p-4">
          <p className="text-[9.5px] font-bold uppercase tracking-[2px] text-[var(--accent)]">
            Why this matters
          </p>
          <p className="mt-2 text-[12.5px] leading-[1.65] text-ink opacity-90">
            {article.whyItMatters}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function GlassCircle({
  children,
  label,
  onPress,
  color = "#fff",
}: {
  children: React.ReactNode;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onPress}
      aria-label={label}
      className="flex h-[43px] w-[43px] items-center justify-center rounded-full border border-white/[.28] backdrop-blur-[22px]"
      style={{
        color,
        background:
          "linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,.04))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.34), 0 6px 16px rgba(0,0,0,.35)",
      }}
    >
      {children}
    </motion.button>
  );
}
