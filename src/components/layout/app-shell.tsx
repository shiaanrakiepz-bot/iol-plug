"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandMenu } from "./command-menu";
import { Button } from "@/components/ui/button";

interface CommandMenuContextValue {
  openCommand: () => void;
}
const CommandMenuContext = React.createContext<CommandMenuContextValue>({ openCommand: () => {} });
export function useCommandMenu() {
  return React.useContext(CommandMenuContext);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const pathname = usePathname();

  // Global ⌘K / Ctrl+K
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const openCommand = React.useCallback(() => setCommandOpen(true), []);

  return (
    <CommandMenuContext.Provider value={{ openCommand }}>
      <div className="min-h-screen">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-border lg:block">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="absolute inset-y-0 left-0 w-[280px] border-r border-border shadow-2xl"
              >
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMobileOpen(false)}
                  className="absolute right-3 top-3.5 z-10"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </Button>
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </motion.aside>
            </div>
          ) : null}
        </AnimatePresence>

        {/* Main column */}
        <div className="lg:pl-[264px]">
          <Topbar onMenu={() => setMobileOpen(true)} onOpenCommand={openCommand} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>

        <CommandMenu open={commandOpen} onClose={() => setCommandOpen(false)} />
      </div>
    </CommandMenuContext.Provider>
  );
}
