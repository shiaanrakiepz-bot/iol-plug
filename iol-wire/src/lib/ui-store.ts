"use client";

import { create } from "zustand";
import type { CategoryId } from "@/types";

export type Tab = "explore" | "foryou" | "profile";

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
  | "brief";

interface ToastData {
  id: number;
  message: string;
  emoji?: string;
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
  showToast: (message: string, emoji?: string) => void;
  setOnline: (v: boolean) => void;
  setBrief: (v: boolean) => void;
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
  showToast: (message, emoji) =>
    set({ toast: { id: Date.now(), message, emoji } }),
  setOnline: (online) => set({ online }),
  briefOpen: false,
  setBrief: (briefOpen) => set({ briefOpen }),
}));
