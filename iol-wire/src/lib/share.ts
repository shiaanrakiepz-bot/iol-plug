"use client";

import type { Article } from "@/types";

/**
 * Try the native share sheet first; fall back to the in-app glass sheet.
 * Returns true if the native sheet handled it.
 */
export async function nativeShare(article: Article): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: `https://iol.co.za/wire/${article.id}`,
      });
      return true;
    } catch (err) {
      // AbortError = user closed the sheet; treat as handled
      if (err instanceof Error && err.name === "AbortError") return true;
      return false;
    }
  }
  return false;
}
