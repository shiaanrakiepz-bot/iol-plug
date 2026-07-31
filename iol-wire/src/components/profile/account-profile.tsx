"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, Lock, Heart, ListMusic } from "lucide-react";
import { ARTICLES, posterUrl } from "@/data/articles";
import { getAccount } from "@/data/accounts";
import { CATEGORY_MAP } from "@/data/categories";
import { useContent, useSettings, savedIds } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

/**
 * A creator's public profile: what they've posted, and — unless the account is
 * private — what they've liked and collected.
 */
export function AccountProfile({ handle }: { handle: string }) {
  const account = getAccount(handle);
  const viewAccount = useUI((s) => s.viewAccount);
  const openReader = useUI((s) => s.openReader);
  const openVideo = useUI((s) => s.openVideo);

  const userName = useSettings((s) => s.user?.name);
  const myLikes = useContent((s) => s.liked);
  const myPlaylists = useContent((s) => s.playlists);
  const privateProfile = useSettings((s) => s.privateProfile);

  /** Name of the playlist currently expanded, if any */
  const [openPlaylist, setOpenPlaylist] = useState<string | null>(null);

  if (!account) return null;

  const isSelf = Boolean(account.isSelf);
  const displayName = isSelf ? userName || account.name : account.name;
  // Your own activity is real; other accounts carry sample activity.
  const likedIds = isSelf ? myLikes : account.likes ?? [];
  const playlists = isSelf
    ? myPlaylists.map((p) => ({ name: p.name, articleIds: p.articleIds }))
    : account.playlists ?? [];
  const locked = isSelf ? privateProfile : Boolean(account.private);

  const posts = ARTICLES.filter((a) => a.author === handle);
  const liked = likedIds.map((id) => ARTICLES.find((a) => a.id === id)).filter(Boolean) as Article[];
  const savedCount = isSelf ? savedIds(myPlaylists).length : playlists.flatMap((p) => p.articleIds).length;

  const open = (a: Article) => (a.type === "video" ? openVideo(a.id) : openReader(a.id));

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-surface"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
    >
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-surface/85 px-4 py-3 backdrop-blur-xl pt-safe">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => viewAccount(null)}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] text-ink"
        >
          <ChevronLeft size={18} />
        </motion.button>
        <h2 className="flex-1 text-[15px] font-bold text-ink">@{account.handle}</h2>
      </div>

      <div className="px-4 pb-10">
        <div className="flex flex-col items-center gap-1 pt-2">
          <span
            className="flex h-[78px] w-[78px] items-center justify-center rounded-full text-[26px] font-extrabold text-[#0B0B0E]"
            style={{ background: account.color }}
            aria-hidden
          >
            {account.initials}
          </span>
          <h1 className="mt-2 text-[19px] font-extrabold tracking-[-0.3px] text-ink">
            {displayName}
            {isSelf && (
              <span className="ml-2 rounded-pill bg-[var(--accent)]/15 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                You
              </span>
            )}
          </h1>
          <p className="text-[11.5px] text-ink-dim">
            @{account.handle} · {account.beat}
          </p>
          <p className="mt-2 max-w-[280px] text-center text-[12px] leading-[1.5] text-ink-dim">
            {account.bio}
          </p>
        </div>

        <div className="mt-4 flex overflow-hidden rounded-[20px] border border-[var(--glass-border)] bg-surface-raised">
          <Stat label="Posts" value={posts.length} />
          <span className="w-px bg-[var(--glass-border)]" />
          <Stat label="Followers" value={account.followers} />
          <span className="w-px bg-[var(--glass-border)]" />
          <Stat label="Saved" value={savedCount} accent />
        </div>

        <SectionLabel>Posts</SectionLabel>
        {posts.length ? (
          <div className="grid grid-cols-3 gap-1.5">
            {posts.map((a) => (
              <button
                key={a.id}
                onClick={() => open(a)}
                className="relative aspect-[9/16] overflow-hidden rounded-[14px] bg-surface-raised"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl(a, 240, 420)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-left text-[8.5px] font-semibold leading-tight text-white">
                  {a.readLabel}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <Empty text="No posts yet." />
        )}

        {locked ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-[20px] border border-dashed border-[var(--glass-border)] px-6 py-9 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--glass-bg)] text-ink-dim">
              <Lock size={20} />
            </span>
            <p className="text-[14px] font-bold text-ink">This profile is private</p>
            <p className="text-[12px] leading-[1.5] text-ink-dim">
              {isSelf
                ? "Your likes and playlists are hidden from everyone else."
                : `${displayName} keeps their likes and playlists to themselves.`}
            </p>
          </div>
        ) : (
          <>
            <SectionLabel>
              <Heart size={11} className="inline align-[-1px]" /> Likes
            </SectionLabel>
            {liked.length ? (
              <div className="flex flex-col gap-2">
                {liked.map((a) => (
                  <Row key={a.id} article={a} onOpen={() => open(a)} />
                ))}
              </div>
            ) : (
              <Empty text="Nothing liked yet." />
            )}

            <SectionLabel>
              <ListMusic size={11} className="inline align-[-1px]" /> Playlists
            </SectionLabel>
            {playlists.length ? (
              <div className="flex flex-col gap-2">
                {playlists.map((p) => {
                  const isOpen = openPlaylist === p.name;
                  const stories = p.articleIds
                    .map((id) => ARTICLES.find((a) => a.id === id))
                    .filter(Boolean) as Article[];
                  return (
                    <div
                      key={p.name}
                      className="overflow-hidden rounded-[18px] border border-[var(--glass-border)] bg-surface-raised"
                    >
                      <button
                        onClick={() => setOpenPlaylist(isOpen ? null : p.name)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-white"
                          style={{
                            background: `linear-gradient(140deg, ${account.color}, #3A0A10)`,
                          }}
                        >
                          <ListMusic size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13.5px] font-bold text-ink">{p.name}</p>
                          <p className="text-[11px] text-ink-dim">
                            {p.articleIds.length}{" "}
                            {p.articleIds.length === 1 ? "story" : "stories"}
                          </p>
                        </div>
                        <ChevronDown
                          size={17}
                          className={cn(
                            "shrink-0 text-ink-dim transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-2 border-t border-[var(--glass-border)] p-2.5">
                              {stories.length ? (
                                stories.map((a) => (
                                  <Row key={a.id} article={a} onOpen={() => open(a)} />
                                ))
                              ) : (
                                <p className="px-2 py-3 text-center text-[12px] text-ink-dim">
                                  This playlist is empty.
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty text="No public playlists." />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex-1 py-3.5 text-center">
      <p
        className={
          accent
            ? "text-[19px] font-extrabold text-[var(--accent)]"
            : "text-[19px] font-extrabold text-ink"
        }
      >
        {value}
      </p>
      <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[1.5px] text-ink-dim">
        {label}
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 mt-6 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-[2.5px] text-ink-dim">
      {children}
    </p>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-[18px] border border-dashed border-[var(--glass-border)] px-4 py-6 text-center text-[12px] text-ink-dim">
      {text}
    </p>
  );
}

function Row({ article, onOpen }: { article: Article; onOpen: () => void }) {
  const cat = CATEGORY_MAP[article.category];
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-3 rounded-[18px] border border-[var(--glass-border)] bg-surface-raised p-2.5 text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterUrl(article, 160, 160)}
        alt=""
        loading="lazy"
        className="h-14 w-14 shrink-0 rounded-[14px] object-cover"
      />
      <div className="min-w-0 flex-1">
        <p
          className="text-[9px] font-bold uppercase tracking-[1px]"
          style={{ color: cat.color }}
        >
          {cat.label}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-ink">
          {article.title}
        </p>
      </div>
    </button>
  );
}
