"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { Article } from "@/types";
import { posterUrl } from "@/data/articles";
import { CATEGORY_MAP } from "@/data/categories";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphName } from "@/components/icons/glyphs";

/**
 * iOS large-title navigation.
 *
 * The bar is always there, but it carries the title only once the large one
 * has scrolled away — which is the detail that makes a page feel native
 * rather than like a web page with a back button. The swap is driven by an
 * IntersectionObserver on a sentinel under the large title, so there is no
 * scroll handler running on every frame.
 */
export function SubPageHeader({
  title,
  onBack,
  action,
  subtitle,
}: {
  title: string;
  onBack: () => void;
  action?: React.ReactNode;
  subtitle?: string;
}) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), {
      // The bar is 52px tall; trip the swap exactly as the title passes under it.
      rootMargin: "-52px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-20 -mx-4 flex h-[52px] items-center gap-3 px-4 transition-[background-color,box-shadow] duration-200",
          collapsed
            ? "bg-surface/80 shadow-[0_0.5px_0_0_var(--glass-border)] backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onBack}
          aria-label="Back"
          className="-ml-1.5 flex items-center gap-0.5 text-[var(--accent)]"
        >
          <ChevronLeft size={24} strokeWidth={2.4} />
          <span className="text-[16px] font-medium">Back</span>
        </motion.button>

        {/* Centred compact title, iOS-style: fades in as the large one leaves. */}
        <h2
          className={cn(
            "pointer-events-none absolute inset-x-16 text-center text-[16px] font-semibold tracking-[-0.01em] text-ink transition-all duration-200",
            collapsed ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
          )}
        >
          {title}
        </h2>

        <span className="ml-auto">{action}</span>
      </div>

      <h1 className="mt-1 text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] text-ink">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-[13.5px] font-medium leading-snug text-ink-dim">{subtitle}</p>
      )}
      <div ref={sentinel} aria-hidden className="h-px" />
    </>
  );
}

export function ArticleRow({ article, trailing }: { article: Article; trailing?: React.ReactNode }) {
  const openReader = useUI((s) => s.openReader);
  const openVideo = useUI((s) => s.openVideo);
  const cat = CATEGORY_MAP[article.category];
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-raised p-3 shadow-card">
      <button
        onClick={() => (article.type === "video" ? openVideo(article.id) : openReader(article.id))}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={posterUrl(article, 160, 160)} alt="" loading="lazy" className="h-16 w-16 rounded-xl object-cover" />
          {article.type === "video" && (
            <span className="glass absolute inset-0 m-auto flex h-7 w-7 items-center justify-center rounded-full text-white">
              <Play size={11} fill="currentColor" className="ml-0.5" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: cat.color }}>
            {cat.label}
          </span>
          <p className="line-clamp-2 text-[13.5px] font-bold leading-snug text-ink">{article.title}</p>
          <p className="text-[11.5px] font-medium text-ink-faint">
            {article.source} · {article.publishedAt}
          </p>
        </div>
      </button>
      {trailing}
    </div>
  );
}

export function MenuRow({
  icon,
  label,
  detail,
  onPress,
  danger,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  detail?: string;
  onPress: () => void;
  danger?: boolean;
  iconBg?: string;
}) {
  return (
    <button
      onClick={onPress}
      className="flex w-full items-center gap-3.5 rounded-2xl px-3 py-3 text-left transition-colors active:bg-ink/8 [--row-inset:66px]"
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          danger ? "bg-iol-red/12 text-iol-red" : "bg-ink/6 text-ink"
        )}
        style={iconBg ? { background: `${iconBg}22`, color: iconBg } : undefined}
      >
        {icon}
      </span>
      <span className={cn("flex-1 text-[14.5px] font-semibold", danger ? "text-iol-red" : "text-ink")}>
        {label}
      </span>
      {detail && <span className="text-[12.5px] font-semibold text-ink-faint">{detail}</span>}
      <ChevronRight size={17} className="text-ink-faint" />
    </button>
  );
}

export function ToggleRow({
  label,
  detail,
  value,
  onChange,
}: {
  label: React.ReactNode;
  detail?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors active:bg-ink/8"
    >
      <div className="flex-1">
        <p className="text-[14.5px] font-semibold text-ink">{label}</p>
        {detail && <p className="text-[12px] font-medium text-ink-faint">{detail}</p>}
      </div>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
          value ? "bg-[var(--accent)]" : "bg-ink/20"
        )}
      >
        <motion.span
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        />
      </span>
    </button>
  );
}

export function EmptyState({ glyph, title, text, cta, onCta }: { glyph: GlyphName; title: string; text: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/6 text-ink-dim">
        <Glyph name={glyph} size={30} strokeWidth={1.5} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-[250px] text-[13px] font-medium leading-relaxed text-ink-dim">{text}</p>
      {cta && onCta && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCta}
          className="mt-5 rounded-pill bg-[var(--accent)] px-6 py-3 text-[13.5px] font-bold text-white shadow-glow"
        >
          {cta}
        </motion.button>
      )}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-6 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">
      {children}
    </p>
  );
}
