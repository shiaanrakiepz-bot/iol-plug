"use client";

import { useEffect } from "react";
import { useSettings, useTint, ACCENTS, TEXT_SIZES } from "@/lib/store";
import { hexToSoft } from "@/lib/utils";

/**
 * Applies user customisation (theme, accent colour, text size, reduced
 * motion) to the document root so the whole app re-skins live.
 *
 * --tint is the colour every surface is mixed from. It follows the story
 * currently on screen and falls back to the accent everywhere else, which is
 * what makes the shell warm up and cool down as you swipe the feed.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettings((s) => s.theme);
  const accent = useSettings((s) => s.accent);
  const textSize = useSettings((s) => s.textSize);
  const reducedMotion = useSettings((s) => s.reducedMotion);
  const tint = useTint((s) => s.tint);

  const accentHex = ACCENTS.find((a) => a.id === accent)?.hex ?? "#E8192C";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("reduce-motion", reducedMotion);
    root.style.setProperty("--accent", accentHex);
    root.style.setProperty("--accent-soft", hexToSoft(accentHex));

    const size = TEXT_SIZES.find((t) => t.id === textSize) ?? TEXT_SIZES[1];
    root.style.setProperty("--text-scale", String(size.scale));
    root.style.setProperty("--afs", size.afs);
  }, [theme, accentHex, textSize, reducedMotion]);

  useEffect(() => {
    document.documentElement.style.setProperty("--tint", tint ?? accentHex);
  }, [tint, accentHex]);

  // Match the browser/status bar to whatever the shell is currently tinted to.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const surface = getComputedStyle(document.body).backgroundColor;
    if (surface) meta.setAttribute("content", surface);
  }, [tint, accentHex, theme]);

  return <>{children}</>;
}
