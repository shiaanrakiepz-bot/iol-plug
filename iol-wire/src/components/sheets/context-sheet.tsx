"use client";

import {
  BookmarkPlus,
  Rss,
  EyeOff,
  MessageCircle,
  Bookmark,
  Flag,
  Clock,
} from "lucide-react";
import { Sheet } from "./sheet";
import { getArticle } from "@/data/articles";
import { CATEGORY_MAP } from "@/data/categories";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

/** Long-press menu: Read Later / Follow Topic / Not Interested / Comments / Bookmark / Report */
export function ContextSheet({ articleId }: { articleId: string }) {
  const article = getArticle(articleId);
  const openContext = useUI((s) => s.openContext);
  const openComments = useUI((s) => s.openComments);
  const openPlaylist = useUI((s) => s.openPlaylist);
  const showToast = useUI((s) => s.showToast);

  const readLater = useContent((s) => s.readLater.includes(articleId));
  const toggleReadLater = useContent((s) => s.toggleReadLater);
  const followedTopics = useContent((s) => s.followedTopics);
  const toggleFollowTopic = useContent((s) => s.toggleFollowTopic);
  const markNotInterested = useContent((s) => s.markNotInterested);
  const reportArticle = useContent((s) => s.reportArticle);

  if (!article) return null;
  const cat = CATEGORY_MAP[article.category];
  const following = followedTopics.includes(article.category);
  const close = () => openContext(null);

  const items = [
    {
      icon: <Clock size={20} />,
      label: readLater ? "Remove from Read Later" : "Read Later",
      onPress: () => {
        toggleReadLater(articleId);
        showToast(readLater ? "Removed from Read Later" : "Saved for later", "⏰");
        close();
      },
    },
    {
      icon: <Rss size={20} />,
      label: following ? `Unfollow ${cat.label}` : `Follow ${cat.label}`,
      onPress: () => {
        toggleFollowTopic(article.category);
        showToast(
          following ? `Unfollowed ${cat.label}` : `Following ${cat.label}`,
          cat.emoji
        );
        close();
      },
    },
    {
      icon: <MessageCircle size={20} />,
      label: "Comments",
      onPress: () => {
        close();
        openComments(articleId);
      },
    },
    {
      icon: <Bookmark size={20} />,
      label: "Save to playlist",
      onPress: () => {
        close();
        openPlaylist(articleId);
      },
    },
    {
      icon: <EyeOff size={20} />,
      label: "Not interested",
      onPress: () => {
        markNotInterested(articleId);
        showToast("Got it — less of this", "👌");
        close();
      },
      danger: false,
    },
    {
      icon: <Flag size={20} />,
      label: "Report",
      onPress: () => {
        reportArticle(articleId);
        showToast("Reported. Our team will review it.", "🚩");
        close();
      },
      danger: true,
    },
  ];

  return (
    <Sheet onClose={close}>
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-ink/5 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${article.imageSeed}/120/120`}
          alt=""
          className="h-12 w-12 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-bold leading-tight">
            {article.title}
          </p>
          <p className="text-xs font-medium text-ink-dim">
            {article.source} · {article.publishedAt}
          </p>
        </div>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onPress}
            className={cn(
              "flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-[14.5px] font-semibold transition-colors active:bg-ink/10",
              item.danger ? "text-iol-red" : "text-ink"
            )}
          >
            {item.icon}
            {item.label}
            {item.label === "Read Later" && readLater && (
              <BookmarkPlus size={16} className="ml-auto text-[var(--accent)]" />
            )}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
