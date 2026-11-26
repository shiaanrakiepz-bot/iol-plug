"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useUI } from "@/lib/ui-store";
import { Splash } from "@/components/onboarding/splash";
import { Onboarding } from "@/components/onboarding/onboarding";
import { AppShell } from "@/components/layout/app-shell";
import { Toast } from "@/components/shared/toast";
import { OfflineBanner } from "@/components/shared/offline-banner";

export default function Home() {
  const phase = useUI((s) => s.phase);
  const setOnline = useUI((s) => s.setOnline);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, [setOnline]);

  if (!mounted) {
    return <div className="fixed inset-0 bg-black" aria-hidden />;
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-surface">
      {phase === "app" && <AppShell />}
      <AnimatePresence>{phase === "onboarding" && <Onboarding key="onboarding" />}</AnimatePresence>
      <AnimatePresence>{phase === "splash" && <Splash key="splash" />}</AnimatePresence>
      <OfflineBanner />
      <Toast />
    </main>
  );
}
