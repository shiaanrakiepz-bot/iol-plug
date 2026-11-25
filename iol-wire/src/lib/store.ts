"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Application,
  ApplicationStatus,
  CategoryId,
  Playlist,
  Submission,
  SubmissionKind,
  Swipe,
  SwipeDirection,
  XpEvent,
  XpReason,
} from "@/types";
import type { GlyphName } from "@/components/icons/glyphs";

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
  /** Staff flag. Unlocks the moderation queue; a role claim once there is a backend. */
  isReviewer: boolean;
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
      isReviewer: false,
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
  /** Every career card thrown, so Saved/Interested are real and ranking can learn. */
  swipes: Swipe[];
  applications: Application[];
  /** Everything the user has uploaded. None of it is public until reviewed. */
  submissions: Submission[];
  /** Lifetime XP, and the last few events so the profile can show where it came from. */
  xp: number;
  xpLog: XpEvent[];
  /** Article ids answered correctly, so a check is only ever paid out once. */
  quizPassed: string[];
  quizAttempted: string[];
  /** ISO day -> article ids read that day. Drives the daily goal and missions. */
  dailyReads: Record<string, string[]>;
  /** ISO days on which the full daily set was completed. */
  daysCompleted: string[];
  /** Mission ids already claimed, so XP is not paid twice. */
  missionsClaimed: string[];
  /** Earned by completing a day; spends itself to protect a streak. */
  streakFreezes: number;
  stats: { reads: number; likes: number; saves: number; shares: number; streak: number };
  toggleLike: (id: string) => boolean;
  addHistory: (id: string) => void;
  toggleDownload: (id: string) => void;
  createPlaylist: (name: string, glyph: GlyphName, firstArticle?: string) => string;
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
  recordSwipe: (opportunityId: string, direction: SwipeDirection) => void;
  undoSwipe: () => string | null;
  clearSwipes: () => void;
  addXp: (amount: number, reason: XpReason) => void;
  answerQuiz: (articleId: string, correct: boolean) => void;
  claimMission: (missionId: string, xp: number) => void;
  apply: (opportunityId: string) => void;
  setApplicationStatus: (id: string, status: ApplicationStatus) => void;
  submit: (draft: {
    kind: SubmissionKind;
    title: string;
    body: string;
    mediaUrl?: string;
    mediaName?: string;
    author: string;
  }) => string;
  reviewSubmission: (id: string, approve: boolean, note?: string) => void;
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
  swipes: [] as Swipe[],
  applications: [] as Application[],
  submissions: [] as Submission[],
  xp: 0,
  xpLog: [] as XpEvent[],
  quizPassed: [] as string[],
  quizAttempted: [] as string[],
  dailyReads: {} as Record<string, string[]>,
  daysCompleted: [] as string[],
  missionsClaimed: [] as string[],
  streakFreezes: 0,
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
      /**
       * Reading is the one action that moves everything: history, XP, the
       * day's progress and — only once the day's set is finished — the streak.
       *
       * Tying the streak to completion rather than to opening the app is the
       * point. A streak you keep by launching the app and scrolling for five
       * seconds measures nothing, and quietly teaches people that the number
       * is the goal. This one can only be kept by finishing three stories.
       */
      addHistory: (id) =>
        set((s) => {
          const fresh = !s.history.includes(id);
          const day = new Date().toISOString().slice(0, 10);
          const readToday = s.dailyReads[day] ?? [];
          const alreadyToday = readToday.includes(id);
          const nextToday = alreadyToday ? readToday : [...readToday, id];

          // 3 is DAILY_GOAL in lib/progress; kept literal here so the store
          // has no import cycle back into data.
          const justCompleted =
            !alreadyToday &&
            nextToday.length >= 3 &&
            !s.daysCompleted.includes(day);

          let streak = s.stats.streak;
          if (justCompleted) {
            const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
            streak = s.daysCompleted.includes(yesterday) ? streak + 1 : 1;
          }

          const gained = (fresh ? 10 : 0) + (justCompleted ? 120 : 0);

          return {
            history: [id, ...s.history.filter((x) => x !== id)].slice(0, 100),
            dailyReads: { ...s.dailyReads, [day]: nextToday },
            daysCompleted: justCompleted ? [...s.daysCompleted, day] : s.daysCompleted,
            // A completed day banks a freeze, up to two, so one missed day
            // does not wipe weeks of work.
            streakFreezes: justCompleted
              ? Math.min(2, s.streakFreezes + 1)
              : s.streakFreezes,
            xp: s.xp + gained,
            xpLog: gained
              ? [
                  ...(justCompleted
                    ? [{ amount: 120, reason: "daily-goal" as XpReason, at: Date.now() }]
                    : []),
                  ...(fresh
                    ? [{ amount: 10, reason: "read" as XpReason, at: Date.now() }]
                    : []),
                  ...s.xpLog,
                ].slice(0, 40)
              : s.xpLog,
            stats: fresh
              ? { ...s.stats, reads: s.stats.reads + 1, streak }
              : { ...s.stats, streak },
          };
        }),
      toggleDownload: (id) =>
        set((s) => ({
          downloads: s.downloads.includes(id)
            ? s.downloads.filter((x) => x !== id)
            : [id, ...s.downloads],
        })),
      createPlaylist: (name, glyph, firstArticle) => {
        const id = `pl-${Date.now()}`;
        set((s) => ({
          playlists: [
            {
              id,
              name,
              glyph,
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

      /* ---- Build: the career swipe ---- */
      /**
       * One entry per card, newest first. Re-throwing a card replaces the old
       * verdict rather than stacking a second one, so the stack never shows a
       * card twice and "saved" counts stay truthful.
       */
      recordSwipe: (opportunityId, direction) =>
        set((s) => ({
          swipes: [
            { opportunityId, direction, at: Date.now() },
            ...s.swipes.filter((w) => w.opportunityId !== opportunityId),
          ],
          stats:
            direction === "down"
              ? { ...s.stats, saves: s.stats.saves + 1 }
              : s.stats,
        })),
      /** Put the most recent card back on top. Returns the id so the UI can say which. */
      undoSwipe: () => {
        const [last, ...rest] = get().swipes;
        if (!last) return null;
        set({ swipes: rest });
        return last.opportunityId;
      },
      clearSwipes: () => set({ swipes: [] }),

      /* ---- progression ---- */
      addXp: (amount, reason) =>
        set((s) => ({
          xp: s.xp + amount,
          xpLog: [{ amount, reason, at: Date.now() }, ...s.xpLog].slice(0, 40),
        })),

      /**
       * A check pays out once. Re-reading a story you already answered gives
       * nothing, so the way to earn is to read something new rather than to
       * farm the same article.
       */
      answerQuiz: (articleId, correct) =>
        set((s) => {
          if (s.quizPassed.includes(articleId)) return s;
          const first = !s.quizAttempted.includes(articleId);
          const amount = correct ? 30 : first ? 5 : 0;
          return {
            quizAttempted: first ? [articleId, ...s.quizAttempted] : s.quizAttempted,
            quizPassed: correct ? [articleId, ...s.quizPassed] : s.quizPassed,
            xp: s.xp + amount,
            xpLog: amount
              ? [
                  {
                    amount,
                    reason: "quiz-correct" as XpReason,
                    at: Date.now(),
                  },
                  ...s.xpLog,
                ].slice(0, 40)
              : s.xpLog,
          };
        }),

      claimMission: (missionId, xp) =>
        set((s) =>
          s.missionsClaimed.includes(missionId)
            ? s
            : {
                missionsClaimed: [missionId, ...s.missionsClaimed],
                xp: s.xp + xp,
                xpLog: [
                  { amount: xp, reason: "mission" as XpReason, at: Date.now() },
                  ...s.xpLog,
                ].slice(0, 40),
              }
        ),

      apply: (opportunityId) =>
        set((s) => {
          if (s.applications.some((a) => a.opportunityId === opportunityId)) return s;
          const now = Date.now();
          return {
            applications: [
              {
                id: `app-${now}`,
                opportunityId,
                status: "Applied" as ApplicationStatus,
                history: [{ status: "Applied" as ApplicationStatus, at: now }],
                updatedAt: now,
              },
              ...s.applications,
            ],
          };
        }),
      setApplicationStatus: (id, status) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status,
                  history: [...a.history, { status, at: Date.now() }],
                  updatedAt: Date.now(),
                }
              : a
          ),
        })),

      /* ---- Create: uploads go to review, never to the feed ---- */
      submit: (draft) => {
        const id = `sub-${Date.now()}`;
        set((s) => ({
          submissions: [
            { id, ...draft, status: "pending" as const, createdAt: Date.now() },
            ...s.submissions,
          ],
        }));
        return id;
      },
      reviewSubmission: (id, approve, note) =>
        set((s) => ({
          submissions: s.submissions.map((sub) =>
            sub.id === id
              ? {
                  ...sub,
                  status: approve ? ("approved" as const) : ("rejected" as const),
                  reviewedAt: Date.now(),
                  reviewNote: note,
                }
              : sub
          ),
        })),
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
