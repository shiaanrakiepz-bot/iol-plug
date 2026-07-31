"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

/** Must match RUNTIME in public/sw.js. */
const RUNTIME_CACHE = "iol-wire-v2-runtime";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Registers the service worker and surfaces Android/desktop Chrome's install
 * prompt when the browser offers one. iOS never fires the event, so there the
 * user adds to home screen from the share sheet.
 */
export function PwaProvider() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Registration needs a secure context: https, or localhost during dev.
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* unsupported or blocked — the app still works, just not offline */
    });
  }, []);

  // Assets fetched before the worker took control — or served from the HTTP
  // cache without ever reaching it — never land in its cache, and a single
  // missing blocking script is enough to leave the app blank offline. So once
  // the page is loaded, put everything it actually used in there ourselves.
  useEffect(() => {
    if (!("caches" in window)) return;

    const warm = async () => {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        const urls = new Set<string>();

        document
          .querySelectorAll<HTMLScriptElement>("script[src]")
          .forEach((s) => urls.add(s.src));
        document
          .querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]')
          .forEach((l) => urls.add(l.href));
        performance.getEntriesByType("resource").forEach((entry) => {
          if (/\.(js|css|woff2?)$/.test(new URL(entry.name).pathname)) {
            urls.add(entry.name);
          }
        });

        await Promise.all(
          [...urls]
            .filter((u) => new URL(u).origin === location.origin)
            .map((u) => cache.add(u).catch(() => undefined))
        );
      } catch {
        /* storage unavailable or full — offline just stays unavailable */
      }
    };

    if (document.readyState === "complete") void warm();
    else window.addEventListener("load", () => void warm(), { once: true });
  }, []);

  useEffect(() => {
    setDismissed(localStorage.getItem("wire-install-dismissed") === "1");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const close = () => {
    localStorage.setItem("wire-install-dismissed", "1");
    setDismissed(true);
  };

  const show = Boolean(deferred) && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-4 bottom-[92px] z-[95] mx-auto flex max-w-md items-center gap-3 rounded-[20px] border border-[var(--glass-border)] bg-surface-overlay px-4 py-3 shadow-lift backdrop-blur-xl"
          role="dialog"
          aria-label="Install IOL Wire"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon-192.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-[12px]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-ink">Add IOL Wire to your home screen</p>
            <p className="text-[11px] text-ink-dim">Opens fullscreen, works offline.</p>
          </div>
          <button
            onClick={install}
            className="flex shrink-0 items-center gap-1.5 rounded-pill bg-[var(--accent)] px-3.5 py-2 text-[12px] font-bold text-white"
          >
            <Download size={14} /> Install
          </button>
          <button
            onClick={close}
            aria-label="Dismiss"
            className="shrink-0 text-ink-dim"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
