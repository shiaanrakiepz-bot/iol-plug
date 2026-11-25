export type CategoryId =
  | "breaking"
  | "politics"
  | "business"
  | "technology"
  | "sport"
  | "football"
  | "formula1"
  | "basketball"
  | "entertainment"
  | "gaming"
  | "music"
  | "cars"
  | "ai"
  | "finance"
  | "crime"
  | "capetown"
  | "johannesburg"
  | "education"
  | "lifestyle"
  | "fashion"
  | "sneakers"
  | "travel"
  | "health"
  | "science"
  | "opinion"
  | "local";

import type { GlyphName } from "@/components/icons/glyphs";

export interface Category {
  id: CategoryId;
  label: string;
  /** Hand-drawn mark. Emoji are rendered by the OS and belong to no brand. */
  glyph: GlyphName;
  color: string; // hex accent for the category
}

/** One dot on a story's "The story so far" rail. */
export interface TimelineEvent {
  /** Year or "TODAY" */
  label: string;
  text: string;
}

export interface Comment {
  id: string;
  author: string;
  /** Two-letter avatar chip */
  initials: string;
  /** Avatar chip background */
  color: string;
  text: string;
  likes: number;
  timeAgo: string;
}

export interface Article {
  id: string;
  type: "article" | "video";
  title: string;
  summary: string;
  body: string[]; // paragraphs
  /** Drawer genre this story files under, e.g. "sport" */
  section: CategoryId;
  /** Chip shown on the card, e.g. "formula1" */
  category: CategoryId;
  source: string;
  /** Defaults to "iol" when absent. "world" suppresses every outbound link. */
  origin?: Origin;
  /** Handle of the creator who posted this, when it isn't a desk story */
  author?: string;
  publishedAt: string; // e.g. "12m"
  /** Pre-formatted, since videos read "0:42 watch" and articles "2 min read" */
  readLabel: string;
  /** Display count, e.g. "12.4k" */
  likes: string;
  imageSeed: string; // picsum seed, used when `image` is absent
  /** Local poster served from /public, e.g. "/stories/foo.png" */
  image?: string;
  videoUrl?: string;
  /** Duration badge on video cards, e.g. "0:42" */
  duration?: string;
  /**
   * Keep the poster on the feed card instead of autoplaying, so a designed
   * thumbnail is what people actually see. Press and hold still previews.
   */
  posterFirst?: boolean;
  /** Caption line shown over the video player */
  caption?: string;
  /** Suppresses celebration effects. Set on grief, disaster and crime. */
  sombre?: boolean;
  trending?: boolean;
  breaking?: boolean;
  factChecked?: boolean;
  tldr: string[]; // exactly 3 sentences
  explain: string; // simplified explanation
  whyItMatters: string;
  timeline?: TimelineEvent[];
  comments: Comment[];
}

export interface Playlist {
  id: string;
  name: string;
  glyph: GlyphName;
  articleIds: string[];
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  glyph: GlyphName;
  goal: number;
  metric: "reads" | "likes" | "saves" | "shares" | "streak" | "topics";
}

/* ============================================================
   Content origin
   ============================================================ */

/**
 * Where a story came from.
 *
 * `iol`   — IOL's own journalism. The reader may link out to iol.co.za,
 *           because that traffic is ours and we want it.
 * `world` — scraped from international outlets by the wire crawler. These are
 *           summary-only: the reader shows no "continue reading" and links
 *           nowhere, because sending our readers to someone else's site is the
 *           one thing this feed must never do. Enforced in `article-reader`
 *           and `story-card`, not left to the content editor to remember.
 */
export type Origin = "iol" | "world";

/** A wire source the crawler pulls from. */
export interface WireSource {
  id: string;
  /** Display name shown on the card byline, e.g. "Reuters" */
  name: string;
  /** Country or region the outlet publishes from */
  region: string;
  origin: Origin;
}

/* ============================================================
   Build — opportunities and the career swipe
   ============================================================ */

export type OpportunityType =
  | "Job"
  | "Internship"
  | "Learnership"
  | "Bursary"
  | "Course"
  | "Competition";

/** Which way a card was thrown, and what that means. */
export type SwipeDirection = "right" | "left" | "up" | "down";

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  org: string;
  /** City, or "Remote" */
  location: string;
  remote: boolean;
  /** Short qualifier shown under the org, e.g. "Matric + portfolio" */
  tag: string;
  blurb: string;
  imageSeed: string;
  image?: string;
  /** ISO date. Drives the real countdown, not a hard-coded string. */
  closesAt: string;
  /** Pay or stipend, already formatted. Absent when unpaid or undisclosed. */
  stipend?: string;
  skills: string[];
  about: string;
  requirements: string[];
  benefits: string[];
  /**
   * An employer that IOL has checked. Unverified listings carry a warning,
   * because fake job ads aimed at young South Africans are a real problem and
   * the IOL brand is on the line.
   */
  verified: boolean;
  /** How applying works. External listings leave the app deliberately. */
  applyMethod: "in-app" | "external";
  applyUrl?: string;
}

/** A card the user threw, kept so ranking can learn and Saved/Interested are real. */
export interface Swipe {
  opportunityId: string;
  direction: SwipeDirection;
  at: number;
}

export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Interviewing"
  | "Accepted"
  | "Rejected";

export interface Application {
  id: string;
  opportunityId: string;
  status: ApplicationStatus;
  /** Every status change, newest last, so the tracker can show history. */
  history: { status: ApplicationStatus; at: number }[];
  updatedAt: number;
}

/* ============================================================
   Create — everything a user makes enters review, never the feed
   ============================================================ */

export type SubmissionKind = "reel" | "take" | "event";

export type SubmissionStatus = "pending" | "approved" | "rejected";

/**
 * A user upload.
 *
 * Nothing here reaches the feed on its own. Every submission lands in the
 * moderation queue at `status: "pending"` and only a reviewer can move it.
 * This is a hard product rule, not a nicety: an un-reviewed upload pipe on a
 * news brand is how revenge porn and defamation get published under the
 * masthead, and it has happened to IOL before.
 */
export interface Submission {
  id: string;
  kind: SubmissionKind;
  title: string;
  body: string;
  /** Local object URL in the prototype; a Storage key once a backend exists. */
  mediaUrl?: string;
  mediaName?: string;
  /** Handle of the author */
  author: string;
  status: SubmissionStatus;
  createdAt: number;
  reviewedAt?: number;
  /** Required when rejected, so the author is always told why. */
  reviewNote?: string;
}

/* ============================================================
   Comprehension checks
   ============================================================ */

/**
 * A single question asked after a story.
 *
 * The point is not a score for its own sake. Volume badges reward scrolling;
 * this rewards having actually taken the story in, which is the only metric a
 * newsroom should be proud of optimising.
 */
export interface Quiz {
  /** Article this belongs to. */
  articleId: string;
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Shown after answering, right or wrong. Always teaches something. */
  because: string;
}

/* ============================================================
   Progression
   ============================================================ */

/** Where a chunk of XP came from, so the ledger can be explained. */
export type XpReason =
  | "read"
  | "quiz-correct"
  | "mission"
  | "daily-goal"
  | "streak";

export interface XpEvent {
  amount: number;
  reason: XpReason;
  at: number;
}

export type MissionKind =
  | "read-count"
  | "read-outside"
  | "read-world"
  | "quiz-correct"
  | "save-one";

/**
 * A daily objective. Seeded from the date so every reader gets the same three
 * on the same day, which makes them worth talking about.
 */
export interface Mission {
  id: string;
  kind: MissionKind;
  label: string;
  hint: string;
  goal: number;
  xp: number;
}
