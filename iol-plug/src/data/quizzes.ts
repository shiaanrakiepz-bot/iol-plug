import type { Quiz } from "@/types";

/**
 * One question per story, written by hand.
 *
 * Deliberately not generated from the summary: a question built out of the
 * same sentence the reader just saw tests short-term recall of wording, not
 * whether they followed the story. Each of these asks for the thing you only
 * know if you took the point — the mechanism, the consequence, the catch.
 *
 * `because` runs whether you were right or wrong, so a miss still teaches.
 */
export const QUIZZES: Quiz[] = [
  {
    articleId: "storm",
    question: "Why does a cold front hitting the Cape cause so much at once?",
    options: [
      "It traps warm air against the mountain, which builds heat",
      "Cold air pushing into warmer air drags in wind, swell and rain together",
      "It pulls moisture off the Karoo and dumps it on the coast",
    ],
    answer: 1,
    because:
      "A front is a boundary between air masses. When the colder one shoves in, the wind, the swell and the rain all arrive as part of the same system — which is why coastal plans collapse all at once rather than one at a time.",
  },
  {
    articleId: "burnout",
    question: "What distinguishes wellness travel from an ordinary holiday?",
    options: [
      "It has to be somewhere remote and hard to reach",
      "The trip is chosen for how it makes you feel, not what it photographs like",
      "It must include a formal therapy or medical programme",
    ],
    answer: 1,
    because:
      "That is the whole distinction the story draws. Sri Lanka's pull is that it is cheap to reach, warm year-round and set up for slow travel — not that it is exotic or clinical.",
  },
  {
    articleId: "pointduty",
    question: "What was Officer Adams actually doing at the intersection?",
    options: [
      "Standing in for traffic lights that had been out since Tuesday",
      "Performing at a scheduled city street festival",
      "Testing a new hand-signal system for the metro police",
    ],
    answer: 0,
    because:
      "The robots failed and he filled the gap. The choreography came later — which is the point of the story: the job was ordinary, the way he did it was not.",
  },
  {
    articleId: "m3",
    question: "What lets the electric M3 outhandle the petrol cars before it?",
    options: [
      "It is substantially lighter than the outgoing model",
      "Four motors drive each wheel independently, reacting faster than a driver",
      "A redesigned gearbox shifts quicker than the old dual-clutch",
    ],
    answer: 1,
    because:
      "Independent control of each wheel is the mechanism. A computer adjusts torque per corner faster than any human input — which is also why purists argue it is a different kind of car, not just a faster one.",
  },
  {
    articleId: "f1",
    question: "How long had it been since Formula 1 last raced in South Africa?",
    options: ["11 years", "33 years", "Since 2005"],
    answer: 1,
    because:
      "Alain Prost won the last South African Grand Prix in 1993. The gap is what made the return a story in itself, beyond the 0.08-second finish.",
  },
  {
    articleId: "foot",
    question: "What made the Sundowns result in Cairo so unusual?",
    options: [
      "They won away, with ten men, in stoppage time",
      "It was the first time the two clubs had ever met",
      "They came back from three goals down",
    ],
    answer: 0,
    because:
      "A red card before half-time, an away leg in front of 74 000, and a winner four minutes into stoppage time. No SA side had won in Cairo for 11 years.",
  },
  {
    articleId: "pol",
    question: "What does the Energy Resilience Bill actually change?",
    options: [
      "It funds new power stations directly from the national budget",
      "Any producer gets guaranteed grid access, and municipalities can buy from them",
      "It caps the price Eskom is allowed to charge municipalities",
    ],
    answer: 1,
    because:
      "The shift is structural, not financial. Opening grid access and letting municipalities contract producers directly is what breaks the single-supplier model — which is why analysts think stage 6 becomes near impossible.",
  },
  {
    articleId: "tech",
    question: "What does the story say about the founders in the Docks precinct?",
    options: [
      "Most have returned from working abroad",
      "The average founder age is 24, and some still live at home",
      "They are mainly funded by government innovation grants",
    ],
    answer: 1,
    because:
      "The detail that carries the piece is the 21-year-old Khoko co-founder commuting from Mitchells Plain after a R400 million round. Youth, not wealth, is the pattern.",
  },
  {
    articleId: "ai",
    question: "Why does the Thuto tutor reach learners other education apps miss?",
    options: [
      "It runs on WhatsApp with zero-rated data, so it works on cheap phones",
      "It is pre-installed on devices handed out by the department",
      "It works entirely offline once downloaded",
    ],
    answer: 0,
    because:
      "Distribution is the whole story. Building on WhatsApp with zero-rated data means it works on the R250 handsets learners actually own, rather than the devices education apps usually assume.",
  },
  {
    articleId: "music",
    question: "Why was the Coachella set treated as a turning point?",
    options: [
      "It was the festival's largest recorded crowd",
      "It was the first amapiano headline set at a major US festival",
      "It was the first time a South African had played the festival",
    ],
    answer: 1,
    because:
      "A headline slot, not just an appearance, is what made it a crossover moment — followed by a 300% overnight jump in international streams of SA artists.",
  },
  {
    articleId: "gaming",
    question: "What makes the MZWave qualification notable?",
    options: [
      "They are the first South Africans to reach Valorant Champions",
      "They are the youngest team ever to qualify",
      "They beat the reigning world champions to get there",
    ],
    answer: 0,
    because:
      "SA esports has produced talent for years without a world-stage qualification. That they did it on rented café machines, never having owned PCs, is the part that travelled.",
  },
  {
    articleId: "biz",
    question: "Why does a stronger rand matter to an ordinary household?",
    options: [
      "It raises the interest paid on savings accounts",
      "Imports, fuel and data get cheaper",
      "It increases the value of local property",
    ],
    answer: 1,
    because:
      "A stronger rand buys more abroad. Fuel is priced in dollars before it reaches the pump, so relief shows up in the things you buy rather than in what you earn.",
  },
  {
    articleId: "ct",
    question: "Why did cableway ticket prices fall?",
    options: [
      "A city subsidy was introduced for residents",
      "Running on solar cut the operating cost, and the saving was passed on",
      "Visitor numbers dropped, so prices were cut to compete",
    ],
    answer: 1,
    because:
      "Solar plus battery storage covers the full draw. Management chose to pass the saving to SA ID holders rather than bank it — which is the unusual part.",
  },
  {
    articleId: "snkr",
    question: "What does the Bathu sell-out signal?",
    options: [
      "A township-born brand outselling global giants on home ground",
      "That sneaker resale is now bigger than retail in SA",
      "That local brands are moving production offshore",
    ],
    answer: 0,
    because:
      "Eight thousand pairs in eleven minutes, designed with a Soweto collective. The story is about who gets to define SA streetwear, not about the shoe.",
  },
  {
    articleId: "bball",
    question: "How did the Tigers win after trailing by 18 at half-time?",
    options: [
      "The champions rested their starters in the second half",
      "They erased the deficit in a single quarter, led by a 19-year-old rookie",
      "The game went to double overtime",
    ],
    answer: 1,
    because:
      "Sive Mbolekwa, in his first professional season, hit five threes in the fourth including the dagger with 12 seconds left.",
  },
  {
    articleId: "health",
    question: "What problem is the Khusela app built to solve?",
    options: [
      "A shortage of qualified counsellors nationally",
      "Campus counselling waiting lists that run six weeks or longer",
      "The cost of medical aid for students",
    ],
    answer: 1,
    because:
      "In the pilot, average wait for a first conversation fell from 41 days to 8 minutes. For someone in crisis tonight, that gap is the entire point.",
  },
  {
    articleId: "cars",
    question: "What is the eBakkie's 'party trick'?",
    options: [
      "It charges fully in under twenty minutes",
      "It can power a household's essentials for up to three days",
      "It switches to petrol when the battery runs flat",
    ],
    answer: 1,
    because:
      "Vehicle-to-home. Plugged into a compatible inverter it back-feeds the house — which in a country with a load shedding history is arguably worth more than the range figure.",
  },

  /* ---- world wire ---- */
  {
    articleId: "w-climate",
    question: "What was left unresolved at COP31?",
    options: [
      "Whether a loss-and-damage fund should exist at all",
      "Who contributes to the fund, and how much",
      "Which countries are eligible to draw from it",
    ],
    answer: 1,
    because:
      "The facility was agreed; the money was not. Contributions are voluntary with no floor in the text, which is why African delegations called it the weakest acceptable outcome.",
  },
  {
    articleId: "w-chips",
    question: "Why did the chip shortage turn into a surplus?",
    options: [
      "Demand for phones and laptops collapsed",
      "Factories funded during the shortage all came online at once",
      "Manufacturers switched to older, cheaper production methods",
    ],
    answer: 1,
    because:
      "Every government funded new fabs during the scarcity. They finished together, so supply arrived in a block — and memory prices have now fallen three quarters running.",
  },
  {
    articleId: "w-football",
    question: "What changes for Afcon from 2029?",
    options: [
      "It expands from 24 to 32 teams, adding eight qualifying places",
      "It moves to a June-July window",
      "It drops the group stage for a straight knockout",
    ],
    answer: 0,
    because:
      "More places means countries that usually just miss out get a realistic route in — and more matches, which is where the broadcast money sits.",
  },
  {
    articleId: "w-ai",
    question: "What is the EU investigation actually about?",
    options: [
      "Harmful answers the models produced",
      "Whether published training-data summaries are adequate",
      "Companies operating without a European licence",
    ],
    answer: 1,
    because:
      "It tests the AI Act's transparency provisions, not its risk tiers. The question is disclosure of what the models learned from, not how they behave.",
  },
  {
    articleId: "w-markets",
    question: "What is driving gold past $3 400?",
    options: [
      "Retail investors buying coins and jewellery",
      "Central banks buying as net purchasers for five quarters",
      "Mining output falling sharply in South Africa",
    ],
    answer: 1,
    because:
      "Official-sector demand, not retail or industrial. Which also means the main support under the price disappears if central banks stop — the risk analysts keep flagging.",
  },
];

export const QUIZ_MAP: Record<string, Quiz> = Object.fromEntries(
  QUIZZES.map((q) => [q.articleId, q])
);

export function getQuiz(articleId: string | null | undefined): Quiz | undefined {
  return articleId ? QUIZ_MAP[articleId] : undefined;
}
