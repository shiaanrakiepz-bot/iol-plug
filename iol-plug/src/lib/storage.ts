"use client";

/**
 * Every localStorage key the app owns, in one place, plus the one-time
 * carry-over from the names it used when it shipped as "IOL Wire".
 *
 * Renaming the keys without moving the data would silently sign people out
 * and wipe their streak, so each legacy entry is copied across once and then
 * removed. The carry-over runs on import rather than inside a component,
 * because zustand's persist middleware reads localStorage while the store is
 * being created — a migration that ran any later would find the new key
 * already empty and conclude there was nothing to carry.
 */

export const SETTINGS_KEY = "iol-plug-settings";
export const CONTENT_KEY = "iol-plug-content";
/** The feed's first-run swipe hints. */
export const HINTS_KEY = "plug-hints-seen";
/** "Add to home screen" was dismissed; don't nag. */
export const INSTALL_DISMISSED_KEY = "plug-install-dismissed";

const LEGACY: [from: string, to: string][] = [
  ["iol-wire-settings", SETTINGS_KEY],
  ["iol-wire-content", CONTENT_KEY],
  ["wire-hints-seen", HINTS_KEY],
  ["wire-install-dismissed", INSTALL_DISMISSED_KEY],
];

function carryOverLegacyKeys() {
  if (typeof window === "undefined") return;
  for (const [from, to] of LEGACY) {
    try {
      const legacy = localStorage.getItem(from);
      if (legacy === null) continue;
      // Never overwrite: if this device has already run a build with the new
      // keys, the new data is the newer data and the old entry is debris.
      if (localStorage.getItem(to) === null) localStorage.setItem(to, legacy);
      localStorage.removeItem(from);
    } catch {
      // Private mode, or storage is full. Losing the carry-over costs the
      // reader their local history; throwing here would cost them the app.
    }
  }
}

carryOverLegacyKeys();
