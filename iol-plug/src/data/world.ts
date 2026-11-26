import type { Article, WireSource } from "@/types";

/**
 * The world wire.
 *
 * These stories are pulled from international outlets by the crawler. Two
 * rules follow from that and are enforced in code, not left to an editor:
 *
 *  1. No outbound link. We never hand a reader to someone else's site, so a
 *     world story has no "read the original" anywhere in the UI.
 *  2. No republication. We carry a short summary and the key points — what
 *     the story says — not the outlet's own paragraphs. That is the only
 *     position that is both honest about sourcing and safe on copyright.
 *
 * `origin: "world"` is what switches both behaviours on. See
 * `article-reader.tsx` for the reader side.
 */

export const WIRE_SOURCES: WireSource[] = [
  { id: "reuters", name: "Reuters", region: "United Kingdom", origin: "world" },
  { id: "ap", name: "Associated Press", region: "United States", origin: "world" },
  { id: "afp", name: "Agence France-Presse", region: "France", origin: "world" },
  { id: "aljazeera", name: "Al Jazeera", region: "Qatar", origin: "world" },
  { id: "guardian", name: "The Guardian", region: "United Kingdom", origin: "world" },
];

/**
 * Fictional demo wire copy written for the prototype. Real crawler output
 * replaces this array wholesale — the shape is the contract.
 */
type WorldSeed = Omit<Article, "comments">;

const WORLD_SEEDS: WorldSeed[] = [
  {
    id: "w-climate",
    type: "article",
    section: "science",
    category: "science",
    source: "Reuters",
    origin: "world",
    publishedAt: "22m",
    readLabel: "40 sec",
    likes: "3.1k",
    imageSeed: "wireworldclimate",
    trending: true,
    title: "COP31 ends with a fund, and an argument about who pays into it",
    summary:
      "Delegates agreed a loss-and-damage facility at the final hour. Who contributes, and how much, was left to next year.",
    tldr: [
      "A loss-and-damage fund was agreed in the closing session.",
      "Contributions are voluntary, with no figures attached yet.",
      "African delegations called the result a floor, not a settlement.",
    ],
    explain:
      "Rich countries caused most historic emissions; poorer countries are taking most of the damage. A loss-and-damage fund is money from the first group to the second. The fight is never about whether it should exist, it is about who writes the cheque.",
    whyItMatters:
      "South Africa is among the countries that would draw on the fund after floods and drought. Whether it ever holds real money is decided over the next year.",
    body: [
      "Delegates agreed to establish the facility in a closing session that ran several hours past its deadline, resolving the question of whether a fund would exist while leaving the question of its size entirely open.",
      "Contributions remain voluntary. No country announced a figure in the room, and the text sets no floor, which negotiators from several African and small-island delegations described afterwards as the weakest acceptable outcome rather than a win.",
    ],
  },
  {
    id: "w-chips",
    type: "article",
    section: "technology",
    category: "technology",
    source: "Associated Press",
    origin: "world",
    publishedAt: "1h",
    readLabel: "35 sec",
    likes: "2.4k",
    imageSeed: "wireworldchips",
    title: "The chip shortage is over. The chip surplus is now the problem",
    summary:
      "Two years of frantic factory building has tipped into oversupply, and the price of memory is falling fast.",
    tldr: [
      "Memory chip prices have fallen for three consecutive quarters.",
      "Several planned fabrication plants have been paused.",
      "Cheaper components should reach phone and laptop prices next year.",
    ],
    explain:
      "When chips were scarce, every government funded new factories. Those factories are now finishing at the same time, all producing at once, so there are more chips than buyers and prices drop.",
    whyItMatters:
      "Phones and laptops are priced in dollars before they reach South African shelves. A sustained component glut is one of the few things that pushes those prices down.",
    body: [
      "Memory prices have now fallen for a third consecutive quarter, reversing the scarcity that defined the sector through the early part of the decade and prompting several manufacturers to pause plants that were announced at the peak.",
      "Analysts expect the saving to reach consumer devices from the middle of next year, though handset makers have historically been slower to pass component savings on than to pass increases up.",
    ],
  },
  {
    id: "w-football",
    type: "article",
    section: "sport",
    category: "football",
    source: "Agence France-Presse",
    origin: "world",
    publishedAt: "2h",
    readLabel: "30 sec",
    likes: "8.8k",
    imageSeed: "wireworldfoot",
    trending: true,
    title: "Afcon expands to 32 teams from 2029",
    summary:
      "CAF confirmed the expansion after a vote in Cairo, adding eight places and a new group stage.",
    tldr: [
      "The Africa Cup of Nations grows from 24 teams to 32 in 2029.",
      "Eight more qualifying places open across the confederation.",
      "The tournament gains a week and a redesigned group stage.",
    ],
    explain:
      "More teams means more countries get to play, and the countries that usually just miss out now have a realistic route in. It also means more matches, which is where the money is.",
    whyItMatters:
      "Bafana Bafana qualify more often under a 32-team format, and more SA players get seen by European scouts at a tournament that is already their biggest shop window.",
    body: [
      "The confederation confirmed the expansion following a vote of its executive committee in Cairo, taking the tournament to 32 teams from the 2029 edition and adding eight qualifying places across the existing zones.",
      "The competition will run roughly a week longer, with a redesigned group stage. Broadcast and sponsorship arrangements are expected to be renegotiated before the next cycle opens.",
    ],
  },
  {
    id: "w-ai",
    type: "article",
    section: "technology",
    category: "ai",
    source: "The Guardian",
    origin: "world",
    publishedAt: "3h",
    readLabel: "45 sec",
    likes: "5.6k",
    imageSeed: "wireworldai",
    factChecked: true,
    title: "EU opens first investigation under its AI transparency rules",
    summary:
      "Regulators want to know how two large models were trained, and on whose work. Penalties can reach 7% of global turnover.",
    tldr: [
      "The first formal probe under the EU AI Act has been opened.",
      "It centres on training-data disclosure, not on model output.",
      "Fines can reach 7% of worldwide annual turnover.",
    ],
    explain:
      "The EU's AI law says big model makers must publish a summary of what they trained on. Two companies filed summaries regulators think are too vague to count, so they are being asked to show more.",
    whyItMatters:
      "Whatever disclosure standard Europe settles on tends to become the global default, which shapes what these tools cost and what they are allowed to learn from.",
    body: [
      "The Commission said the proceedings concern the adequacy of published training-data summaries rather than the behaviour of the models themselves, making this a test of the Act's transparency provisions rather than its risk tiers.",
      "Companies found in breach face penalties of up to 7% of worldwide annual turnover. Both firms said they would cooperate and defended their filings as compliant.",
    ],
  },
  {
    id: "w-markets",
    type: "article",
    section: "business",
    category: "finance",
    source: "Reuters",
    origin: "world",
    publishedAt: "5h",
    readLabel: "30 sec",
    likes: "1.9k",
    imageSeed: "wireworldmarkets",
    title: "Gold passes $3 400 as central banks keep buying",
    summary:
      "A fifth straight quarter of official-sector buying pushed the metal to another record.",
    tldr: [
      "Gold set a fresh record above $3 400 an ounce.",
      "Central banks have been net buyers for five quarters.",
      "Mining shares on the JSE rose with the metal.",
    ],
    explain:
      "Central banks are swapping some of their dollars for gold. When that many large buyers want the same limited thing, the price climbs.",
    whyItMatters:
      "Gold mining is still one of South Africa's biggest employers, and the JSE's resources index moves with the metal. A sustained high price protects jobs on the Reef.",
    body: [
      "The metal set another record in European trading, extending a run driven primarily by official-sector demand rather than by retail or industrial buying.",
      "Johannesburg-listed miners tracked the move upward. Analysts cautioned that a reversal in central bank appetite would remove the main support under the price.",
    ],
  },
];

export const WORLD_ARTICLES: Article[] = WORLD_SEEDS.map((s) => ({
  ...s,
  // World stories carry no comment thread: we are not hosting a discussion
  // under reporting we did not do and cannot stand behind line by line.
  comments: [],
}));
