"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { useHub } from "@/components/providers/hub-provider";
import { HubMark } from "./hub-mark";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { adminMode } = useHub();

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Brand lockup */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <Link href="/" onClick={onNavigate} className="flex items-center gap-3">
          <HubMark size={36} />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">Design Hub</span>
            <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Independent Media
            </span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {active ? (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      ) : null}
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-border p-3">
        {adminMode ? (
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
            <ShieldCheck className="h-4 w-4" />
            Admin view is on
          </div>
        ) : (
          <Link
            href="/intern-mode"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg bg-accent/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <GraduationCap className="h-4 w-4 text-primary" />
            New here? Start in Intern Mode
          </Link>
        )}
        <p className="px-1 text-[11px] text-muted-foreground/70">
          v1.0 · Local demo build · Data stored in your browser
        </p>
      </div>
    </div>
  );
}
