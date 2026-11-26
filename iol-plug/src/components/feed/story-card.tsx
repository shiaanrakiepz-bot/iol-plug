"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  ShieldCheck,
  Play,
} from "lucide-react";
import type { Article } from "@/types";
import { CATEGORY_MAP } from "@/data/categories";
import { posterUrl, isWorld } from "@/data/articles";
import { Globe } from "lucide-react";
import { useContent, savedIds, useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";
import { nativeShare } from "@/lib/share";
import { Byline } from "@/components/shared/byline";

export function StoryCard({
  article,
  active,
  preview,
  onLikeBurst,
}: {
  article: Article;
  active: boolean;
  /** Press-and-hold: play the clip even if autoplay/data saver would block it */
  preview?: boolean;
  onLikeBurst?: () => void;
}) {
  const cat = CATEGORY_MAP[article.category];
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const liked = useContent((s) => s.liked.includes(article.id));
  const toggleLike = useContent((s) => s.toggleLike);
  const playlists = useContent((s) => s.playlists);
  const saved = savedIds(playlists).includes(article.id);
  const bumpShares = useContent((s) => s.bumpShares);

  const dataSaver = useSettings((s) => s.dataSaver);
  const autoplay = useSettings((s) => s.autoplayVideos);

  const openComments = useUI((s) => s.openComments);
  const openPlaylist = useUI((s) => s.openPlaylist);
  const openShare = useUI((s) => s.openShare);
  const showToast = useUI((s) => s.showToast);

  const showVideo =
    article.type === "video" &&
    article.videoUrl &&
    !videoFailed &&
    // Holding is an explicit request to see the clip, so it overrides both the
    // settings that keep video off the card and a poster-first story's wish to
    // show its thumbnail.
    (preview || (!dataSaver && autoplay && !article.posterFirst));

  const like = () => {
    const nowLiked = toggleLike(article.id);
    vibrate(nowLiked ? [10, 30, 10] : 6);
    if (nowLiked) onLikeBurst?.();
  };

  const share = async () => {
    vibrate(6);
    const handled = await nativeShare(article);
    if (handled) {
      bumpShares();
      showToast("Shared", "megaphone");
    } else {
      openShare(article.id);
    }
  };

  return (
    <div className="absolute inset-0">
      {/* media */}
      {!imgLoaded && (
        <div className="skeleton absolute inset-0" aria-hidden />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterUrl(article)}
        alt=""
        draggable={false}
        onLoad={() => setImgLoaded(true)}
        className={cn(
          "no-drag absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
          imgLoaded ? "opacity-100" : "opacity-0"
        )}
      />
      {showVideo && (
        <video
          key={article.videoUrl}
          src={article.videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay={active || preview}
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl(article)}
          onError={() => setVideoFailed(true)}
        />
      )}

      {/* scrim */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,.42), transparent 26%, transparent 42%, rgba(0,0,0,.9) 88%)",
        }}
      />

      {/* Everything except the media fades out while previewing, so a hold
          gives you an unobstructed look at the clip. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-200",
          preview ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
      {/* top-left: reading time + category */}
      <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
        <span className="rounded-pill bg-[rgba(10,10,12,.72)] px-3.5 py-[7px] text-[10px] font-bold text-white backdrop-blur-md">
          {article.readLabel}
        </span>
        <span
          className="rounded-pill px-3.5 py-[7px] text-[10px] font-bold tracking-wider text-[#0B0B0E]"
          style={{ background: cat.color }}
        >
          {cat.label.toUpperCase()}
        </span>
        {/* Wire copy is labelled on the card, so its provenance is never a
            surprise once you open it. */}
        {isWorld(article) && (
          <span className="flex items-center gap-1.5 rounded-pill bg-[rgba(111,191,255,.92)] px-3 py-[7px] text-[10px] font-bold tracking-wider text-[#06263d]">
            <Globe size={11} />
            WORLD
          </span>
        )}
      </div>

      {/* top-right: breaking + duration */}
      <div className="absolute right-4 top-4 flex flex-col items-end gap-1.5">
        {article.breaking && (
          <span className="flex items-center gap-1.5 rounded-pill bg-[rgba(232,25,44,.92)] px-3 py-[7px] text-[10px] font-bold tracking-[1.5px] text-white">
            <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-white" />
            BREAKING
          </span>
        )}
        {article.type === "video" && article.duration && (
          <span className="flex items-center gap-1.5 rounded-pill bg-black/50 px-2.5 py-[7px] text-[10.5px] font-semibold text-white backdrop-blur-md">
            <Play size={10} fill="currentColor" strokeWidth={0} />
            {article.duration}
          </span>
        )}
      </div>

      {/* bottom meta — kept clear of the action rail */}
      <div className="absolute bottom-6 left-5 right-[74px] flex flex-col gap-2.5">
        <Byline article={article} />
        <h2 className="text-[24px] font-extrabold leading-[1.16] tracking-[-0.5px] text-white [text-wrap:pretty]">
          {article.title}
        </h2>
        <p className="text-[12.5px] leading-[1.55] text-white/[.72] [text-wrap:pretty]">
          {article.summary}
        </p>
        {article.factChecked && (
          <span className="flex w-fit items-center gap-1.5 rounded-pill bg-[rgba(124,224,179,.14)] px-2.5 py-[5px] text-[10.5px] font-semibold text-[#7CE0B3]">
            <ShieldCheck size={11} /> Fact checked
          </span>
        )}
      </div>

      {/* right action rail */}
      <div className="absolute bottom-[26px] right-3 flex flex-col items-center gap-[13px]">
        <RailButton
          label={liked ? "Unlike" : "Like"}
          caption={article.likes}
          onPress={like}
          color={liked ? "var(--accent)" : "#fff"}
        >
          <Heart size={19} fill={liked ? "currentColor" : "none"} />
        </RailButton>
        <RailButton
          label="Comments"
          caption={String(article.comments.length)}
          onPress={() => openComments(article.id)}
        >
          <MessageCircle size={19} />
        </RailButton>
        <RailButton
          label="Save"
          caption="Save"
          onPress={() => openPlaylist(article.id)}
          color={saved ? "#FFD166" : "#fff"}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </RailButton>
        <RailButton label="Share" caption="Share" onPress={share}>
          <Share size={18} />
        </RailButton>
      </div>
      </div>
    </div>
  );
}

function RailButton({
  children,
  label,
  caption,
  onPress,
  color = "#fff",
}: {
  children: React.ReactNode;
  label: string;
  caption: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      aria-label={label}
      className="flex flex-col items-center gap-[3px]"
    >
      <motion.span
        whileTap={{ scale: 0.9 }}
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
      </motion.span>
      <span className="text-[9.5px] font-semibold text-white/80">{caption}</span>
    </button>
  );
}
