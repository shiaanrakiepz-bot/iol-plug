import type { Article, Mission, MissionKind } from "@/types";
import { ARTICLES } from "@/data/articles";

/* ============================================================
   XP and levels
   ============================================================ */

/**
 * XP per action. Reading is the floor; understanding pays roughly triple.
 *
 * That ratio is the whole argument. A points system that pays by the scroll
 * teaches people to scroll, and a newsroom that ships one has optimised for
 * the wrong thing. Getting the comprehension check right is the expensive
 * action here, so the fastest route up is to actually follow the story.
 */
export const XP = {
  read: 10,
  quizCorrect: 30,
  quizWrong: 5, // attempting still counts for something
  mission: 60,
  dailyGoal: 120,
} as const;

/** Rising cost per level: 100, 160, 220, 280 … */
export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 60;
}

/** Total XP needed to have reached the start of `level`. */
export function xpToReach(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i);
  return total;
}

export const RANKS = [
  "Fresh",
  "Scroller",
  "Reader",
  "Clued Up",
  "Sharp",
  "Plugged In",
  "Wire Head",
  "Switched On",
  "Oracle",
] as const;

export interface LevelState {
  level: number;
  rank: string;
  /** XP earned inside the current level. */
  into: number;
  /** XP the current level costs in total. */
  needed: number;
  /** 0-1, for the ring. */
  pct: number;
}

export function levelFromXp(xp: number): LevelState {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  const needed = xpForLevel(level);
  return {
    level,
    rank: RANKS[Math.min(level - 1, RANKS.length - 1)],
    into: remaining,
    needed,
    pct: needed ? remaining / needed : 0,
  };
}

/* ============================================================
   Daily set and missions
   ============================================================ */

/** Stable 32-bit hash, so a given day produces the same picks for everyone. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const dayKey = (d = new Date()): string => d.toISOString().slice(0, 10);

/**
 * The day's set: three stories, the same three for every reader.
 *
 * Bounded on purpose. An endless feed has no finish line, so there is never a
 * moment where you are done and can put the phone down — the streak just
 * measures how long you kept scrolling. Three stories can be completed, and a
 * thing you can complete is a thing you can feel good about leaving.
 */
export const DAILY_GOAL = 3;

export function dailySet(day = dayKey()): Article[] {
  const seed = hash(day);
  const pool = [...ARTICLES];
  const picks: Article[] = [];
  for (let i = 0; i < DAILY_GOAL && pool.length; i++) {
    // Mix the seed per slot so the three are unrelated to each other.
    const idx = (seed + i * 2654435761) % pool.length;
    picks.push(pool.splice(idx, 1)[0]);
  }
  return picks;
}

const MISSION_POOL: Omit<Mission, "id">[] = [
  {
    kind: "read-count",
    label: "Read 3 stories",
    hint: "Anything on the wire counts",
    goal: 3,
    xp: XP.mission,
  },
  {
    kind: "read-outside",
    label: "Read outside your topics",
    hint: "One story from a desk you don't follow",
    goal: 1,
    xp: XP.mission,
  },
  {
    kind: "read-world",
    label: "Read a world story",
    hint: "Something from off the international wire",
    goal: 1,
    xp: XP.mission,
  },
  {
    kind: "quiz-correct",
    label: "Pass two checks",
    hint: "Answer the question after a story correctly",
    goal: 2,
    xp: XP.mission + 20,
  },
  {
    kind: "save-one",
    label: "Save something for later",
    hint: "Swipe down on a card, or tap save",
    goal: 1,
    xp: XP.mission - 20,
  },
];

/**
 * Three missions a day, seeded by date.
 *
 * `read-outside` is here to do a job: a feed that only ever confirms what you
 * already picked narrows you over time. A quest that pays you to leave your
 * own bubble is the cheapest corrective a news app has.
 */
export function dailyMissions(day = dayKey()): Mission[] {
  const seed = hash("missions-" + day);
  const pool = [...MISSION_POOL];
  const out: Mission[] = [];
  for (let i = 0; i < 3 && pool.length; i++) {
    const idx = (seed + i * 40503) % pool.length;
    const m = pool.splice(idx, 1)[0];
    out.push({ ...m, id: `${day}-${m.kind}` });
  }
  return out;
}

export function missionProgress(
  kind: MissionKind,
  d: {
    reads: string[];
    quizCorrect: number;
    saves: number;
    interests: string[];
  }
): number {
  const read = d.reads.map((id) => ARTICLES.find((a) => a.id === id)).filter(Boolean) as Article[];
  switch (kind) {
    case "read-count":
      return read.length;
    case "read-outside":
      return read.filter(
        (a) => !d.interests.includes(a.category) && !d.interests.includes(a.section)
      ).length;
    case "read-world":
      return read.filter((a) => a.origin === "world").length;
    case "quiz-correct":
      return d.quizCorrect;
    case "save-one":
      return d.saves;
    default:
      return 0;
  }
}

/* ============================================================
   Celebration gate
   ============================================================ */

/**
 * Whether it is acceptable to throw confetti over this story.
 *
 * Firing particles because someone finished reading about a disaster is the
 * failure mode of gamified news, and it is the kind of thing that ends up in a
 * screenshot. Anything flagged sombre, or filed under crime, completes quietly.
 */
export function canCelebrate(a: Article | undefined): boolean {
  if (!a) return true;
  if (a.sombre) return false;
  return a.category !== "crime" && a.section !== "crime";
}
