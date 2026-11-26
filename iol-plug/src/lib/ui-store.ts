"use client";

import { create } from "zustand";
import type { CategoryId } from "@/types";
import type { GlyphName } from "@/components/icons/glyphs";

export type Tab = "foryou" | "build" | "explore" | "profile";

/**
 * What the feed is currently showing: the two personalised lanes, or any
 * single genre picked from the top tabs or the drawer.
 */
export type FeedLane = CategoryId | "foryou" | "following";
export type ProfilePage =
  | "main"
  | "liked"
  | "saved"
  | "history"
  | "playlists"
  | "downloads"
  | "achievements"
  | "settings"
  | "notifications"
  | "appearance"
  | "accessibility"
  | "privacy"
  | "account"
  | "brief"
  | "applications";

/**
 * Where the back chevron goes from each profile page — null on the root,
 * which has nothing to pop to.
 *
 * This lives here rather than on each screen because the chevron and the
 * edge-swipe gesture both need it, and when a screen kept its own answer the
 * two drifted: Privacy's chevron popped to the profile root while the
 * gesture popped to Settings.
 */
export function backTargetFor(page: ProfilePage): ProfilePage | null {
  if (page === "main") return null;
  switch (page) {
    case "notifications":
    case "appearance":
    case "accessibility":
    case "privacy":
    case "account":
      return "settings";
    default:
      return "main";
  }
}

interface ToastData {
  id: number;
  message: string;
  /** Drawn mark shown beside the message. */
  glyph?: GlyphName;
}

interface UIState {
  phase: "splash" | "onboarding" | "app";
  tab: Tab;
  feedGenre: FeedLane;
  readerId: string | null;
  videoId: string | null;
  contextId: string | null;
  playlistFor: string | null;
  shareFor: string | null;
  commentsFor: string | null;
  drawerOpen: boolean;
  /** Handle of the creator profile being viewed, if any */
  viewingAccount: string | null;
  profilePage: ProfilePage;
  playlistDetail: string | null;
  toast: ToastData | null;
  online: boolean;
  briefOpen: boolean;
  /** Opportunity whose detail sheet is open. */
  opportunityId: string | null;
  /** The compose sheet. Everything it produces goes to review, not to the feed. */
  createOpen: boolean;
  /** Staff-only moderation queue. Gated on `isReviewer` in the settings store. */
  adminOpen: boolean;
  /** Article whose comprehension check is open. */
  quizFor: string | null;
  /** The weekly recap deck. */
  wrappedOpen: boolean;
  setPhase: (p: UIState["phase"]) => void;
  setTab: (t: Tab) => void;
  setFeedGenre: (g: FeedLane) => void;
  openReader: (id: string | null) => void;
  openVideo: (id: string | null) => void;
  openContext: (id: string | null) => void;
  openPlaylist: (id: string | null) => void;
  openShare: (id: string | null) => void;
  openComments: (id: string | null) => void;
  setDrawer: (open: boolean) => void;
  viewAccount: (handle: string | null) => void;
  setProfilePage: (p: ProfilePage) => void;
  setPlaylistDetail: (id: string | null) => void;
  showToast: (message: string, glyph?: GlyphName) => void;
  setOnline: (v: boolean) => void;
  setBrief: (v: boolean) => void;
  openOpportunity: (id: string | null) => void;
  setCreate: (v: boolean) => void;
  setAdmin: (v: boolean) => void;
  openQuiz: (id: string | null) => void;
  setWrapped: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  phase: "splash",
  tab: "foryou",
  feedGenre: "foryou",
  readerId: null,
  videoId: null,
  contextId: null,
  playlistFor: null,
  shareFor: null,
  commentsFor: null,
  drawerOpen: false,
  viewingAccount: null,
  profilePage: "main",
  playlistDetail: null,
  toast: null,
  online: true,
  setPhase: (phase) => set({ phase }),
  setTab: (tab) => set({ tab, profilePage: "main", playlistDetail: null }),
  setFeedGenre: (feedGenre) => set({ feedGenre, drawerOpen: false }),
  openReader: (readerId) => set({ readerId }),
  openVideo: (videoId) => set({ videoId }),
  openContext: (contextId) => set({ contextId }),
  openPlaylist: (playlistFor) => set({ playlistFor }),
  openShare: (shareFor) => set({ shareFor }),
  openComments: (commentsFor) => set({ commentsFor }),
  setDrawer: (drawerOpen) => set({ drawerOpen }),
  viewAccount: (viewingAccount) => set({ viewingAccount }),
  setProfilePage: (profilePage) => set({ profilePage }),
  setPlaylistDetail: (playlistDetail) => set({ playlistDetail }),
  showToast: (message, glyph) =>
    set({ toast: { id: Date.now(), message, glyph } }),
  setOnline: (online) => set({ online }),
  briefOpen: false,
  setBrief: (briefOpen) => set({ briefOpen }),
  opportunityId: null,
  createOpen: false,
  adminOpen: false,
  openOpportunity: (opportunityId) => set({ opportunityId }),
  setCreate: (createOpen) => set({ createOpen }),
  setAdmin: (adminOpen) => set({ adminOpen }),
  quizFor: null,
  openQuiz: (quizFor) => set({ quizFor }),
  wrappedOpen: false,
  setWrapped: (wrappedOpen) => set({ wrappedOpen }),
}));
