"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CategoryId, Playlist } from "@/types";

/* ------------------------------------------------------------------ */
/* Accent palette the user can pick from in Settings → Appearance      */
/* ------------------------------------------------------------------ */
export const ACCENTS = [
  { id: "iol-red", label: "IOL Red", hex: "#E8192C" },
  { id: "flare", label: "Flare", hex: "#FF5A4E" },
  { id: "ocean", label: "Ocean", hex: "#7CC4FF" },
  { id: "violet", label: "Violet", hex: "#D19BFF" },
  { id: "mint", label: "Mint", hex: "#7CE0B3" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

/** Article body sizes, keyed the way the design labels them. */
export const TEXT_SIZES = [
  { id: "S", scale: 0.92, afs: "13px" },
  { id: "M", scale: 1, afs: "14.5px" },
  { id: "L", scale: 1.14, afs: "16.5px" },
] as const;

export type TextSizeId = (typeof TEXT_SIZES)[number]["id"];

export const LANGUAGES = [
  "English",
  "isiZulu",
  "isiXhosa",
  "Afrikaans",
  "Sepedi",
  "Setswana",
  "Sesotho",
] as const;

export interface UserProfile {
  name: string;
  email: string;
  method: "google" | "apple" | "email" | "guest";
}

interface SettingsState {
  hydrated: boolean;
  hasOnboarded: boolean;
  user: UserProfile | null;
  interests: CategoryId[];
  theme: "dark" | "light";
  accent: AccentId;
  language: (typeof LANGUAGES)[number];
  dataSaver: boolean;
  reducedMotion: boolean;
  textSize: TextSizeId;
  autoplayVideos: boolean;
  captions: boolean;
  videoQuality: "auto" | "high" | "low";
  /** Rank the feed using on-device activity */
  personalisedFeed: boolean;
  /** Send anonymous usage data */
  shareAnalytics: boolean;
  /** Hide your likes and playlists from anyone viewing your profile */
  privateProfile: boolean;
  notifications: {
    breaking: boolean;
    dailyBrief: boolean;
    followedTopics: boolean;
    trending: boolean;
  };
  setHydrated: () => void;
  completeOnboarding: (user: UserProfile, interests: CategoryId[]) => void;
  setInterests: (interests: CategoryId[]) => void;
  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  setNotification: (
    key: keyof SettingsState["notifications"],
    value: boolean
  ) => void;
  signOut: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      hydrated: false,
      hasOnboarded: false,
      user: null,
      interests: [],
      theme: "dark",
      accent: "iol-red",
      language: "English",
      dataSaver: false,
      reducedMotion: false,
      textSize: "M",
      autoplayVideos: true,
      captions: true,
      videoQuality: "auto",
      personalisedFeed: true,
      shareAnalytics: false,
      privateProfile: false,
      notifications: {
        breaking: true,
        dailyBrief: true,
        followedTopics: true,
        trending: false,
      },
      setHydrated: () => set({ hydrated: true }),
      completeOnboarding: (user, interests) =>
        set({ hasOnboarded: true, user, interests }),
      setInterests: (interests) => set({ interests }),
      set: (key, value) => set({ [key]: value } as Partial<SettingsState>),
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
      signOut: () =>
        set({ hasOnboarded: false, user: null, interests: [] }),
    }),
    {
      name: "iol-wire-settings",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
      partialize: (s) => {
        const { hydrated: _h, ...rest } = s;
        return rest;
      },
    }
  )
);

/* ------------------------------------------------------------------ */
/* Live surface tint                                                   */
/* ------------------------------------------------------------------ */
/**
 * The colour every surface is mixed from. The feed sets it to the current
 * story's category colour; everything else clears it back to the accent.
 * Deliberately not persisted — it is a property of what is on screen.
 */
interface TintState {
  tint: string | null;
  setTint: (tint: string | null) => void;
}

export const useTint = create<TintState>((set) => ({
  tint: null,
  setTint: (tint) => set((s) => (s.tint === tint ? s : { tint })),
}));

/* ------------------------------------------------------------------ */
/* Content interactions                                                */
/* ------------------------------------------------------------------ */
export interface UserComment {
  id: string;
  articleId: string;
  text: string;
  createdAt: number;
}

interface ContentState {
  liked: string[];
  history: string[];
  downloads: string[];
  playlists: Playlist[];
  followedTopics: CategoryId[];
  notInterested: string[];
  readLater: string[];
  reported: string[];
  myComments: UserComment[];
  stats: { reads: number; likes: number; saves: number; shares: number; streak: number };
  toggleLike: (id: string) => boolean;
  addHistory: (id: string) => void;
  toggleDownload: (id: string) => void;
  createPlaylist: (name: string, emoji: string, firstArticle?: string) => string;
  addToPlaylist: (playlistId: string, articleId: string) => void;
  removeFromPlaylist: (playlistId: string, articleId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  toggleFollowTopic: (topic: CategoryId) => void;
  markNotInterested: (id: string) => void;
  toggleReadLater: (id: string) => void;
  reportArticle: (id: string) => void;
  addComment: (articleId: string, text: string) => void;
  bumpShares: () => void;
  clearHistory: () => void;
  resetAll: () => void;
}

const emptyContent = {
  liked: [] as string[],
  history: [] as string[],
  downloads: [] as string[],
  playlists: [] as Playlist[],
  followedTopics: [] as CategoryId[],
  notInterested: [] as string[],
  readLater: [] as string[],
  reported: [] as string[],
  myComments: [] as UserComment[],
  stats: { reads: 0, likes: 0, saves: 0, shares: 0, streak: 1 },
};

export const useContent = create<ContentState>()(
  persist(
    (set, get) => ({
      ...emptyContent,
      toggleLike: (id) => {
        const liked = get().liked;
        const nowLiked = !liked.includes(id);
        set((s) => ({
          liked: nowLiked ? [id, ...s.liked] : s.liked.filter((x) => x !== id),
          stats: nowLiked
            ? { ...s.stats, likes: s.stats.likes + 1 }
            : s.stats,
        }));
        return nowLiked;
      },
      addHistory: (id) =>
        set((s) => ({
          history: [id, ...s.history.filter((x) => x !== id)].slice(0, 100),
          stats: s.history.includes(id)
            ? s.stats
            : { ...s.stats, reads: s.stats.reads + 1 },
        })),
      toggleDownload: (id) =>
        set((s) => ({
          downloads: s.downloads.includes(id)
            ? s.downloads.filter((x) => x !== id)
            : [id, ...s.downloads],
        })),
      createPlaylist: (name, emoji, firstArticle) => {
        const id = `pl-${Date.now()}`;
        set((s) => ({
          playlists: [
            {
              id,
              name,
              emoji,
              articleIds: firstArticle ? [firstArticle] : [],
              createdAt: Date.now(),
            },
            ...s.playlists,
          ],
          stats: firstArticle
            ? { ...s.stats, saves: s.stats.saves + 1 }
            : s.stats,
        }));
        return id;
      },
      addToPlaylist: (playlistId, articleId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId && !p.articleIds.includes(articleId)
              ? { ...p, articleIds: [articleId, ...p.articleIds] }
              : p
          ),
          stats: { ...s.stats, saves: s.stats.saves + 1 },
        })),
      removeFromPlaylist: (playlistId, articleId) =>
        set((s) => ({
          playlists: s.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, articleIds: p.articleIds.filter((x) => x !== articleId) }
              : p
          ),
        })),
      deletePlaylist: (playlistId) =>
        set((s) => ({
          playlists: s.playlists.filter((p) => p.id !== playlistId),
        })),
      toggleFollowTopic: (topic) =>
        set((s) => ({
          followedTopics: s.followedTopics.includes(topic)
            ? s.followedTopics.filter((t) => t !== topic)
            : [...s.followedTopics, topic],
        })),
      markNotInterested: (id) =>
        set((s) => ({ notInterested: [...s.notInterested, id] })),
      toggleReadLater: (id) =>
        set((s) => ({
          readLater: s.readLater.includes(id)
            ? s.readLater.filter((x) => x !== id)
            : [id, ...s.readLater],
        })),
      reportArticle: (id) =>
        set((s) => ({ reported: [...new Set([...s.reported, id])] })),
      addComment: (articleId, text) =>
        set((s) => ({
          myComments: [
            { id: `mc-${Date.now()}`, articleId, text, createdAt: Date.now() },
            ...s.myComments,
          ],
        })),
      bumpShares: () =>
        set((s) => ({ stats: { ...s.stats, shares: s.stats.shares + 1 } })),
      clearHistory: () => set({ history: [] }),
      resetAll: () => set({ ...emptyContent }),
    }),
    {
      name: "iol-wire-content",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** All article ids saved in any playlist */
export function savedIds(playlists: Playlist[]): string[] {
  return [...new Set(playlists.flatMap((p) => p.articleIds))];
}
