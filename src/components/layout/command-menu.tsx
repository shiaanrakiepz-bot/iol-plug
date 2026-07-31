"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  Sparkles,
  Mails,
  Stethoscope,
  Megaphone,
  Images,
  Newspaper,
} from "lucide-react";
import { useHub } from "@/components/providers/hub-provider";
import { ALL_NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface CommandItem {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  href: string;
  hue?: number;
}

const ACTIONS: CommandItem[] = [
  { icon: Sparkles, title: "Generate a headline", subtitle: "Open the AI Assistant", href: "/assistant" },
  { icon: Mails, title: "Build newsletter copy", subtitle: "Open the Newsletter Helper", href: "/newsletter" },
  { icon: Megaphone, title: "Start a campaign", subtitle: "Open the Campaign Builder", href: "/campaign-builder" },
  { icon: Stethoscope, title: "Review a design idea", subtitle: "Open the Design Doctor", href: "/design-doctor" },
  { icon: Images, title: "Upload a logo", subtitle: "Open the Logo Vault", href: "/logo-vault" },
];

export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { brands } = useHub();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const sections = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (s: string) => !q || s.toLowerCase().includes(q);

    const actions = ACTIONS.filter((a) => match(a.title) || match(a.subtitle));
    const brandItems: CommandItem[] = brands
      .filter(
        (b) =>
          !q ||
          match(b.name) ||
          match(b.region) ||
          match(b.category) ||
          b.tags.some((t) => match(t)),
      )
      .slice(0, q ? 8 : 5)
      .map((b) => ({
        icon: Newspaper,
        title: b.name,
        subtitle: `${b.category} · ${b.region}`,
        href: `/brands/${b.id}`,
        hue: b.uiHue,
      }));
    const pages: CommandItem[] = ALL_NAV_ITEMS.filter(
      (i) => match(i.title) || match(i.description),
    ).map((i) => ({ icon: i.icon, title: i.title, subtitle: i.description, href: i.href }));

    const out: { label: string; items: CommandItem[] }[] = [];
    if (actions.length) out.push({ label: "Quick actions", items: actions });
    if (brandItems.length) out.push({ label: "Brands", items: brandItems });
    if (pages.length) out.push({ label: "Pages", items: pages });
    return out;
  }, [query, brands]);

  const flat = React.useMemo(() => sections.flatMap((s) => s.items), [sections]);

  React.useEffect(() => setActive(0), [query]);

  function select(item?: CommandItem) {
    if (!item) return;
    router.push(item.href);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(flat[active]);
    }
  }

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search brands, logos, colours, campaign ideas…"
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {flat.length === 0 ? (
                <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                sections.map((section) => (
                  <div key={section.label} className="mb-1.5">
                    <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
                      {section.label}
                    </p>
                    {section.items.map((item) => {
                      runningIndex += 1;
                      const idx = runningIndex;
                      const Icon = item.icon;
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.href + item.title}
                          type="button"
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => select(item)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                            isActive ? "bg-accent" : "hover:bg-accent/60",
                          )}
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                            style={
                              item.hue !== undefined
                                ? {
                                    backgroundColor: `hsl(${item.hue} 62% 50% / 0.16)`,
                                    color: `hsl(${item.hue} 55% 48%)`,
                                  }
                                : undefined
                            }
                          >
                            <Icon
                              className={cn("h-4 w-4", item.hue === undefined && "text-muted-foreground")}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{item.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {item.subtitle}
                            </span>
                          </span>
                          {isActive ? (
                            <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
