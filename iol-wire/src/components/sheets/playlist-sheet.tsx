"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, ListMusic } from "lucide-react";
import { Sheet } from "./sheet";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn, vibrate } from "@/lib/utils";

const EMOJIS = ["🔥", "⚽", "🏎️", "🎧", "💼", "🧠", "✨", "📌"];

/** Swipe-down target: pick a playlist or create the first one. */
export function PlaylistSheet({ articleId }: { articleId: string }) {
  const playlists = useContent((s) => s.playlists);
  const createPlaylist = useContent((s) => s.createPlaylist);
  const addToPlaylist = useContent((s) => s.addToPlaylist);
  const removeFromPlaylist = useContent((s) => s.removeFromPlaylist);
  const openPlaylist = useUI((s) => s.openPlaylist);
  const showToast = useUI((s) => s.showToast);

  const [creating, setCreating] = useState(playlists.length === 0);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🔥");

  const close = () => openPlaylist(null);

  const create = () => {
    if (name.trim().length < 2) return;
    createPlaylist(name.trim(), emoji, articleId);
    vibrate([8, 20, 8]);
    showToast(`Saved to “${name.trim()}”`, emoji);
    close();
  };

  return (
    <Sheet onClose={close} title={creating ? "New playlist" : "Save to playlist"}>
      {creating ? (
        <div className="space-y-4">
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5">
            <span className="text-xl" aria-hidden>
              {emoji}
            </span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && create()}
              placeholder="Playlist name — e.g. Matchday"
              className="w-full bg-transparent text-[15px] font-semibold text-ink placeholder:text-ink-faint focus:outline-none allow-select"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                aria-label={`Use ${e} emoji`}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-transform active:scale-90",
                  emoji === e ? "bg-[var(--accent)]/20 ring-2 ring-[var(--accent)]" : "bg-ink/5"
                )}
              >
                {e}
              </button>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={create}
            disabled={name.trim().length < 2}
            className={cn(
              "w-full rounded-2xl py-4 text-[15px] font-bold transition-colors",
              name.trim().length >= 2
                ? "bg-[var(--accent)] text-white shadow-glow"
                : "bg-ink/10 text-ink-faint"
            )}
          >
            Create & save story
          </motion.button>
          {playlists.length > 0 && (
            <button
              onClick={() => setCreating(false)}
              className="w-full text-center text-[13px] font-semibold text-ink-dim"
            >
              Back to playlists
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          {playlists.map((p) => {
            const inList = p.articleIds.includes(articleId);
            return (
              <button
                key={p.id}
                onClick={() => {
                  if (inList) {
                    removeFromPlaylist(p.id, articleId);
                    showToast(`Removed from “${p.name}”`);
                  } else {
                    addToPlaylist(p.id, articleId);
                    vibrate([8, 20, 8]);
                    showToast(`Saved to “${p.name}”`, p.emoji);
                    close();
                  }
                }}
                className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors active:bg-ink/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink/5 text-xl">
                  {p.emoji}
                </span>
                <div className="flex-1">
                  <p className="text-[14.5px] font-bold">{p.name}</p>
                  <p className="text-xs font-medium text-ink-dim">
                    {p.articleIds.length}{" "}
                    {p.articleIds.length === 1 ? "story" : "stories"}
                  </p>
                </div>
                {inList ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                    <Check size={15} strokeWidth={3} />
                  </span>
                ) : (
                  <ListMusic size={18} className="text-ink-faint" />
                )}
              </button>
            );
          })}
          <button
            onClick={() => setCreating(true)}
            className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left text-[14.5px] font-bold text-[var(--accent)] transition-colors active:bg-ink/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/12">
              <Plus size={20} />
            </span>
            New playlist
          </button>
        </div>
      )}
    </Sheet>
  );
}
