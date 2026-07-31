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

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
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
  emoji: string;
  articleIds: string[];
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  goal: number;
  metric: "reads" | "likes" | "saves" | "shares" | "streak" | "topics";
}
