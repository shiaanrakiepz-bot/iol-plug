import type { Article, CategoryId } from "@/types";
import { ARTICLES, ARTICLE_MAP } from "@/data/articles";
import { CATEGORY_MAP } from "@/data/categories";
import type { GlyphName } from "@/components/icons/glyphs";

/**
 * "Your week on the Plug" — a recap built only from what the reader actually did.
 *
 * Two rules shape this file.
 *
 * One: no invented comparisons. A single-device prototype has no population to
 * rank anyone against, so there is no "you read more than 87% of users" here.
 * The only honest comparison available is against the same reader last week,
 * so that is the only one computed.
 *
 * Two: the framing is breadth and understanding, not volume. A recap that
 * leads with hours spent is a screenshot nobody wants to send, and for a news
 * brand it rewards the wrong thing.
 */

export interface WrappedWeek {
  /** ISO day of the first day counted, and the last. */
  from: string;
  to: string;
  storiesRead: number;
  /** Days the full daily set was finished. */
  daysCompleted: number;
  bestStreak: number;
  xpEarned: number;
  /** Category read most, with how many. */
  topTopic: { id: CategoryId; label: string; color: string; glyph: GlyphName; count: number } | null;
  /** The three next-biggest, for the spread. */
  runnersUp: { label: string; color: string; count: number }[];
  /** Stories outside the reader's chosen interests, and that as a share. */
  outsideCount: number;
  outsidePct: number;
  /** Stories off the international wire. */
  worldCount: number;
  /** Comprehension checks answered, and the share answered right. */
  checksTaken: number;
  checksPassed: number;
  accuracyPct: number | null;
  /** The single most-represented story's headline, for the share card. */
  headline: Article | null;
  /** Change against the previous seven days. Null when there is nothing to compare. */
  deltaStories: number | null;
  /** False when there is too little in the week to be worth showing. */
  ready: boolean;
}

const DAY = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** The last `n` ISO days, oldest first, ending on `end`. */
export function windowDays(n: number, end = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(iso(new Date(end.getTime() - i * DAY)));
  return out;
}

interface Source {
  dailyReads: Record<string, string[]>;
  daysCompleted: string[];
  quizPassed: string[];
  quizAttempted: string[];
  xpLog: { amount: number; at: number }[];
  streak: number;
  interests: CategoryId[];
}

export function buildWrapped(src: Source, end = new Date()): WrappedWeek {
  const days = windowDays(7, end);
  const prevDays = windowDays(7, new Date(end.getTime() - 7 * DAY));

  const idsIn = (range: string[]) =>
    range.flatMap((d) => src.dailyReads[d] ?? []);

  const ids = idsIn(days);
  const prevIds = idsIn(prevDays);

  const read = ids.map((id) => ARTICLE_MAP[id]).filter(Boolean) as Article[];

  /* topics */
  const counts = new Map<CategoryId, number>();
  for (const a of read) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  const toTopic = ([id, count]: [CategoryId, number]) => {
    const c = CATEGORY_MAP[id];
    return { id, label: c.label, color: c.color, glyph: c.glyph, count };
  };

  const topTopic = ranked.length ? toTopic(ranked[0]) : null;
  const runnersUp = ranked.slice(1, 4).map(([id, count]) => {
    const c = CATEGORY_MAP[id];
    return { label: c.label, color: c.color, count };
  });

  /* breadth: the number worth being proud of */
  const outside = read.filter(
    (a) => !src.interests.includes(a.category) && !src.interests.includes(a.section)
  );
  const worldCount = read.filter((a) => a.origin === "world").length;

  /* comprehension, counted only for stories read inside the window */
  const idSet = new Set(ids);
  const checksTaken = src.quizAttempted.filter((id) => idSet.has(id)).length;
  const checksPassed = src.quizPassed.filter((id) => idSet.has(id)).length;

  /* XP banked in the window */
  const since = end.getTime() - 7 * DAY;
  const xpEarned = src.xpLog
    .filter((e) => e.at >= since)
    .reduce((sum, e) => sum + e.amount, 0);

  const daysCompleted = src.daysCompleted.filter((d) => days.includes(d)).length;

  /*
   * The headline is the reader's top-topic story they actually opened, which
   * makes the share card about something real rather than a generic banner.
   */
  const headline =
    (topTopic && read.find((a) => a.category === topTopic.id)) ?? read[0] ?? null;

  return {
    from: days[0],
    to: days[days.length - 1],
    storiesRead: read.length,
    daysCompleted,
    bestStreak: src.streak,
    xpEarned,
    topTopic,
    runnersUp,
    outsideCount: outside.length,
    outsidePct: read.length ? Math.round((outside.length / read.length) * 100) : 0,
    worldCount,
    checksTaken,
    checksPassed,
    accuracyPct: checksTaken ? Math.round((checksPassed / checksTaken) * 100) : null,
    headline,
    deltaStories: prevIds.length ? read.length - prevIds.length : null,
    // Three is the floor at which a recap says anything. Below that it is a
    // page of zeroes, which is a worse experience than not offering it.
    ready: read.length >= 3,
  };
}

/** A one-line characterisation of the week, used as the share card's kicker. */
export function weekLabel(w: WrappedWeek): string {
  if (w.outsidePct >= 50) return "Explorer";
  if (w.accuracyPct !== null && w.accuracyPct >= 80 && w.checksTaken >= 3) return "Sharp";
  if (w.daysCompleted >= 6) return "Never missed";
  if (w.worldCount >= 3) return "Globalist";
  if (w.topTopic) return `${w.topTopic.label} head`;
  return "Getting started";
}

/** Formats the window as "18 – 24 Nov". */
export function weekRange(w: WrappedWeek): string {
  const f = new Date(w.from);
  const t = new Date(w.to);
  const fmt = (d: Date, withMonth: boolean) =>
    d.toLocaleDateString("en-ZA", { day: "numeric", ...(withMonth ? { month: "short" } : {}) });
  const sameMonth = f.getMonth() === t.getMonth();
  return `${fmt(f, !sameMonth)} – ${fmt(t, true)}`;
}

/** Total stories available, so "x of y" framings stay truthful. */
export const TOTAL_STORIES = ARTICLES.length;
