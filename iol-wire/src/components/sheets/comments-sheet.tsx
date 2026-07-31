"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, SendHorizontal } from "lucide-react";
import { Sheet } from "./sheet";
import { getArticle } from "@/data/articles";
import { useContent, useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

export function CommentsSheet({ articleId }: { articleId: string }) {
  const article = getArticle(articleId);
  const openComments = useUI((s) => s.openComments);
  const user = useSettings((s) => s.user);
  const allMyComments = useContent((s) => s.myComments);
  const myComments = useMemo(
    () => allMyComments.filter((c) => c.articleId === articleId),
    [allMyComments, articleId]
  );
  const addComment = useContent((s) => s.addComment);
  const [draft, setDraft] = useState("");
  const [likedComments, setLikedComments] = useState<string[]>([]);

  if (!article) return null;
  const close = () => openComments(null);
  const total = article.comments.length + myComments.length;

  const send = () => {
    if (!draft.trim()) return;
    addComment(articleId, draft.trim());
    setDraft("");
  };

  return (
    <Sheet onClose={close} title={`${total} comment${total === 1 ? "" : "s"}`} className="max-h-[78dvh]">
      <div className="max-h-[48dvh] space-y-4 overflow-y-auto pb-3">
        {myComments.map((c) => (
          <CommentRow
            key={c.id}
            author={user?.name ?? "You"}
            initials={initialsOf(user?.name)}
            color="var(--accent)"
            text={c.text}
            likes={0}
            timeAgo="now"
            mine
            liked={false}
            onLike={() => undefined}
          />
        ))}
        {article.comments.map((c) => (
          <CommentRow
            key={c.id}
            author={c.author}
            initials={c.initials}
            color={c.color}
            text={c.text}
            likes={c.likes + (likedComments.includes(c.id) ? 1 : 0)}
            timeAgo={c.timeAgo}
            liked={likedComments.includes(c.id)}
            onLike={() =>
              setLikedComments((prev) =>
                prev.includes(c.id)
                  ? prev.filter((x) => x !== c.id)
                  : [...prev, c.id]
              )
            }
          />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 border-t border-ink/10 pt-4">
        <div className="glass flex flex-1 items-center rounded-pill px-4 py-2.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Add a comment…"
            className="w-full bg-transparent text-[14px] font-medium text-ink placeholder:text-ink-faint focus:outline-none allow-select"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={send}
          disabled={!draft.trim()}
          aria-label="Post comment"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors",
            draft.trim() ? "bg-[var(--accent)]" : "bg-ink/15"
          )}
        >
          <SendHorizontal size={18} />
        </motion.button>
      </div>
    </Sheet>
  );
}

/** "Thabo Mokoena" → "TM"; falls back to a neutral chip for guests. */
function initialsOf(name: string | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "ME";
  return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function CommentRow({
  author,
  initials,
  color,
  text,
  likes,
  timeAgo,
  liked,
  onLike,
  mine,
}: {
  author: string;
  initials: string;
  color: string;
  text: string;
  likes: number;
  timeAgo: string;
  liked: boolean;
  onLike: () => void;
  mine?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-[#0B0B0E]"
        style={{ background: color }}
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold text-ink-dim">
          {author}
          {mine && (
            <span className="ml-1.5 rounded-md bg-[var(--accent)]/15 px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">
              You
            </span>
          )}
          <span className="ml-2 font-medium text-ink-faint">{timeAgo}</span>
        </p>
        <p className="mt-0.5 text-[14px] font-medium leading-snug text-ink allow-select">
          {text}
        </p>
      </div>
      {!mine && (
        <button
          onClick={onLike}
          aria-label={liked ? "Unlike comment" : "Like comment"}
          className="flex shrink-0 flex-col items-center gap-0.5 pt-1 text-ink-faint"
        >
          <Heart
            size={15}
            fill={liked ? "#FF2E54" : "none"}
            className={liked ? "text-[#FF2E54]" : undefined}
          />
          <span className="text-[10.5px] font-semibold">{likes}</span>
        </button>
      )}
    </div>
  );
}
