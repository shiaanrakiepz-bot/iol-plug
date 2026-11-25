/**
 * The Plug glyph set.
 *
 * Hand-drawn rather than emoji. Emoji are rendered by the operating system, so
 * the same story looks different on an iPhone, a Samsung and a browser — and
 * none of those renderings belong to the brand. They also carry a tone this
 * product does not always want: a siren mark on a story about a shooting reads as
 * excitement.
 *
 * One grid, one weight: 24×24, 1.8 stroke, round caps and joins, no fills
 * except where a solid form is the point. They sit beside lucide without a
 * seam, because lucide already carries the interface icons.
 *
 * A couple are deliberately local. Cape Town is Table Mountain's flat top
 * rather than a generic peak, and Johannesburg is the Hillbrow silhouette.
 */

export type GlyphName =
  | "breaking" | "politics" | "business" | "technology" | "sport" | "football"
  | "formula1" | "basketball" | "entertainment" | "gaming" | "music" | "cars"
  | "ai" | "finance" | "crime" | "capetown" | "johannesburg" | "education"
  | "lifestyle" | "fashion" | "sneakers" | "travel" | "health" | "science"
  | "opinion" | "local"
  | "page" | "brain" | "flame" | "heart" | "heartPlus" | "pin" | "archive"
  | "megaphone" | "plug" | "bolt" | "trophy" | "globe"
  | "check" | "cross" | "clock" | "shield" | "spark" | "link" | "trash"
  | "wave" | "target" | "lock"
  | "download" | "flag" | "mail" | "undo" | "alert" | "pencil" | "star" | "sound";

/** Stroke geometry, in a 24 grid. */
const P: Record<GlyphName, string> = {
  /* ---- desks ---- */
  // a broadcast pulse: the wire carrying something urgent
  breaking: "M12 9v6 M8.3 7.2a6.5 6.5 0 0 0 0 9.6 M15.7 7.2a6.5 6.5 0 0 1 0 9.6 M5.4 4.4a10.5 10.5 0 0 0 0 15.2 M18.6 4.4a10.5 10.5 0 0 1 0 15.2",
  politics: "M4 20h16 M5 20v-8 M9.5 20v-8 M14.5 20v-8 M19 20v-8 M3 10l9-5 9 5z",
  business: "M4 20h16 M7 20v-6 M12 20V9 M17 20v-9 M14.5 5.5h4v4",
  technology: "M8 8h8v8H8z M4 10h4 M4 14h4 M16 10h4 M16 14h4 M10 4v4 M14 4v4 M10 16v4 M14 16v4",
  sport: "M7 4h10v5a5 5 0 0 1-10 0z M7 5H4.5a2.5 2.5 0 0 0 0 5H7 M17 5h2.5a2.5 2.5 0 0 1 0 5H17 M12 14v3 M8.5 20h7",
  football: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 8l3.6 2.6-1.4 4.2H9.8l-1.4-4.2z M12 3v5 M20.5 10.2l-4.9.4 M3.5 10.2l4.9.4 M8.6 20.4l1.2-5.6 M15.4 20.4l-1.2-5.6",
  formula1: "M5 21V4 M5 5h7l-1 3h7l-1 3H5 M5 11h7l-1 3h7",
  basketball: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 3v18 M3.2 12h17.6 M5.6 5.6c3.6 1.7 5.9 4.2 6.4 6.4 M18.4 5.6c-3.6 1.7-5.9 4.2-6.4 6.4",
  entertainment: "M3 9h18v11H3z M3 9l2.5-4.5 M9 9l2.5-4.5 M15 9l2.5-4.5 M21 7.5l-1.2-2.2L4 4l-1 5",
  gaming: "M7.5 8h9a5 5 0 0 1 5 5.2c-.2 3-1.6 4.8-3.3 4.8-1.5 0-2-1.2-4-1.2h-4.4c-2 0-2.5 1.2-4 1.2-1.7 0-3.1-1.8-3.3-4.8A5 5 0 0 1 7.5 8z M7.5 11.5v3 M6 13h3 M15.5 12.5h.01 M17.8 14.5h.01",
  // a waveform rather than a quaver: this is amapiano, not sheet music
  music: "M4 11v2 M7.5 8.5v7 M11 5.5v13 M14.5 9v6 M18 11v2 M21 12h.01",
  cars: "M4 16v2.5 M20 16v2.5 M3 16v-3.2L5 8h14l2 4.8V16z M3 16h18 M6.5 12.8h2 M15.5 12.8h2 M6 8l.8-2.5h10.4L18 8",
  ai: "M5 7.15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5 M5 14.35a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5 M12 4.35a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5 M12 10.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5 M12 17.15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5 M19 10.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5 M6.2 7.9l4.6-1.5 M6.2 9.3l4.7 2.1 M6.2 15.1l4.7-2.1 M6.2 16.1l4.6 1.5 M13.2 6.3l4.7 4.6 M13.3 12h4.4 M13.2 17.7l4.7-4.6",
  finance: "M3 7h18v10H3z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M6.5 10v4 M17.5 10v4",
  // restraint on purpose: crime stories do not get a siren
  crime: "M12 3l7.5 3v6c0 4.2-3 7.6-7.5 9-4.5-1.4-7.5-4.8-7.5-9V6z M9.5 12.5l5-5 M9.5 7.5l5 5",
  // Table Mountain: the flat top is the whole identity
  capetown: "M2.5 19h19 M4 19l3.5-6.5h9L20 19 M7.5 12.5h9 M9 12.5l1.8-3.2h2.4l1.8 3.2",
  johannesburg: "M3 20h18 M5 20V11h4v9 M11 20V5h3.5v15 M16.5 20v-6H20v6 M12.75 5V2.5 M6 8h2 M12.2 8.5h1.8 M12.2 12h1.8",
  education: "M2.5 9L12 5l9.5 4L12 13z M6.5 11v4.5c0 1.4 2.6 2.5 5.5 2.5s5.5-1.1 5.5-2.5V11 M20.5 9.5v4.5",
  lifestyle: "M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6L5.5 10l4.6-1.9z M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z",
  fashion: "M12 3.5a2 2 0 0 0-1 3.7L3.5 13c-.9.5-.6 1.8.5 1.8h16c1.1 0 1.4-1.3.5-1.8L13 7.2a2 2 0 0 0-1-3.7z M4 16.5h16",
  sneakers: "M3 16.8h13.2c2.1 0 4.8-.5 4.8-2.4 0-1.5-1.4-2.1-3.1-2.5l-3.4-.8-3-2.9H7.7l-.3 3.3L3 13.2z M3 16.8V19h18v-2.2 M8.4 10.4l1.9 2 M11.2 11.2l1.7 1.8",
  travel: "M2.5 13.5l19-6.5-3 6.5 3 6.5-19-6.5z M8.5 11.5l3.5 2 M12 4.5L9 9",
  health: "M3 12.5h3.5l1.5-3 2.5 6 2-4.5 1.5 1.5H21 M20.3 9.3a4.3 4.3 0 0 0-7.3-2.2l-1 1-1-1A4.3 4.3 0 0 0 3.7 9.3 M3.9 14c1.3 3 5 5.4 8.1 7 3.1-1.6 6.8-4 8.1-7",
  science: "M9.5 3v6.2L4.8 17c-.8 1.4.2 3 1.8 3h10.8c1.6 0 2.6-1.6 1.8-3L14.5 9.2V3 M8 3h8 M7.6 14h8.8",
  opinion: "M4 5h16v11H9l-5 4z M8.5 9.5c0 1 .8 1.6 1.6 1.6 M8.5 9.5c0-.8.7-1.5 1.5-1.5 M14 9.5c0 1 .8 1.6 1.6 1.6 M14 9.5c0-.8.7-1.5 1.5-1.5",
  local: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",

  /* ---- achievements ---- */
  page: "M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 15.5h6 M9 8.5h2.5",
  brain: "M12 9.8a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4 M6.2 6.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4 M17.8 6.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4 M6.2 14.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4 M17.8 14.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4 M10.3 10.8L7.7 9.1 M13.7 10.8l2.6-1.7 M10.3 13.2l-2.6 1.7 M13.7 13.2l2.6 1.7",
  flame: "M12 3c3.5 4 5.5 6.3 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 9.3 8.5 7 12 3z M12 20a2.8 2.8 0 0 0 2.8-2.8c0-1.6-1-2.6-2.8-4.4-1.8 1.8-2.8 2.8-2.8 4.4A2.8 2.8 0 0 0 12 20z",
  heart: "M12 20.5C6.5 17 3 13.8 3 10a4.5 4.5 0 0 1 9-1.4A4.5 4.5 0 0 1 21 10c0 3.8-3.5 7-9 10.5z",
  heartPlus: "M12 20.5C6.5 17 3 13.8 3 10a4.5 4.5 0 0 1 9-1.4A4.5 4.5 0 0 1 21 10c0 3.8-3.5 7-9 10.5z M12 10v4 M10 12h4",
  pin: "M12 21v-6 M8 4h8 M9 4v5l-2.5 3.5h11L15 9V4",
  archive: "M3 6h18v4H3z M5 10v10h14V10 M9.5 14h5",
  megaphone: "M4 10v4a1 1 0 0 0 1 1h2l9 4.5V5.5L7 10H5a1 1 0 0 0-1 1z M19 9.5a4 4 0 0 1 0 5 M7 15v4",
  // the Type M plug, same as the badge
  plug: "M7 10h10v4a5 5 0 0 1-10 0z M12 19v2.5 M9.5 6.5h.01 M14.5 6.5h.01 M12 3.5h.01 M9.5 6.5a1 1 0 1 0 0-.01 M14.5 6.5a1 1 0 1 0 0-.01 M12 3.5a1 1 0 1 0 0-.01",
  bolt: "M13 2.5L5 13.5h6l-1 8 8-11h-6z",
  trophy: "M7 4h10v5a5 5 0 0 1-10 0z M7 5H4.5a2.5 2.5 0 0 0 0 5H7 M17 5h2.5a2.5 2.5 0 0 1 0 5H17 M12 14v3 M8.5 20h7",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3.3 9.5h17.4 M3.3 14.5h17.4 M12 3c-2.4 2.4-3.6 5.4-3.6 9s1.2 6.6 3.6 9 M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9",

  /* ---- feedback ---- */
  check: "M4.5 12.5l5 5 10-11",
  cross: "M6 6l12 12 M18 6L6 18",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5.3l3.5 2",
  shield: "M12 3l7.5 3v6c0 4.2-3 7.6-7.5 9-4.5-1.4-7.5-4.8-7.5-9V6z M9 12.2l2.2 2.2L15.5 10",
  spark: "M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6L5.5 10l4.6-1.9z",
  link: "M9.5 14.5l5-5 M10.5 6.5l1.6-1.6a3.8 3.8 0 0 1 5.4 5.4l-1.6 1.6 M13.5 17.5l-1.6 1.6a3.8 3.8 0 0 1-5.4-5.4l1.6-1.6",
  trash: "M4 6.5h16 M9 6.5V4h6v2.5 M6.5 6.5V20h11V6.5 M10 10.5v6 M14 10.5v6",
  wave: "M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z M12 11.2a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6z",
  lock: "M6.5 10.5h11V20h-11z M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3",
  download: "M12 3.5v11 M8 11l4 4 4-4 M4.5 19.5h15",
  flag: "M6 21V4 M6 5h12l-2.2 3.6L18 12H6",
  mail: "M3 6h18v12H3z M3.5 6.8l8.5 6 8.5-6",
  undo: "M4 9h9.5a5.5 5.5 0 1 1 0 11H8 M4 9l4-4 M4 9l4 4",
  alert: "M12 3.5L21.5 20H2.5z M12 10v4.2 M12 17.2h.01",
  pencil: "M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z M14.5 7l3 3",
  star: "M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6.1-5.3-2.9-5.3 2.9 1.1-6.1L3.4 9.9l6-.8z",
  sound: "M4 10v4h3.5l4.5 3.5v-11L7.5 10z M15.5 9.5a4 4 0 0 1 0 5 M18 7a7.5 7.5 0 0 1 0 10",
};

export function Glyph({
  name,
  size = 20,
  className,
  strokeWidth = 1.8,
  style,
}: {
  name: GlyphName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  const d = P[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : `M${seg}`} />
      ))}
    </svg>
  );
}

/** Desk id to glyph. Keeps `categories.ts` free of presentation. */
export const CATEGORY_GLYPH: Record<string, GlyphName> = {
  breaking: "breaking", politics: "politics", business: "business",
  technology: "technology", sport: "sport", football: "football",
  formula1: "formula1", basketball: "basketball", entertainment: "entertainment",
  gaming: "gaming", music: "music", cars: "cars", ai: "ai", finance: "finance",
  crime: "crime", capetown: "capetown", johannesburg: "johannesburg",
  education: "education", lifestyle: "lifestyle", fashion: "fashion",
  sneakers: "sneakers", travel: "travel", health: "health", science: "science",
  opinion: "opinion", local: "local",
};

/** Achievement id to glyph, for the emoji-free fallback under the 3D badges. */
export const ACHIEVEMENT_GLYPH: Record<string, GlyphName> = {
  "first-read": "page", "reader-10": "brain", "reader-50": "flame",
  "first-like": "heart", "liker-25": "heartPlus", "first-save": "pin",
  "saver-15": "archive", "first-share": "megaphone", "sharer-10": "plug",
  "streak-3": "bolt", "streak-7": "trophy", "topics-5": "globe",
};
