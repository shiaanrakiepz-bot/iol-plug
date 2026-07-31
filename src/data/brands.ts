import type { Brand, ColorSwatch, LogoAsset, Typography } from "@/types";
import { NEEDS_CONFIRMATION } from "@/types";

// ---------------------------------------------------------------------------
// Reusable builders
//
// IMPORTANT: We never invent official brand colours, fonts or logo files.
// Palettes, typography and logo slots ship as confirmable placeholders so the
// real values can be added from the official brand guide via Admin Mode.
// ---------------------------------------------------------------------------

function standardLogoSlots(): LogoAsset[] {
  return [
    {
      type: "primary",
      label: "Primary logo",
      description: "Main full-colour masthead for general use",
      status: "missing",
    },
    {
      type: "black",
      label: "Black logo",
      description: "Single-colour black version for light backgrounds",
      status: "missing",
    },
    {
      type: "white",
      label: "White logo",
      description: "Reversed white version for dark / high-contrast backgrounds",
      status: "missing",
    },
    {
      type: "icon",
      label: "Icon / logo mark",
      description: "Compact mark for avatars, favicons and app tiles",
      status: "missing",
    },
    {
      type: "svg",
      label: "Vector master (SVG)",
      description: "Scalable file for print and large-format work",
      status: "missing",
    },
    {
      type: "png",
      label: "Transparent (PNG)",
      description: "Transparent raster for quick digital placement",
      status: "missing",
    },
  ];
}

function placeholderPalette(): ColorSwatch[] {
  return [
    {
      id: "primary",
      name: "Primary brand colour",
      hex: null,
      usage: "Masthead, primary brand background and key surfaces",
      role: "background",
      status: "needs-confirmation",
    },
    {
      id: "accent",
      name: "Accent colour",
      hex: null,
      usage: "Highlights, links, tags and small emphasis details",
      role: "accent",
      status: "needs-confirmation",
    },
    {
      id: "ink",
      name: "Text / ink",
      hex: null,
      usage: "Headlines and long-form body copy",
      role: "text",
      status: "needs-confirmation",
    },
    {
      id: "cta",
      name: "Call-to-action",
      hex: null,
      usage: "Buttons, subscribe prompts and conversion moments",
      role: "cta",
      status: "needs-confirmation",
    },
    {
      id: "newsletter",
      name: "Newsletter header",
      hex: null,
      usage: "Email header band and section dividers",
      role: "newsletter-header",
      status: "needs-confirmation",
    },
  ];
}

function typographyFor(note: string): Typography {
  return {
    heading: NEEDS_CONFIRMATION,
    body: NEEDS_CONFIRMATION,
    digital: NEEDS_CONFIRMATION,
    notes: note,
    status: "needs-confirmation",
  };
}

// ---------------------------------------------------------------------------
// Brand records
// ---------------------------------------------------------------------------
export const BRANDS: Brand[] = [
  {
    id: "independent-media",
    name: "Independent Media",
    shortName: "Independent",
    category: "Media group / publisher",
    region: "National (South Africa)",
    audience:
      "South African news readers across print and digital, plus corporate, advertising and newsroom stakeholders.",
    description:
      "A South African multi-platform media company with a portfolio of news titles across print and digital. Design should feel credible, professional, editorial and adaptable across corporate, newsroom and campaign contexts.",
    tone: "Credible, professional and editorial",
    designPersonality: "Corporate-editorial, trustworthy, structured and flexible across many sub-brands.",
    designDirection:
      "Lead with a clean corporate system: confident typography, generous whitespace and a restrained palette. Keep the parent brand neutral enough to sit above its many titles while still feeling premium and established.",
    bestUseCases: [
      "Corporate announcements and group campaigns",
      "Investor, partnership and B2B materials",
      "Cross-title brand and recruitment campaigns",
      "Internal communications and event branding",
    ],
    newsletterUses: [
      "Group-wide editorial roundups",
      "Corporate and stakeholder updates",
      "Cross-title 'best of' digests",
    ],
    socialUses: [
      "Corporate thought-leadership posts",
      "Group milestone and award announcements",
      "Recruitment and culture content",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Set the parent brand in a confident corporate type system once confirmed. Until then, pair a strong editorial serif or grotesque for headlines with a clean, highly legible sans-serif for body and UI.",
    ),
    dos: [
      "Keep the parent brand neutral so individual titles can stand out",
      "Use generous whitespace and a clear typographic hierarchy",
      "Maintain a consistent corporate system across touchpoints",
      "Reference the official brand guide before publishing externally",
    ],
    donts: [
      "Don't compete visually with the individual mastheads",
      "Don't overload corporate layouts with colour or effects",
      "Don't mix many fonts in one piece",
      "Don't present unconfirmed colours or fonts as official",
    ],
    copyExamples: [
      { label: "Corporate line", text: "Independent Media — telling South Africa's stories across every platform." },
      { label: "Recruitment", text: "Join a newsroom that's shaped South African journalism for generations." },
    ],
    campaignExamples: [
      "Group brand refresh rollout (example slot)",
      "Cross-title subscription drive (example slot)",
      "Newsroom recruitment campaign (example slot)",
    ],
    approvalStatus: "in-review",
    notes: "Parent brand for the full title portfolio. Confirm the official corporate identity before any external use.",
    tags: ["National", "Digital", "Newspaper", "Corporate"],
    uiHue: 222,
  },
  {
    id: "iol",
    name: "IOL",
    shortName: "IOL",
    category: "Digital news platform",
    region: "National (South Africa)",
    audience:
      "A broad national online audience following breaking news, sport, lifestyle, business, entertainment and opinion.",
    description:
      "A major South African digital news platform covering current affairs, breaking news, sport, lifestyle, business, entertainment and opinion. Design should feel digital-first, fast, accessible and content-rich.",
    tone: "Fast, accessible and content-rich",
    designPersonality: "Digital-first, energetic, modular and built for high-volume content.",
    designDirection:
      "Design for speed and scanning: strong headline hierarchy, clear category colour-coding, mobile-first layouts and modular cards that handle a constant stream of stories without feeling cluttered.",
    bestUseCases: [
      "Breaking-news digital campaigns",
      "Homepage and section takeovers",
      "Always-on social news content",
      "App and push-notification promotion",
    ],
    newsletterUses: [
      "Daily breaking-news digest",
      "Morning and afternoon briefings",
      "Topic-based alerts (sport, business, lifestyle)",
    ],
    socialUses: [
      "Breaking-news cards and live updates",
      "Quote and stat graphics",
      "Short-form explainers and carousels",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Prioritise on-screen legibility at small sizes once official fonts are confirmed. Until then, use a clean modern sans-serif for both headlines and body, with clear weight contrast for scanning.",
    ),
    dos: [
      "Design mobile-first — most readers arrive on a phone",
      "Use clear category colour-coding for fast navigation",
      "Keep headlines short, punchy and scannable",
      "Optimise images and graphics for fast loading",
    ],
    donts: [
      "Don't bury the headline under heavy decoration",
      "Don't use low-contrast text on busy images",
      "Don't rely on print-only layouts for digital",
      "Don't invent official platform colours — confirm first",
    ],
    copyExamples: [
      { label: "Breaking", text: "BREAKING: What you need to know, updated live." },
      { label: "Digest", text: "Your day in five stories — fast, clear, IOL." },
    ],
    campaignExamples: [
      "Election live-results hub (example slot)",
      "App download push campaign (example slot)",
      "Daily briefing newsletter launch (example slot)",
    ],
    approvalStatus: "in-review",
    notes: "Flagship digital platform. Optimise everything for mobile and speed.",
    tags: ["Digital", "National", "Sport"],
    uiHue: 210,
  },
  {
    id: "iol-sport",
    name: "IOL Sport",
    shortName: "IOL Sport",
    category: "Digital sport section",
    region: "National (South Africa)",
    audience:
      "Sports fans following rugby, football, cricket and more — match results, analysis, transfers and live action.",
    description:
      "The sports-focused section of IOL. Design can be more energetic, bold, dynamic and match-day inspired while still feeling professional and news-focused.",
    tone: "Energetic, bold and match-day driven",
    designPersonality: "Dynamic, high-energy, competitive and motion-led — but still credible news.",
    designDirection:
      "Bring match-day energy: bold diagonal compositions, strong action photography, scoreboard-style numerals and confident accent colour. Keep it credible — energy should never undercut accuracy.",
    bestUseCases: [
      "Match-day and fixtures campaigns",
      "Live-score and results graphics",
      "Transfer and team-news content",
      "Tournament and derby hype packages",
    ],
    newsletterUses: [
      "Match-day previews and predictions",
      "Post-match reaction and ratings",
      "Weekly fixtures and results roundup",
    ],
    socialUses: [
      "Live-score and full-time graphics",
      "Player stat cards and milestones",
      "Hype reels and countdown posts",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Use bold, condensed or sporty display type for headlines and scores once confirmed, paired with a clean sans-serif for body. Numerals should feel strong and scoreboard-ready.",
    ),
    dos: [
      "Lead with strong action photography",
      "Use bold, energetic headline type and dynamic angles",
      "Make scores, stats and times instantly readable",
      "Keep team and league references accurate",
    ],
    donts: [
      "Don't let energy compromise factual accuracy",
      "Don't clutter live graphics with too many stats",
      "Don't stretch or distort sponsor or league marks",
      "Don't guess team colours — confirm official references",
    ],
    copyExamples: [
      { label: "Match-day", text: "It's derby day. Buckle up." },
      { label: "Full-time", text: "Full-time drama: the moments that decided it." },
    ],
    campaignExamples: [
      "Rugby World Cup hub takeover (example slot)",
      "Match-day live graphics pack (example slot)",
      "Weekly fixtures newsletter (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Energetic sub-brand of IOL. Push the energy, protect the accuracy.",
    tags: ["Digital", "Sport", "National"],
    uiHue: 150,
  },
  {
    id: "cape-argus",
    name: "Cape Argus",
    shortName: "Argus",
    category: "Regional daily newspaper",
    region: "Cape Town & Western Cape",
    audience:
      "Cape Town and Western Cape readers who value trusted, local daily news and community stories.",
    description:
      "A Cape Town and Western Cape-focused title with a strong local news identity. Design should feel local, trusted, readable and community-aware.",
    tone: "Local, trusted and community-aware",
    designPersonality: "Established, dependable, neighbourly and readable.",
    designDirection:
      "Keep it warm and trustworthy: classic newspaper structure, readable columns, real local photography and a sense of community. Modernise gently without losing the title's familiar, dependable character.",
    bestUseCases: [
      "Local news and community campaigns",
      "Western Cape events and civic coverage",
      "Subscriber and readership drives",
      "Local advertising features",
    ],
    newsletterUses: [
      "Cape Town daily news digest",
      "Local events and what's-on roundup",
      "Community and human-interest features",
    ],
    socialUses: [
      "Local breaking-news cards",
      "Community spotlight posts",
      "Cape Town weather and traffic snippets",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Favour a classic, readable newspaper pairing once confirmed: a trusted serif for headlines and a comfortable serif or sans for body at generous reading sizes.",
    ),
    dos: [
      "Use authentic local Cape Town photography",
      "Keep layouts clean, readable and well-structured",
      "Lead with community relevance",
      "Respect the title's established, trusted character",
    ],
    donts: [
      "Don't over-style at the expense of readability",
      "Don't use generic stock that ignores local context",
      "Don't crowd columns or shrink body text",
      "Don't present unconfirmed brand colours as official",
    ],
    copyExamples: [
      { label: "Local lead", text: "Your city, your stories — every single day." },
      { label: "Community", text: "Cape Town's news, told by Cape Town's newsroom." },
    ],
    campaignExamples: [
      "Local heroes community series (example slot)",
      "Western Cape subscriber drive (example slot)",
      "What's-on weekend newsletter (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Strong Cape Town identity. Keep it local, warm and trustworthy.",
    tags: ["Newspaper", "Cape Town"],
    established: "1857",
    uiHue: 199,
  },
  {
    id: "cape-times",
    name: "Cape Times",
    shortName: "Cape Times",
    category: "Regional daily newspaper",
    region: "Cape Town & Western Cape",
    audience:
      "Cape Town readers who want serious, credible, text-led news and considered analysis.",
    description:
      "A Cape Town-based newspaper with a more classic editorial tone. Design should feel refined, serious, credible and text-led.",
    tone: "Refined, serious and credible",
    designPersonality: "Classic, editorial, intelligent and understated.",
    designDirection:
      "Lean into classic editorial craft: elegant serif headlines, disciplined grids, restrained colour and a quiet confidence. Let strong writing and photography lead; design supports rather than shouts.",
    bestUseCases: [
      "Serious news and analysis features",
      "Opinion and long-form editorial",
      "Premium subscriber campaigns",
      "Considered civic and business coverage",
    ],
    newsletterUses: [
      "Morning editorial briefing",
      "Opinion and analysis digest",
      "Long-read feature roundup",
    ],
    socialUses: [
      "Considered quote and analysis graphics",
      "Editorial headline cards",
      "Long-read promotion posts",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Set headlines in an elegant editorial serif once confirmed, with a refined serif body for long-form reading. Keep digital text crisp and high-contrast.",
    ),
    dos: [
      "Use an elegant, classic editorial serif for headlines",
      "Maintain disciplined grids and generous margins",
      "Keep colour restrained and sophisticated",
      "Let strong writing and photography lead",
    ],
    donts: [
      "Don't use loud, tabloid-style treatments",
      "Don't over-decorate serious news",
      "Don't break the grid without reason",
      "Don't guess the masthead's official typeface — confirm it",
    ],
    copyExamples: [
      { label: "Editorial", text: "Considered journalism for a complex city." },
      { label: "Analysis", text: "Beyond the headline: the analysis that matters." },
    ],
    campaignExamples: [
      "Premium long-read series (example slot)",
      "Opinion-writers spotlight (example slot)",
      "Subscriber editorial briefing (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Classic, refined editorial voice. Restraint is the brand.",
    tags: ["Newspaper", "Cape Town"],
    established: "1876",
    uiHue: 215,
  },
  {
    id: "the-star",
    name: "The Star",
    shortName: "The Star",
    category: "Metro daily newspaper",
    region: "Johannesburg & Gauteng",
    audience:
      "Johannesburg and Gauteng readers following metro, national and business news with authority.",
    description:
      "A Johannesburg-linked newspaper with national news relevance. Design should feel bold, urban, news-driven and authoritative.",
    tone: "Bold, urban and authoritative",
    designPersonality: "Confident, metropolitan, news-driven and assertive.",
    designDirection:
      "Project authority and pace: strong, bold headlines, a confident grid and high-impact news photography. Channel the energy of Johannesburg — fast, urban and assertive — while staying credible.",
    bestUseCases: [
      "Major national and metro news campaigns",
      "Business and politics coverage",
      "High-impact front-page moments",
      "Gauteng readership and subscriber drives",
    ],
    newsletterUses: [
      "Gauteng daily briefing",
      "Business and politics digest",
      "Big-story deep-dive roundup",
    ],
    socialUses: [
      "Bold breaking-news cards",
      "Headline-led news graphics",
      "Business and markets snapshots",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Use a strong, authoritative headline face once confirmed — a bold serif or grotesque — paired with a clean, efficient body type for dense news pages.",
    ),
    dos: [
      "Lead with bold, confident headlines",
      "Use high-impact news photography",
      "Keep a strong, consistent grid",
      "Balance metro energy with credibility",
    ],
    donts: [
      "Don't soften major news with timid type",
      "Don't clutter the front-page hierarchy",
      "Don't mix too many competing accents",
      "Don't present unconfirmed colours as official",
    ],
    copyExamples: [
      { label: "Authority", text: "The story behind the story — Johannesburg's news leader." },
      { label: "Front page", text: "Gauteng wakes up to the news that matters." },
    ],
    campaignExamples: [
      "Metro election coverage (example slot)",
      "Business briefing newsletter (example slot)",
      "Front-page anniversary feature (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Bold metropolitan authority. Confident but credible.",
    tags: ["Newspaper", "Johannesburg", "National"],
    established: "1887",
    uiHue: 245,
  },
  {
    id: "pretoria-news",
    name: "Pretoria News",
    shortName: "Pretoria News",
    category: "Regional daily newspaper",
    region: "Pretoria / Tshwane",
    audience:
      "Pretoria and Tshwane readers following civic, local and national news relevant to the capital.",
    description:
      "A Pretoria/Tshwane-focused news title. Design should feel civic, professional, local and informative.",
    tone: "Civic, professional and informative",
    designPersonality: "Capital-city, institutional, dependable and clear.",
    designDirection:
      "Reflect the capital: a professional, civic tone with clear structure, dependable typography and strong local-government and community coverage. Informative first, with a polished institutional feel.",
    bestUseCases: [
      "Civic and local-government coverage",
      "Tshwane community campaigns",
      "Capital-city events and features",
      "Local readership drives",
    ],
    newsletterUses: [
      "Pretoria daily news digest",
      "Civic and council update roundup",
      "Local events and notices",
    ],
    socialUses: [
      "Local news and civic-update cards",
      "Community spotlight posts",
      "Capital-city event promotion",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Use a clear, professional and dependable pairing once confirmed — a steady serif or grotesque for headlines with a highly legible body for civic detail.",
    ),
    dos: [
      "Keep a professional, civic and informative tone",
      "Use clear structure and readable layouts",
      "Ground stories in Tshwane / Pretoria context",
      "Keep civic information accurate and clear",
    ],
    donts: [
      "Don't over-sensationalise civic news",
      "Don't sacrifice clarity for decoration",
      "Don't ignore local context",
      "Don't guess official brand colours",
    ],
    copyExamples: [
      { label: "Civic", text: "The capital's news, clearly told." },
      { label: "Local", text: "What's happening in Tshwane today." },
    ],
    campaignExamples: [
      "Council and service-delivery series (example slot)",
      "Capital-city events newsletter (example slot)",
      "Local readership drive (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Capital-city civic title. Clear, professional, dependable.",
    tags: ["Newspaper", "Pretoria"],
    established: "1898",
    uiHue: 188,
  },
  {
    id: "daily-news",
    name: "Daily News",
    shortName: "Daily News",
    category: "Regional daily newspaper",
    region: "Durban & KwaZulu-Natal",
    audience:
      "Durban and KwaZulu-Natal readers wanting accessible, clear, community-focused daily news.",
    description:
      "A Durban/KwaZulu-Natal-focused news title. Design should feel accessible, community-focused and clear.",
    tone: "Accessible, community-focused and clear",
    designPersonality: "Friendly, practical, local and easy to read.",
    designDirection:
      "Keep it accessible and clear: friendly, practical layouts, strong local photography and an easy reading rhythm. Prioritise clarity and community relevance over decoration.",
    bestUseCases: [
      "Durban local news campaigns",
      "Community and human-interest features",
      "KZN events and lifestyle coverage",
      "Readership and subscriber drives",
    ],
    newsletterUses: [
      "Durban daily news digest",
      "Community and lifestyle roundup",
      "Local events and what's-on",
    ],
    socialUses: [
      "Local breaking-news cards",
      "Community spotlight posts",
      "Durban weather and lifestyle snippets",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Favour an accessible, friendly and highly readable pairing once confirmed, with comfortable sizes and clear hierarchy for everyday reading.",
    ),
    dos: [
      "Keep copy and layouts clear and accessible",
      "Use authentic Durban / KZN photography",
      "Lead with community relevance",
      "Maintain comfortable reading sizes",
    ],
    donts: [
      "Don't over-complicate layouts",
      "Don't use low-contrast or tiny text",
      "Don't ignore local KZN context",
      "Don't present unconfirmed colours as official",
    ],
    copyExamples: [
      { label: "Accessible", text: "Durban's daily news, made clear." },
      { label: "Community", text: "Close to home, close to the story." },
    ],
    campaignExamples: [
      "Durban community series (example slot)",
      "KZN lifestyle newsletter (example slot)",
      "Local subscriber drive (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Accessible Durban daily. Clarity and community first.",
    tags: ["Newspaper", "Durban/KZN"],
    established: "1878",
    uiHue: 174,
  },
  {
    id: "the-mercury",
    name: "The Mercury",
    shortName: "The Mercury",
    category: "Regional daily newspaper",
    region: "Durban & KwaZulu-Natal",
    audience:
      "KwaZulu-Natal readers following established regional news, business and considered local coverage.",
    description:
      "A KwaZulu-Natal/Durban title with a strong regional identity. Design should feel established, editorial and locally relevant.",
    tone: "Established, editorial and locally relevant",
    designPersonality: "Heritage, editorial, regional and considered.",
    designDirection:
      "Honour a long regional heritage: a considered editorial system, classic structure and strong KZN coverage. Feel established and credible, with quiet polish over flash.",
    bestUseCases: [
      "Established regional news features",
      "KZN business and civic coverage",
      "Heritage and anniversary moments",
      "Premium regional subscriber campaigns",
    ],
    newsletterUses: [
      "KZN morning briefing",
      "Business and analysis digest",
      "Regional feature roundup",
    ],
    socialUses: [
      "Editorial headline cards",
      "Regional analysis graphics",
      "Heritage and milestone posts",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Use a classic, established editorial pairing once confirmed — a heritage serif for headlines with a refined, readable body for considered regional coverage.",
    ),
    dos: [
      "Respect the title's long regional heritage",
      "Use a considered, editorial layout system",
      "Ground coverage in KZN relevance",
      "Keep polish quiet and confident",
    ],
    donts: [
      "Don't use loud tabloid treatments",
      "Don't ignore the established brand character",
      "Don't crowd considered features",
      "Don't guess the official typeface or colours",
    ],
    copyExamples: [
      { label: "Heritage", text: "Trusted in KwaZulu-Natal for generations." },
      { label: "Editorial", text: "The region's story, considered and clear." },
    ],
    campaignExamples: [
      "Heritage anniversary feature (example slot)",
      "KZN business briefing (example slot)",
      "Regional long-read series (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "One of the region's most established titles. Heritage with polish.",
    tags: ["Newspaper", "Durban/KZN"],
    established: "1852",
    uiHue: 230,
  },
  {
    id: "isolezwe",
    name: "Isolezwe",
    shortName: "Isolezwe",
    category: "Zulu-language daily newspaper",
    region: "KwaZulu-Natal (Zulu-language)",
    audience:
      "isiZulu-speaking readers in KwaZulu-Natal and beyond, following news, sport and community life in their language.",
    description:
      "A Zulu-language news title. Design should respect language, culture, community, accessibility and strong local relevance.",
    tone: "Cultural, community-rooted and respectful",
    designPersonality: "Proud, accessible, culturally grounded and people-first.",
    designDirection:
      "Centre language and culture: design that respects isiZulu typography and readability, celebrates community, and feels proud and accessible. Strong local photography and a people-first warmth.",
    bestUseCases: [
      "isiZulu community news campaigns",
      "Cultural and heritage features",
      "Local sport and community coverage",
      "Readership drives in KZN",
    ],
    newsletterUses: [
      "isiZulu daily news digest",
      "Community and culture roundup",
      "Local sport and events",
    ],
    socialUses: [
      "isiZulu breaking-news cards",
      "Community and culture spotlights",
      "Local sport graphics",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Choose fonts with full support for isiZulu spelling and comfortable readability once confirmed. Test real isiZulu copy — including longer words — at body sizes before sign-off.",
    ),
    dos: [
      "Respect isiZulu language and correct spelling",
      "Test layouts with real isiZulu copy and longer words",
      "Celebrate community and culture authentically",
      "Keep text accessible and highly readable",
    ],
    donts: [
      "Don't treat language as an afterthought",
      "Don't use auto-translations without a review",
      "Don't use imagery that ignores cultural context",
      "Don't present unconfirmed colours or fonts as official",
    ],
    copyExamples: [
      { label: "Community", text: "Izindaba zakini, ngolimi lwakho. (Your community's news, in your language.)" },
      { label: "Proud", text: "Sigubha amasiko ethu nsuku zonke. (Celebrating our culture every day.)" },
    ],
    campaignExamples: [
      "Heritage Month culture series (example slot)",
      "isiZulu community sport feature (example slot)",
      "Local readership drive (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes:
      "isiZulu-language title. Language accuracy and cultural respect are non-negotiable — always have isiZulu copy reviewed by a fluent editor.",
    tags: ["Newspaper", "Zulu-language", "Durban/KZN"],
    established: "2002",
    uiHue: 130,
  },
  {
    id: "daily-voice",
    name: "Daily Voice",
    shortName: "Daily Voice",
    category: "Tabloid daily newspaper",
    region: "Cape Town & Western Cape",
    audience:
      "Cape Town readers who love bold, direct, community-driven news with personality and energy.",
    description:
      "A bold, popular Cape Town-focused title with a more energetic, direct and community-driven tone. Design can be punchier and more expressive while still being readable.",
    tone: "Bold, direct and energetic",
    designPersonality: "Punchy, expressive, street-smart and full of personality.",
    designDirection:
      "Turn up the volume: big bold headlines, high-energy layouts, strong contrast and unmistakable personality. Be punchy and expressive — but keep it readable and never lose the community heart.",
    bestUseCases: [
      "Bold front-page and tabloid moments",
      "High-energy community campaigns",
      "Entertainment and lifestyle features",
      "Attention-grabbing promotions",
    ],
    newsletterUses: [
      "Punchy daily news hit",
      "Entertainment and gossip roundup",
      "Community shout-outs and events",
    ],
    socialUses: [
      "Big bold headline cards",
      "High-energy entertainment posts",
      "Community and street-culture content",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Use big, bold, high-impact display type for headlines once confirmed, with a sturdy readable body. Headlines can be loud — body copy must stay clear.",
    ),
    dos: [
      "Go big and bold with headlines",
      "Use strong contrast and high energy",
      "Keep the community voice and personality",
      "Stay readable even when it's loud",
    ],
    donts: [
      "Don't go so loud the message gets lost",
      "Don't lose readability for body copy",
      "Don't drop the community heart for shock value",
      "Don't present unconfirmed brand colours as official",
    ],
    copyExamples: [
      { label: "Punchy", text: "Eish! You won't believe what happened next." },
      { label: "Bold", text: "Big news, straight up, no chaser." },
    ],
    campaignExamples: [
      "Bold front-page promo (example slot)",
      "Entertainment weekly newsletter (example slot)",
      "Community shout-out campaign (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Punchy, expressive Cape Town tabloid. Loud, but always readable.",
    tags: ["Newspaper", "Cape Town"],
    established: "2005",
    uiHue: 345,
  },
  {
    id: "saturday-star",
    name: "Saturday Star",
    shortName: "Saturday Star",
    category: "Weekend newspaper",
    region: "Johannesburg & Gauteng",
    audience:
      "Gauteng weekend readers with time for features, lifestyle, opinion and longer reads.",
    description:
      "A weekend edition connected to The Star. Design can feel more feature-led, weekend-focused, readable and editorial.",
    tone: "Feature-led, relaxed and editorial",
    designPersonality: "Weekend, feature-rich, lifestyle-aware and considered.",
    designDirection:
      "Slow the pace for the weekend: more feature-led layouts, generous imagery, room for long reads and lifestyle. Keep The Star's credibility but soften into a relaxed, editorial weekend rhythm.",
    bestUseCases: [
      "Weekend feature campaigns",
      "Lifestyle and culture coverage",
      "Long-form and opinion features",
      "Weekend subscriber promotions",
    ],
    newsletterUses: [
      "Weekend feature roundup",
      "Lifestyle and culture digest",
      "Long-read and opinion picks",
    ],
    socialUses: [
      "Feature and long-read promos",
      "Lifestyle and culture posts",
      "Weekend what's-on content",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Use a comfortable, feature-led editorial pairing once confirmed — an elegant headline serif with a relaxed, readable body for longer weekend reads.",
    ),
    dos: [
      "Give features room to breathe",
      "Use generous, high-quality imagery",
      "Keep a relaxed weekend reading rhythm",
      "Maintain The Star's underlying credibility",
    ],
    donts: [
      "Don't cram weekend features like a news page",
      "Don't lose editorial quality for volume",
      "Don't ignore lifestyle and culture cues",
      "Don't guess official colours or fonts",
    ],
    copyExamples: [
      { label: "Weekend", text: "Slow down. It's the weekend read." },
      { label: "Feature", text: "The stories worth your Saturday." },
    ],
    campaignExamples: [
      "Weekend lifestyle series (example slot)",
      "Long-read feature newsletter (example slot)",
      "Weekend subscriber promo (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Weekend feature edition linked to The Star. Relaxed but editorial.",
    tags: ["Newspaper", "Johannesburg"],
    uiHue: 275,
  },
  {
    id: "sunday-independent",
    name: "Sunday Independent",
    shortName: "Sunday Indy",
    category: "Sunday newspaper",
    region: "National (South Africa)",
    audience:
      "Considered national readers who want reflective, premium, long-form Sunday journalism and analysis.",
    description:
      "A Sunday title with a more reflective, long-form and premium editorial feel. Design should feel mature, intelligent and feature-driven.",
    tone: "Reflective, intelligent and premium",
    designPersonality: "Mature, sophisticated, considered and feature-driven.",
    designDirection:
      "Aim for premium long-form: elegant typography, sophisticated whitespace, considered photography and a calm, intelligent rhythm. Everything should feel mature, deliberate and worth the time.",
    bestUseCases: [
      "Premium long-form features",
      "Analysis and opinion campaigns",
      "Investigative and in-depth coverage",
      "Premium subscriber and brand work",
    ],
    newsletterUses: [
      "Sunday long-read briefing",
      "Analysis and opinion digest",
      "Premium feature roundup",
    ],
    socialUses: [
      "Considered long-read promos",
      "Analysis and quote graphics",
      "Premium feature teasers",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Set in a sophisticated editorial serif for headlines once confirmed, with an elegant, readable long-form body. Prioritise calm, premium typographic rhythm.",
    ),
    dos: [
      "Use elegant typography and generous whitespace",
      "Give long-form features a calm, premium rhythm",
      "Choose considered, high-quality photography",
      "Keep everything mature and deliberate",
    ],
    donts: [
      "Don't rush or crowd premium layouts",
      "Don't use loud, fast-news treatments",
      "Don't undercut the intelligent tone",
      "Don't present unconfirmed colours or fonts as official",
    ],
    copyExamples: [
      { label: "Premium", text: "The week, considered. The stories, in full." },
      { label: "Reflective", text: "Sunday is for the deeper read." },
    ],
    campaignExamples: [
      "Premium investigative series (example slot)",
      "Sunday long-read newsletter (example slot)",
      "Analysis subscriber campaign (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Premium reflective Sunday title. Mature, intelligent, unhurried.",
    tags: ["Newspaper", "National"],
    established: "1995",
    uiHue: 280,
  },
  {
    id: "weekend-argus",
    name: "Weekend Argus",
    shortName: "Weekend Argus",
    category: "Weekend newspaper",
    region: "Cape Town & Western Cape",
    audience:
      "Cape Town weekend readers who want local news, lifestyle, leisure and an easy weekend read.",
    description:
      "A weekend Cape Town-focused title. Design can feel local, accessible, lifestyle-aware and weekend-friendly.",
    tone: "Local, relaxed and lifestyle-aware",
    designPersonality: "Weekend, friendly, Cape Town lifestyle and easy-going.",
    designDirection:
      "Capture an easy Cape Town weekend: local lifestyle, leisure and events with a friendly, accessible feel. Keep the Argus's local trust, but lighter, warmer and weekend-ready.",
    bestUseCases: [
      "Weekend lifestyle and leisure campaigns",
      "Cape Town events and what's-on",
      "Local feature and community content",
      "Weekend readership promotions",
    ],
    newsletterUses: [
      "Cape Town weekend roundup",
      "Lifestyle and leisure digest",
      "Local events and what's-on",
    ],
    socialUses: [
      "Weekend lifestyle posts",
      "Cape Town events and leisure content",
      "Local feature promos",
    ],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor(
      "Use a friendly, accessible weekend-lifestyle pairing once confirmed — a warm headline face with a relaxed, readable body for leisure reading.",
    ),
    dos: [
      "Keep a warm, weekend-friendly feel",
      "Lead with Cape Town lifestyle and leisure",
      "Use bright, authentic local imagery",
      "Stay accessible and easy to read",
    ],
    donts: [
      "Don't use heavy hard-news treatments",
      "Don't lose the local Cape Town flavour",
      "Don't over-complicate leisure layouts",
      "Don't guess official brand colours or fonts",
    ],
    copyExamples: [
      { label: "Weekend", text: "Your Cape Town weekend starts here." },
      { label: "Lifestyle", text: "Where to go, what to do, who to watch." },
    ],
    campaignExamples: [
      "Weekend lifestyle guide (example slot)",
      "Cape Town events newsletter (example slot)",
      "Local leisure feature series (example slot)",
    ],
    approvalStatus: "needs-confirmation",
    notes: "Cape Town weekend lifestyle title. Warm, local and easy-going.",
    tags: ["Newspaper", "Cape Town"],
    uiHue: 30,
  },
];

// ---------------------------------------------------------------------------
// Lookups & filter facets
// ---------------------------------------------------------------------------
export function getBrand(id: string): Brand | undefined {
  return BRANDS.find((b) => b.id === id);
}

/** Creates a fresh brand record with safe, confirmable defaults (for Admin). */
export function createBlankBrand(name: string): Brand {
  const slug =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `brand-${Date.now().toString(36)}`;
  return {
    id: slug,
    name: name.trim() || "New brand",
    shortName: name.trim() || "New brand",
    category: "Publication",
    region: NEEDS_CONFIRMATION,
    audience: NEEDS_CONFIRMATION,
    description: NEEDS_CONFIRMATION,
    tone: NEEDS_CONFIRMATION,
    designPersonality: NEEDS_CONFIRMATION,
    designDirection: NEEDS_CONFIRMATION,
    bestUseCases: [],
    newsletterUses: [],
    socialUses: [],
    logoAssets: standardLogoSlots(),
    palette: placeholderPalette(),
    typography: typographyFor("Confirm the official fonts in the brand guide before use."),
    dos: [],
    donts: [],
    copyExamples: [],
    campaignExamples: [],
    approvalStatus: "needs-confirmation",
    notes: "",
    tags: ["Newspaper"],
    uiHue: Math.floor(Math.random() * 360),
  };
}

export const FILTER_TAGS = [
  "Digital",
  "Newspaper",
  "Sport",
  "Cape Town",
  "Johannesburg",
  "Pretoria",
  "Durban/KZN",
  "Zulu-language",
  "National",
] as const;
