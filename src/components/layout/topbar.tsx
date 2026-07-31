"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export function Topbar({
  onMenu,
  onOpenCommand,
}: {
  onMenu: () => void;
  onOpenCommand: () => void;
}) {
  const [isMac, setIsMac] = React.useState(false);
  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu />
      </Button>

      <button
        type="button"
        onClick={onOpenCommand}
        className={cn(
          "group flex h-10 w-full max-w-md items-center gap-2.5 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent/40",
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">Search brands, logos, colours, campaign ideas…</span>
        <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/assistant" className="hidden sm:block">
          <Button size="sm">
            <Sparkles />
            Ask AI
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
