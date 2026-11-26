"use client";

import type { Article } from "@/types";
import { getAccount } from "@/data/accounts";
import { isWorld } from "@/data/articles";
import { Globe } from "lucide-react";
import { useSettings } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

/**
 * Who filed a story. Desk stories show the IOL mark and the desk name; stories
 * posted by a person show their avatar and handle, and open their profile.
 */
export function Byline({
  article,
  tone = "onMedia",
  className,
}: {
  article: Article;
  /** onMedia sits over artwork; onSurface sits on a themed background */
  tone?: "onMedia" | "onSurface";
  className?: string;
}) {
  const account = getAccount(article.author);
  const viewAccount = useUI((s) => s.viewAccount);
  const userName = useSettings((s) => s.user?.name);

  const muted = tone === "onMedia" ? "text-white/75" : "text-ink-dim";
  const strong = tone === "onMedia" ? "text-white" : "text-ink";

  if (!account) {
    /*
      Wire copy must never wear the IOL mark. Putting our logo beside another
      newsroom's name implies we reported it, which is the opposite of what the
      world wire is for.
    */
    const world = isWorld(article);
    return (
      <div className={cn("flex items-center gap-2 text-[11px]", muted, className)}>
        {world ? (
          <span
            className="flex h-[21px] w-[21px] items-center justify-center rounded-[7px] bg-[#6FBFFF] text-[#06263d]"
            aria-label="World wire"
          >
            <Globe size={12} />
          </span>
        ) : (
          <span className="flex h-[21px] w-[21px] items-center justify-center rounded-[7px] bg-[var(--accent)] text-[8px] font-extrabold tracking-wide text-white">
            IOL
          </span>
        )}
        <span className={cn("font-semibold", strong)}>{article.source}</span>
        <span className="opacity-50" aria-hidden>·</span>
        <span className="opacity-75">{article.publishedAt}</span>
      </div>
    );
  }

  // Your own posts carry whatever name you've set on your profile.
  const displayName = account.isSelf ? userName || account.name : account.name;

  return (
    <div className={cn("flex items-center gap-2 text-[11px]", muted, className)}>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          viewAccount(account.handle);
        }}
        className="flex items-center gap-2 text-left"
        aria-label={`View ${displayName}'s profile`}
      >
        <span
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[9px] font-extrabold text-[#0B0B0E]"
          style={{ background: account.color }}
          aria-hidden
        >
          {account.initials}
        </span>
        <span className={cn("font-semibold", strong)}>@{account.handle}</span>
      </button>
      <span className="opacity-50" aria-hidden>·</span>
      <span className="opacity-75">{article.publishedAt}</span>
    </div>
  );
}
