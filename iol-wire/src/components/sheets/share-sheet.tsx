"use client";

import { Link2, MessageCircleMore, Send, Mail, QrCode } from "lucide-react";
import { Sheet } from "./sheet";
import { getArticle } from "@/data/articles";
import { useContent } from "@/lib/store";
import { useUI } from "@/lib/ui-store";
import type { GlyphName } from "@/components/icons/glyphs";

/** In-app fallback share sheet (used when the OS share sheet is unavailable). */
export function ShareSheet({ articleId }: { articleId: string }) {
  const article = getArticle(articleId);
  const openShare = useUI((s) => s.openShare);
  const showToast = useUI((s) => s.showToast);
  const bumpShares = useContent((s) => s.bumpShares);

  if (!article) return null;
  const url = `https://iol.co.za/plug/${article.id}`;
  const close = () => openShare(null);

  const done = (label: string, glyph: GlyphName) => {
    bumpShares();
    showToast(label, glyph);
    close();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      done("Link copied", "link");
    } catch {
      showToast("Couldn't copy the link", "alert");
    }
  };

  const targets = [
    {
      icon: <MessageCircleMore size={22} />,
      label: "WhatsApp",
      color: "#25D366",
      onPress: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${article.title} — ${url}`)}`,
          "_blank"
        );
        done("Opening WhatsApp", "opinion");
      },
    },
    {
      icon: <Send size={22} />,
      label: "Telegram",
      color: "#229ED9",
      onPress: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`,
          "_blank"
        );
        done("Opening Telegram", "travel");
      },
    },
    {
      icon: <Mail size={22} />,
      label: "Email",
      color: "#8B5CF6",
      onPress: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${article.summary}\n\n${url}`)}`
        );
        done("Opening email", "mail");
      },
    },
    {
      icon: <Link2 size={22} />,
      label: "Copy link",
      color: "var(--accent)",
      onPress: copyLink,
    },
    {
      icon: <QrCode size={22} />,
      label: "QR code",
      color: "#64748B",
      onPress: () => showToast("QR sharing coming soon", "clock"),
    },
  ];

  return (
    <Sheet onClose={close} title="Share story">
      <p className="mb-5 line-clamp-1 text-center text-[13px] font-medium text-ink-dim">
        {article.title}
      </p>
      <div className="flex justify-between px-2">
        {targets.map((t) => (
          <button
            key={t.label}
            onClick={t.onPress}
            className="flex flex-col items-center gap-2 transition-transform active:scale-90"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
              style={{ background: t.color }}
            >
              {t.icon}
            </span>
            <span className="text-[11px] font-semibold text-ink-dim">{t.label}</span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
