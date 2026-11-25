import type { Category, CategoryId } from "@/types";

/**
 * Pastel topic palette from the design file. These colours do real work:
 * a story's category colour is what the whole shell gets tinted with while
 * that story is on screen, so they are all light enough to read black text
 * on and desaturated enough to mix into a background.
 */
export const CATEGORIES: Category[] = [
  { id: "breaking", label: "Breaking", glyph: "breaking", color: "#FF5A4E" },
  { id: "politics", label: "Politics", glyph: "politics", color: "#C9B6FF" },
  { id: "business", label: "Business", glyph: "business", color: "#8FE6CF" },
  { id: "technology", label: "Technology", glyph: "technology", color: "#6FBFFF" },
  { id: "sport", label: "Sport", glyph: "trophy", color: "#6EE087" },
  { id: "football", label: "Football", glyph: "football", color: "#6EE087" },
  { id: "formula1", label: "Formula 1", glyph: "formula1", color: "#FF6B5E" },
  { id: "basketball", label: "Basketball", glyph: "basketball", color: "#FFB35C" },
  { id: "entertainment", label: "Entertainment", glyph: "entertainment", color: "#FFD166" },
  { id: "gaming", label: "Gaming", glyph: "gaming", color: "#D9A0FF" },
  { id: "music", label: "Music", glyph: "sound", color: "#FF8FB1" },
  { id: "cars", label: "Cars", glyph: "cars", color: "#FFE45C" },
  { id: "ai", label: "AI", glyph: "ai", color: "#A9B2FF" },
  { id: "finance", label: "Finance", glyph: "finance", color: "#7CE0B3" },
  { id: "crime", label: "Crime", glyph: "crime", color: "#FF9E9E" },
  { id: "capetown", label: "Cape Town", glyph: "capetown", color: "#FFC97C" },
  { id: "johannesburg", label: "Johannesburg", glyph: "johannesburg", color: "#FFE58A" },
  { id: "education", label: "Education", glyph: "education", color: "#B5EAD7" },
  { id: "lifestyle", label: "Lifestyle", glyph: "lifestyle", color: "#F8C8DC" },
  { id: "fashion", label: "Fashion", glyph: "fashion", color: "#E3B8FF" },
  { id: "sneakers", label: "Sneakers", glyph: "sneakers", color: "#9EF0F0" },
  { id: "travel", label: "Travel", glyph: "travel", color: "#8FD3FF" },
  { id: "health", label: "Health", glyph: "health", color: "#A8F5C9" },
  { id: "science", label: "Science", glyph: "science", color: "#B0C4FF" },
  { id: "opinion", label: "Opinion", glyph: "opinion", color: "#FF8FB1" },
  { id: "local", label: "Local", glyph: "local", color: "#9EF0F0" },
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
