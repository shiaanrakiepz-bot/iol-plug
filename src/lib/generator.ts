import type {
  Brand,
  GenerateOptions,
  GenerateResult,
  OutputType,
  Platform,
  Tone,
} from "@/types";
import { cleanTopic, formatList, titleCase } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Deterministic PRNG so "Regenerate" reliably produces a different-but-stable
// set of options. Swap this whole module for a real LLM call later — the
// public surface is just generate(options): GenerateResult.
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type RNG = () => number;

function pick<T>(arr: T[], rng: RNG): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function sample<T>(arr: T[], count: number, rng: RNG): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < count) {
    const i = Math.floor(rng() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr.map((s) => s.trim()))).filter(Boolean);
}

function sentenceCase(s: string): string {
  const t = s.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// ---------------------------------------------------------------------------
// Brand voice banks (drives the "this feels written for the brand" quality)
// ---------------------------------------------------------------------------
interface BrandVoice {
  angles: string[];
  voiceWords: string[];
  ctaVerbs: string[];
  hashtagSeed: string;
}

const BRAND_VOICE: Record<string, BrandVoice> = {
  "independent-media": {
    angles: ["across every platform", "trusted journalism", "the bigger picture", "South Africa's stories"],
    voiceWords: ["credible", "established", "professional"],
    ctaVerbs: ["Discover more", "Read the full story", "Explore the portfolio"],
    hashtagSeed: "IndependentMedia",
  },
  iol: {
    angles: ["updated live", "the full story", "as it happens", "your daily brief"],
    voiceWords: ["fast", "clear", "always-on"],
    ctaVerbs: ["Read more on IOL", "Get the full story", "Follow live updates"],
    hashtagSeed: "IOL",
  },
  "iol-sport": {
    angles: ["match-day energy", "the big moment", "every result", "game on"],
    voiceWords: ["bold", "dynamic", "competitive"],
    ctaVerbs: ["Catch every result", "Follow the action", "Don't miss kickoff"],
    hashtagSeed: "IOLSport",
  },
  "cape-argus": {
    angles: ["your city, your stories", "local first", "close to home", "Cape Town's newsroom"],
    voiceWords: ["local", "trusted", "warm"],
    ctaVerbs: ["Read your local news", "Stay in the know", "Read more"],
    hashtagSeed: "CapeArgus",
  },
  "cape-times": {
    angles: ["beyond the headline", "the analysis that matters", "considered journalism", "in full"],
    voiceWords: ["refined", "serious", "intelligent"],
    ctaVerbs: ["Read the analysis", "Continue reading", "Read in full"],
    hashtagSeed: "CapeTimes",
  },
  "the-star": {
    angles: ["the news that matters", "the story behind the story", "front and centre", "Johannesburg's news leader"],
    voiceWords: ["bold", "authoritative", "urban"],
    ctaVerbs: ["Get the full story", "Read the lead", "Stay ahead"],
    hashtagSeed: "TheStar",
  },
  "pretoria-news": {
    angles: ["the capital's news", "clearly told", "what's happening in Tshwane", "close to council"],
    voiceWords: ["civic", "clear", "dependable"],
    ctaVerbs: ["Read the update", "Stay informed", "Read more"],
    hashtagSeed: "PretoriaNews",
  },
  "daily-news": {
    angles: ["close to home", "made clear", "Durban's daily", "your neighbourhood"],
    voiceWords: ["accessible", "friendly", "clear"],
    ctaVerbs: ["Read more", "Stay in the loop", "Get the story"],
    hashtagSeed: "DailyNews",
  },
  "the-mercury": {
    angles: ["trusted for generations", "the region's story", "considered and clear", "established in KZN"],
    voiceWords: ["heritage", "editorial", "considered"],
    ctaVerbs: ["Read the full report", "Continue reading", "Read more"],
    hashtagSeed: "TheMercury",
  },
  isolezwe: {
    angles: ["ngolimi lwakho", "your community", "celebrating our culture", "close to you"],
    voiceWords: ["proud", "community-rooted", "respectful"],
    ctaVerbs: ["Funda kabanzi", "Read more", "Join the community"],
    hashtagSeed: "Isolezwe",
  },
  "daily-voice": {
    angles: ["straight up, no chaser", "big and bold", "straight from the streets", "you won't believe it"],
    voiceWords: ["punchy", "expressive", "loud"],
    ctaVerbs: ["Get the full scoop", "Don't miss this", "Grab the story"],
    hashtagSeed: "DailyVoice",
  },
  "saturday-star": {
    angles: ["worth your Saturday", "the weekend read", "slow down with us", "feature time"],
    voiceWords: ["relaxed", "feature-led", "editorial"],
    ctaVerbs: ["Read the feature", "Settle in and read", "Read more"],
    hashtagSeed: "SaturdayStar",
  },
  "sunday-independent": {
    angles: ["the week, considered", "the deeper read", "worth the time", "in full"],
    voiceWords: ["premium", "reflective", "mature"],
    ctaVerbs: ["Read the long read", "Continue reading", "Read in full"],
    hashtagSeed: "SundayIndependent",
  },
  "weekend-argus": {
    angles: ["your Cape Town weekend", "where to go, what to do", "easy does it", "weekend-ready"],
    voiceWords: ["relaxed", "local", "lifestyle"],
    ctaVerbs: ["Plan your weekend", "See what's on", "Read more"],
    hashtagSeed: "WeekendArgus",
  },
};

function voiceFor(brand: Brand): BrandVoice {
  return (
    BRAND_VOICE[brand.id] ?? {
      angles: ["the full story", "what matters", "in your region"],
      voiceWords: ["clear", "trusted", "professional"],
      ctaVerbs: ["Read more", "Find out more", "Get the story"],
      hashtagSeed: brand.shortName.replace(/\s+/g, ""),
    }
  );
}

// ---------------------------------------------------------------------------
// Tone profiles
// ---------------------------------------------------------------------------
interface ToneProfile {
  adjectives: string[];
  openers: string[];
  end: string;
  note: string;
  shout?: boolean;
}

const TONE_PROFILES: Record<Tone, ToneProfile> = {
  Bold: {
    adjectives: ["bold", "fearless", "unmissable"],
    openers: ["No holding back —", "Go big:", "Here it is —"],
    end: ".",
    note: "Lead with one big, confident idea. Cut anything that softens the message.",
  },
  Professional: {
    adjectives: ["clear", "trusted", "considered"],
    openers: ["Here's what matters:", "Straight to the point:", "In short:"],
    end: ".",
    note: "Keep it precise and credible. Let clarity do the work, not decoration.",
  },
  Urgent: {
    adjectives: ["breaking", "live", "right now"],
    openers: ["Just in:", "Right now:", "Breaking —"],
    end: "!",
    note: "Front-load the most important fact. Short sentences, real urgency, no hype.",
    shout: true,
  },
  Youthful: {
    adjectives: ["fresh", "bold", "high-energy"],
    openers: ["Okay, this is big:", "Let's go —", "Heads up:"],
    end: "!",
    note: "Keep it punchy and energetic, but always readable. Don't try too hard.",
  },
  Emotional: {
    adjectives: ["heartfelt", "real", "close to home"],
    openers: ["This one matters:", "Closer than you think:", "For all of us:"],
    end: ".",
    note: "Lead with the human story. Let the emotion be honest, never overdone.",
  },
  Sporty: {
    adjectives: ["match-day", "high-energy", "unstoppable"],
    openers: ["Game on —", "It's go time:", "Full throttle:"],
    end: "!",
    note: "Bring the energy of the moment, but keep every score and stat accurate.",
    shout: true,
  },
  Premium: {
    adjectives: ["refined", "considered", "elevated"],
    openers: ["Quietly confident:", "Considered, in full:", "Crafted with care:"],
    end: ".",
    note: "Let whitespace and restraint carry the premium feel. Less, but better.",
  },
  Serious: {
    adjectives: ["important", "measured", "in-depth"],
    openers: ["What you need to know:", "The facts, in full:", "On the record:"],
    end: ".",
    note: "Stay measured and factual. Authority comes from accuracy, not volume.",
  },
  Editorial: {
    adjectives: ["considered", "intelligent", "in-depth"],
    openers: ["Beyond the headline:", "The story, in full:", "A closer look:"],
    end: ".",
    note: "Write like the feature it deserves — intelligent, considered, unhurried.",
  },
};

// ---------------------------------------------------------------------------
// Platform profiles
// ---------------------------------------------------------------------------
interface PlatformProfile {
  layout: string;
  direction: string[];
  captionLength: "short" | "medium";
}

const PLATFORM_PROFILES: Record<Platform, PlatformProfile> = {
  Poster: {
    layout:
      "One message, one focal point. Masthead top-left, oversized headline in the upper third, a single strong image, and the CTA anchored bottom-right with clear space around it.",
    direction: [
      "Commit to a single headline — posters are read in 3 seconds",
      "Use one dominant image or a bold typographic field, not both fighting",
      "Keep a clear margin so the masthead and CTA never feel crowded",
    ],
    captionLength: "short",
  },
  Newsletter: {
    layout:
      "600px content width, a branded header band, a hero lead story, three scannable section blocks, one primary CTA button, and a simple footer with an unsubscribe line.",
    direction: [
      "Make the subject line and preview text earn the open",
      "Lead with the hero story, then keep sections short and scannable",
      "One clear primary CTA — don't dilute with five competing links",
    ],
    captionLength: "medium",
  },
  "Social media": {
    layout:
      "Square or 4:5 portrait. Big legible headline within safe margins, brand mark in a corner, and the key line readable even on mute and at thumbnail size.",
    direction: [
      "Design for the thumbnail first — it must read tiny",
      "Keep text inside safe margins away from UI overlays",
      "One idea per post; save the detail for the caption",
    ],
    captionLength: "short",
  },
  "Web banner": {
    layout:
      "Horizontal leaderboard or MPU. Short headline left, supporting line beneath, and a high-contrast CTA button right. Minimal copy, maximum clarity.",
    direction: [
      "Six words or fewer in the headline — banners are glanced at",
      "Make the CTA button the most obvious element",
      "Keep the brand mark visible but never crowding the message",
    ],
    captionLength: "short",
  },
  "Video teaser": {
    layout:
      "Hook in the first 2 seconds, a quick build, the payoff, then a branded end-card with the CTA. Captions on by default for sound-off viewing.",
    direction: [
      "Win the first 2 seconds or lose the viewer",
      "Burn in captions — most people watch on mute",
      "End on a branded card with a single clear CTA",
    ],
    captionLength: "short",
  },
  "Email campaign": {
    layout:
      "Conversion-focused email: punchy subject and preview, a single hero message, one benefit-led block, and a prominent CTA button above the fold.",
    direction: [
      "Optimise the subject + preview line together — they sell the open",
      "Keep one clear goal and one primary CTA",
      "Front-load the offer above the fold",
    ],
    captionLength: "medium",
  },
  "Internal presentation": {
    layout:
      "Clean title slide, a clear agenda, one idea per slide, consistent type scale, and restrained brand accents. Readable from the back of the room.",
    direction: [
      "One idea per slide — don't crowd the deck",
      "Use a consistent type scale and generous spacing",
      "Keep brand accents restrained and professional",
    ],
    captionLength: "medium",
  },
};

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------
function buildHeadlines(
  brand: Brand,
  tone: ToneProfile,
  topic: string,
  voice: BrandVoice,
  rng: RNG,
): string[] {
  const cap = titleCase(cleanTopic(topic, brand.name));
  const angle = () => pick(voice.angles, rng);
  const adj = () => pick(tone.adjectives, rng);
  const opener = () => pick(tone.openers, rng);
  const bang = tone.end;

  const candidates = [
    `${cap}`,
    `${cap}: ${titleCase(angle())}`,
    `${cap} — ${titleCase(angle())}${bang === "!" ? "!" : ""}`,
    `${opener()} ${cap}`,
    `${cap}, ${sentenceCase(adj())} and ${pick(brand ? voiceFor(brand).voiceWords : ["clear"], rng)}${bang}`,
    `${titleCase(angle())}: ${cap}`,
    `${cap} — ${brand.shortName}`,
    tone.shout ? `${cap.toUpperCase()}${bang}` : `${cap}, in ${pick(["full", "focus", "depth"], rng)}.`,
  ];
  return sample(unique(candidates), 5, rng);
}

function buildCaption(
  brand: Brand,
  toneProfile: ToneProfile,
  platform: Platform,
  topic: string,
  voice: BrandVoice,
  rng: RNG,
): string {
  const clean = cleanTopic(topic, "this story");
  const opener = pick(toneProfile.openers, rng);
  const angle = pick(voice.angles, rng);
  const cta = pick(voice.ctaVerbs, rng);
  const hashtags = buildHashtags(brand, topic, rng).join(" ");
  const body =
    PLATFORM_PROFILES[platform].captionLength === "short"
      ? `${opener} ${sentenceCase(clean)}. ${sentenceCase(angle)}.`
      : `${opener} ${sentenceCase(clean)}. ${sentenceCase(angle)} — from the team at ${brand.name}. ${cta}.`;
  return `${body}\n${hashtags}`;
}

function buildHashtags(brand: Brand, topic: string, rng: RNG): string[] {
  const voice = voiceFor(brand);
  const topicWords = cleanTopic(topic, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 2)
    .map((w) => "#" + w.replace(/[^a-zA-Z0-9]/g, ""))
    .filter((t) => t.length > 1);
  const base = [`#${voice.hashtagSeed}`];
  const extras = ["#SouthAfrica", "#News", "#BehindTheScenes", "#DesignStudio"];
  return unique([...base, ...topicWords, pick(extras, rng)]).slice(0, 4);
}

function buildCTAs(brand: Brand, platform: Platform, rng: RNG): string[] {
  const voice = voiceFor(brand);
  const platformCTAs: Record<Platform, string[]> = {
    Poster: ["Find out more", "Read the full story", "Scan to read"],
    Newsletter: ["Read the full story →", "Subscribe for the daily brief", "Forward to a friend"],
    "Social media": ["Tap the link in bio", "Read more on the site", "Follow for updates"],
    "Web banner": ["Read now", "Find out more", "Get the story"],
    "Video teaser": ["Watch now", "See the full story", "Don't miss it"],
    "Email campaign": ["Read more →", "Get started", "Claim your spot"],
    "Internal presentation": ["Next steps", "Let's discuss", "Questions?"],
  };
  return unique([...sample(voice.ctaVerbs, 2, rng), ...sample(platformCTAs[platform], 2, rng)]).slice(0, 4);
}

function buildSubjectLines(brand: Brand, topic: string, voice: BrandVoice, tone: ToneProfile, rng: RNG): string[] {
  const clean = cleanTopic(topic, "today's top story");
  const cap = sentenceCase(clean);
  const candidates = [
    `${cap}`,
    `${cap} — ${sentenceCase(pick(voice.angles, rng))}`,
    `${pick(tone.openers, rng)} ${sentenceCase(clean)}`,
    `Inside: ${cap}`,
    `${brand.shortName}: ${cap}`,
    `Don't miss — ${cap}`,
    `${cap}, in 5 minutes`,
  ];
  return sample(unique(candidates), 5, rng).map((s) => (s.length > 60 ? s.slice(0, 57).trim() + "…" : s));
}

function buildIntro(brand: Brand, toneProfile: ToneProfile, topic: string, voice: BrandVoice): string {
  const clean = cleanTopic(topic, "the story everyone's talking about");
  return `${sentenceCase(toneProfile.openers[0].replace(/[:—-]+$/, ""))}, here's ${clean}. ${
    brand.name
  } brings you ${voice.angles[0]} — ${voice.voiceWords[0]}, ${voice.voiceWords[1]} and made for the way you read today.`;
}

function buildSectionHeadings(platform: Platform, rng: RNG): string[] {
  const pools: Record<string, string[]> = {
    default: ["Today's lead", "In case you missed it", "On our radar", "Before you go", "The big read", "Quick hits"],
    sport: ["Match-day", "The result", "Player to watch", "Up next", "The talking point"],
  };
  return sample(pools.default, 4, rng);
}

function buildSlogan(brand: Brand, topic: string, voice: BrandVoice, rng: RNG): string {
  const cap = titleCase(cleanTopic(topic, brand.name));
  const templates = [
    `${cap}. ${sentenceCase(pick(voice.angles, rng))}.`,
    `${sentenceCase(pick(voice.angles, rng))}. Only on ${brand.shortName}.`,
    `${cap} — ${pick(voice.voiceWords, rng)}, every day.`,
  ];
  return pick(templates, rng);
}

function buildColourUsage(brand: Brand): string {
  const hasConfirmed = brand.palette.some((c) => c.hex && c.status === "approved");
  const base =
    "Anchor the layout with the brand's primary colour, use the accent only for the headline highlight and the CTA, and keep large copy areas on a high-contrast neutral so text stays readable.";
  if (hasConfirmed) return base;
  return `${base} Note: this brand's palette is currently marked "Needs official confirmation" — confirm the exact hex values in the Brand Guide before final artwork, and check text/background contrast meets WCAG AA.`;
}

function buildToneNote(brand: Brand, tone: Tone, voice: BrandVoice): string {
  return `A ${tone.toLowerCase()} tone fits ${brand.name}'s ${brand.tone.toLowerCase()} character. Keep ${formatList(
    voice.voiceWords,
  )} front of mind, and pressure-test every line against the brand's do's and don'ts.`;
}

function buildInternTip(brand: Brand, platform: Platform, rng: RNG): string {
  const tips = [
    `Before you publish, run this past ${brand.name}'s do's and don'ts on its Brand Guide page.`,
    `Any colour or font marked "Needs official confirmation" must be confirmed with your manager before final artwork.`,
    `Save the version you like to your Prompt Library so you can reuse the setup next time.`,
    `For ${platform.toLowerCase()}, preview at real size before sign-off — what works big can fail small.`,
    brand.id === "isolezwe"
      ? "Always have isiZulu copy reviewed by a fluent editor before it goes out."
      : "Read it out loud once — if it trips you up, simplify it.",
  ];
  return pick(tips, rng);
}

function buildCampaignName(brand: Brand, topic: string, voice: BrandVoice, rng: RNG): string {
  const cap = titleCase(cleanTopic(topic, brand.shortName));
  const words = cap.split(" ").slice(0, 3).join(" ");
  const patterns = [
    `${words}: ${titleCase(pick(voice.angles, rng))}`,
    `The ${words} Edit`,
    `${brand.shortName} × ${words}`,
    `Project ${words}`,
  ];
  return pick(patterns, rng);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function generate(options: GenerateOptions): GenerateResult {
  const { brand, platform, tone, outputType, topic } = options;
  const seed = (options.seed ?? 1) * 2654435761 + brand.id.length * 40503 + platform.length * 131;
  const rng = mulberry32(seed >>> 0);

  const voice = voiceFor(brand);
  const toneProfile = TONE_PROFILES[tone];
  const platformProfile = PLATFORM_PROFILES[platform];

  const headlines = buildHeadlines(brand, toneProfile, topic, voice, rng);
  const designDirection = unique([brand.designDirection, ...platformProfile.direction]).slice(0, 4);

  return {
    campaignName: buildCampaignName(brand, topic, voice, rng),
    headline: headlines[0] ?? brand.name,
    supportingHeadline: headlines[1] ?? voice.angles[0],
    alternativeHeadlines: headlines.slice(1),
    caption: buildCaption(brand, toneProfile, platform, topic, voice, rng),
    ctas: buildCTAs(brand, platform, rng),
    subjectLines: buildSubjectLines(brand, topic, voice, toneProfile, rng),
    intro: buildIntro(brand, toneProfile, topic, voice),
    sectionHeadings: buildSectionHeadings(platform, rng),
    slogan: buildSlogan(brand, topic, voice, rng),
    designDirection,
    colourUsage: buildColourUsage(brand),
    layoutSuggestion: platformProfile.layout,
    toneNote: buildToneNote(brand, tone, voice),
    internTip: buildInternTip(brand, platform, rng),
    meta: { brand: brand.name, platform, tone, outputType },
  };
}

/** Maps the chosen output type to the primary block we should surface first. */
export function primaryBlockFor(outputType: OutputType, result: GenerateResult): {
  label: string;
  lines: string[];
} {
  switch (outputType) {
    case "Headline":
      return { label: "Headline options", lines: [result.headline, ...result.alternativeHeadlines] };
    case "Caption":
      return { label: "Caption", lines: [result.caption] };
    case "CTA":
      return { label: "CTA options", lines: result.ctas };
    case "Subject line":
      return { label: "Subject lines", lines: result.subjectLines };
    case "Intro paragraph":
      return { label: "Intro paragraph", lines: [result.intro] };
    case "Campaign slogan":
      return { label: "Campaign slogan", lines: [result.slogan] };
    case "Design concept":
      return { label: "Design concept", lines: result.designDirection };
    case "Full campaign copy":
      return {
        label: "Full campaign copy",
        lines: [
          `Campaign: ${result.campaignName}`,
          `Headline: ${result.headline}`,
          `Support: ${result.supportingHeadline}`,
          `Subject line: ${result.subjectLines[0]}`,
          `Intro: ${result.intro}`,
          `Caption: ${result.caption}`,
          `CTA: ${result.ctas[0]}`,
        ],
      };
    default:
      return { label: "Headline options", lines: [result.headline, ...result.alternativeHeadlines] };
  }
}

export const PLATFORMS: Platform[] = [
  "Poster",
  "Newsletter",
  "Social media",
  "Web banner",
  "Video teaser",
  "Email campaign",
  "Internal presentation",
];

export const TONES: Tone[] = [
  "Bold",
  "Professional",
  "Urgent",
  "Youthful",
  "Emotional",
  "Sporty",
  "Premium",
  "Serious",
  "Editorial",
];

export const OUTPUT_TYPES: OutputType[] = [
  "Headline",
  "Caption",
  "CTA",
  "Subject line",
  "Intro paragraph",
  "Campaign slogan",
  "Design concept",
  "Full campaign copy",
];
