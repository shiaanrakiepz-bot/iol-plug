import type { Category, CategoryId } from "@/types";

/**
 * Pastel topic palette from the design file. These colours do real work:
 * a story's category colour is what the whole shell gets tinted with while
 * that story is on screen, so they are all light enough to read black text
 * on and desaturated enough to mix into a background.
 */
export const CATEGORIES: Category[] = [
  { id: "breaking", label: "Breaking", emoji: "🚨", color: "#FF5A4E" },
  { id: "politics", label: "Politics", emoji: "🏛️", color: "#C9B6FF" },
  { id: "business", label: "Business", emoji: "📈", color: "#8FE6CF" },
  { id: "technology", label: "Technology", emoji: "💻", color: "#6FBFFF" },
  { id: "sport", label: "Sport", emoji: "🏆", color: "#6EE087" },
  { id: "football", label: "Football", emoji: "⚽", color: "#6EE087" },
  { id: "formula1", label: "Formula 1", emoji: "🏎️", color: "#FF6B5E" },
  { id: "basketball", label: "Basketball", emoji: "🏀", color: "#FFB35C" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬", color: "#FFD166" },
  { id: "gaming", label: "Gaming", emoji: "🎮", color: "#D9A0FF" },
  { id: "music", label: "Music", emoji: "🎧", color: "#FF8FB1" },
  { id: "cars", label: "Cars", emoji: "🚗", color: "#FFE45C" },
  { id: "ai", label: "AI", emoji: "🤖", color: "#A9B2FF" },
  { id: "finance", label: "Finance", emoji: "💸", color: "#7CE0B3" },
  { id: "crime", label: "Crime", emoji: "🚔", color: "#FF9E9E" },
  { id: "capetown", label: "Cape Town", emoji: "⛰️", color: "#FFC97C" },
  { id: "johannesburg", label: "Johannesburg", emoji: "🌆", color: "#FFE58A" },
  { id: "education", label: "Education", emoji: "🎓", color: "#B5EAD7" },
  { id: "lifestyle", label: "Lifestyle", emoji: "✨", color: "#F8C8DC" },
  { id: "fashion", label: "Fashion", emoji: "🧥", color: "#E3B8FF" },
  { id: "sneakers", label: "Sneakers", emoji: "👟", color: "#9EF0F0" },
  { id: "travel", label: "Travel", emoji: "✈️", color: "#8FD3FF" },
  { id: "health", label: "Health", emoji: "💚", color: "#A8F5C9" },
  { id: "science", label: "Science", emoji: "🔬", color: "#B0C4FF" },
  { id: "opinion", label: "Opinion", emoji: "💬", color: "#FF8FB1" },
  { id: "local", label: "Local", emoji: "📍", color: "#9EF0F0" },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

/** Topics shown during onboarding interest selection */
export const INTEREST_TOPICS: CategoryId[] = [
  "football",
  "basketball",
  "formula1",
  "politics",
  "technology",
  "gaming",
  "music",
  "entertainment",
  "cars",
  "business",
  "ai",
  "finance",
  "crime",
  "capetown",
  "johannesburg",
  "education",
  "lifestyle",
  "fashion",
  "sneakers",
  "travel",
  "health",
  "science",
];

/** Genres in the left drawer */
export const DRAWER_GENRES: CategoryId[] = [
  "breaking",
  "politics",
  "business",
  "technology",
  "sport",
  "entertainment",
  "gaming",
  "cars",
  "lifestyle",
  "science",
  "health",
  "capetown",
  "johannesburg",
  "opinion",
  "local",
];

/**
 * A story belongs to a genre if either its section or its own category
 * matches, so "Sport" catches the Formula 1 and basketball stories filed
 * under it without needing a hand-maintained expansion table.
 */
export function matchesGenre(
  article: { section: CategoryId; category: CategoryId },
  genre: CategoryId
): boolean {
  return article.section === genre || article.category === genre;
}

/** Quick-filter chips above the Explore grid */
export const EXPLORE_CHIPS = [
  "All",
  "Trending",
  "Breaking",
  "Sport",
  "Entertainment",
  "Technology",
  "AI",
  "Cars",
  "Gaming",
  "Music",
] as const;

export type ExploreChip = (typeof EXPLORE_CHIPS)[number];
