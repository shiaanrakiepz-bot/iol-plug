/**
 * Creator accounts. Wire stories filed by a desk carry no author; clips posted
 * by a person do, and that person gets a profile you can open from the byline.
 */
export interface Account {
  /** URL-ish handle, shown as @handle */
  handle: string;
  name: string;
  initials: string;
  /** Avatar chip colour */
  color: string;
  bio: string;
  beat: string;
  followers: string;
  /** When true, nobody else can see this account's likes or playlists */
  private?: boolean;
  /** The signed-in user — their activity comes from the content store */
  isSelf?: boolean;
  /** Article ids this account has publicly liked (fictional, for other users) */
  likes?: string[];
  /** Public playlists (fictional, for other users) */
  playlists?: { name: string; articleIds: string[] }[];
}

export const ACCOUNTS: Account[] = [
  {
    handle: "shi-aan",
    name: "Shi-Aan",
    initials: "SA",
    color: "#E8192C",
    bio: "Cars, engines and the arguments they start. Usually filming something loud.",
    beat: "Motoring",
    followers: "12.4k",
    isSelf: true,
  },
  {
    handle: "zoe",
    name: "Zoe",
    initials: "Z",
    color: "#7CC4FF",
    bio: "Your dramatic weather correspondent. If the sky is doing something, I'm outside filming it.",
    beat: "Weather",
    followers: "48.1k",
    likes: ["ct", "pol", "pointduty"],
    playlists: [
      { name: "Cape storms", articleIds: ["storm", "ct"] },
      { name: "Golden hour", articleIds: ["ct", "burnout"] },
    ],
  },
  {
    handle: "leah",
    name: "Leah",
    initials: "L",
    color: "#FF8FB1",
    bio: "Wellness without the woo. Travel, burnout and the cost of both.",
    beat: "Lifestyle",
    followers: "31.7k",
    likes: ["health", "ct", "snkr"],
    playlists: [
      { name: "Soft life", articleIds: ["burnout", "health"] },
      { name: "Flights I keep opening", articleIds: ["burnout", "ct"] },
    ],
  },
  {
    handle: "shazia",
    name: "Shazia",
    initials: "S",
    color: "#6EE087",
    bio: "Collecting the funniest people in this country, one clip at a time.",
    beat: "Feel-good",
    followers: "76.3k",
    likes: ["pointduty", "music", "foot", "gaming"],
    playlists: [
      { name: "Made me laugh", articleIds: ["pointduty", "music"] },
      { name: "Only in SA", articleIds: ["pointduty", "ct", "snkr"] },
    ],
  },
];

export const ACCOUNT_MAP: Record<string, Account> = Object.fromEntries(
  ACCOUNTS.map((a) => [a.handle, a])
);

export function getAccount(handle: string | null | undefined): Account | undefined {
  return handle ? ACCOUNT_MAP[handle] : undefined;
}

export const SELF_HANDLE = "shi-aan";
