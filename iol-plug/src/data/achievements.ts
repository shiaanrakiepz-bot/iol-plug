import type { Achievement } from "@/types";

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-read", title: "First Scroll", description: "Read your first story", glyph: "page", goal: 1, metric: "reads" },
  { id: "reader-10", title: "Informed", description: "Read 10 stories", glyph: "brain", goal: 10, metric: "reads" },
  { id: "reader-50", title: "News Junkie", description: "Read 50 stories", glyph: "flame", goal: 50, metric: "reads" },
  { id: "first-like", title: "Heart Starter", description: "Like your first story", glyph: "heart", goal: 1, metric: "likes" },
  { id: "liker-25", title: "Tastemaker", description: "Like 25 stories", glyph: "heartPlus", goal: 25, metric: "likes" },
  { id: "first-save", title: "Curator", description: "Save a story to a playlist", glyph: "pin", goal: 1, metric: "saves" },
  { id: "saver-15", title: "The Archivist", description: "Save 15 stories", glyph: "archive", goal: 15, metric: "saves" },
  { id: "first-share", title: "Spread the Word", description: "Share your first story", glyph: "megaphone", goal: 1, metric: "shares" },
  { id: "sharer-10", title: "The Plug", description: "Share 10 stories", glyph: "plug", goal: 10, metric: "shares" },
  { id: "streak-3", title: "Warming Up", description: "3-day reading streak", glyph: "bolt", goal: 3, metric: "streak" },
  { id: "streak-7", title: "Locked In", description: "7-day reading streak", glyph: "trophy", goal: 7, metric: "streak" },
  { id: "topics-5", title: "Wide Angle", description: "Follow 5 topics", glyph: "globe", goal: 5, metric: "topics" },
];
