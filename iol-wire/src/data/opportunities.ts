import type { Opportunity, OpportunityType } from "@/types";

/**
 * Fictional demo listings written for the prototype, modelled on the kinds of
 * roles, learnerships and bursaries South African 18-24s actually search for.
 * Not real vacancies.
 *
 * Every record carries a real ISO deadline so the countdown is computed rather
 * than typed, and its own about/requirements/benefits copy rather than the
 * shared template text the original prototype reused on every card.
 */
export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "o-data",
    type: "Job",
    title: "Junior Data Analyst",
    org: "Discovery",
    location: "Sandton, Johannesburg",
    remote: false,
    tag: "Graduate role",
    stipend: "R25 000 - R32 000 pm",
    blurb: "Turn claims data into the insight that decides what gets built next.",
    imageSeed: "wirejobdata",
    closesAt: "2026-12-12",
    skills: ["Excel", "SQL", "Dashboards", "Statistics"],
    verified: true,
    applyMethod: "in-app",
    about:
      "You sit inside the health analytics team, between the actuaries and the product managers. Most of the work is answering questions nobody has asked cleanly yet: why a claims category moved, which members are about to lapse, what a benefit change would cost.",
    requirements: [
      "A completed degree or diploma in anything quantitative",
      "SQL you can write from memory, not just read",
      "One project you can walk through end to end",
    ],
    benefits: [
      "Medical aid and retirement from month one",
      "Study support for a part-time honours",
      "A mentor from the actuarial team for your first year",
    ],
  },
  {
    id: "o-marketing",
    type: "Internship",
    title: "Digital Marketing Intern",
    org: "Woolworths",
    location: "Cape Town",
    remote: false,
    tag: "12 months",
    stipend: "R12 000 pm",
    blurb: "Rotate through social, CRM and content at a brand people actually defend.",
    imageSeed: "wirejobmkt",
    closesAt: "2026-12-05",
    skills: ["Social media", "Copywriting", "Analytics", "Canva"],
    verified: true,
    applyMethod: "in-app",
    about:
      "Three four-month rotations. You will write and schedule, read the numbers afterwards, and present what you learned to the team that owns the channel. By the end you will have shipped campaigns you can show.",
    requirements: [
      "Any marketing, media or communications qualification",
      "A portfolio, a feed or a newsletter you have actually run",
      "Based in Cape Town or willing to move",
    ],
    benefits: [
      "Staff discount",
      "A named manager in each rotation",
      "First look at permanent roles when they open",
    ],
  },
  {
    id: "o-learn",
    type: "Learnership",
    title: "Software Development Learnership",
    org: "MICT SETA",
    location: "Midrand",
    remote: true,
    tag: "No degree needed",
    stipend: "R6 500 pm stipend",
    blurb: "Twelve stipend-paid months into full-stack work. Matric is the only gate.",
    imageSeed: "wirejoblearn",
    closesAt: "2027-01-16",
    skills: ["JavaScript", "Git", "HTML & CSS"],
    verified: true,
    applyMethod: "in-app",
    about:
      "Fully funded NQF Level 5. Mornings are structured curriculum, afternoons are a real team's backlog. You finish with a recognised qualification and twelve months of commit history.",
    requirements: [
      "Matric with maths or maths literacy",
      "South African ID",
      "18-34 and not in full-time study",
    ],
    benefits: [
      "Laptop and data for the full twelve months",
      "NQF Level 5 on completion",
      "Placement support at partner firms",
    ],
  },
  {
    id: "o-bursary",
    type: "Bursary",
    title: "Engineering Bursary 2027",
    org: "Sasol",
    location: "Nationwide",
    remote: false,
    tag: "Full cost of study",
    blurb: "Fees, residence, books and a laptop, with vacation work each December.",
    imageSeed: "wirejobburs",
    closesAt: "2026-12-31",
    skills: ["Maths", "Physical Science"],
    verified: true,
    applyMethod: "external",
    applyUrl: "https://www.sasolbursaries.com",
    about:
      "Covers chemical, mechanical, electrical and industrial engineering at any public South African university. Carries a work-back obligation of one year per year funded.",
    requirements: [
      "70% or higher in Maths and Physical Science",
      "Accepted, or applied, to a public SA university",
      "South African citizen",
    ],
    benefits: [
      "Tuition, residence, meals, books and a laptop",
      "Paid vacation work every December",
      "A graduate post at the end, subject to results",
    ],
  },
  {
    id: "o-ux",
    type: "Course",
    title: "UX Design Foundations",
    org: "Explore Data Science Academy",
    location: "Online",
    remote: true,
    tag: "6 weeks, part time",
    blurb: "A portfolio-first sprint taught by designers who still ship.",
    imageSeed: "wirejobux",
    closesAt: "2026-12-08",
    skills: ["Figma", "User research", "Prototyping"],
    verified: true,
    applyMethod: "external",
    applyUrl: "https://explore-datascience.net",
    about:
      "Six weeks, two evenings a week, one brief carried the whole way through: research, wireframes, prototype, usability test, case study. You leave with one portfolio piece rather than six exercises.",
    requirements: ["No prior design experience", "A laptop and a stable connection"],
    benefits: ["A finished case study", "A portfolio review in the final week"],
  },
  {
    id: "o-comp",
    type: "Competition",
    title: "Hot Young Designer Award",
    org: "Design Indaba",
    location: "Nationwide",
    remote: true,
    tag: "Design competition",
    stipend: "R100 000 prize",
    blurb: "Design something for a public space and get paid if it gets built.",
    imageSeed: "wirejobcomp",
    closesAt: "2027-02-27",
    skills: ["Product design", "Making", "Presentation"],
    verified: true,
    applyMethod: "external",
    applyUrl: "https://www.designindaba.com",
    about:
      "Open to designers under 30. Submit a concept for furniture, lighting or a wall piece. Shortlisted entrants get a materials budget to build the prototype.",
    requirements: ["Under 30", "SA-based", "One concept per entrant"],
    benefits: [
      "R100 000 for the winning piece",
      "Production across the partner venues",
      "Mentorship from the design panel",
    ],
  },
  {
    id: "o-news",
    type: "Internship",
    title: "Newsroom Cadet Programme",
    org: "Independent Media",
    location: "Cape Town",
    remote: false,
    tag: "12 months",
    stipend: "R11 500 pm",
    blurb: "Learn the trade on a live desk, filing from week one.",
    imageSeed: "wirejobnews",
    closesAt: "2026-12-19",
    skills: ["Writing", "Interviewing", "Shorthand"],
    verified: true,
    applyMethod: "in-app",
    about:
      "You are assigned to a desk and a senior journalist. Expect to file short pieces in your first week and carry your own rounds by month three. Court and council reporting are part of the rotation.",
    requirements: [
      "A journalism, media or English qualification",
      "Three published pieces, student press counts",
      "A valid driver's licence",
    ],
    benefits: [
      "A byline from week one",
      "Media law and ethics training",
      "Considered first for junior reporter posts",
    ],
  },
  {
    id: "o-tech",
    type: "Job",
    title: "Junior Front-End Developer",
    org: "Yoco",
    location: "Cape Town",
    remote: true,
    tag: "Hybrid",
    stipend: "R28 000 - R38 000 pm",
    blurb: "Build the screens small businesses use to take their money.",
    imageSeed: "wirejobdev",
    closesAt: "2026-12-22",
    skills: ["React", "TypeScript", "CSS", "Testing"],
    verified: true,
    applyMethod: "in-app",
    about:
      "The merchant dashboard team. Real users are hairdressers, spaza owners and food trucks, which keeps the work honest: if a screen is confusing, somebody loses a sale that day.",
    requirements: [
      "React and TypeScript in something you have shipped",
      "A repository we can read",
      "No degree requirement",
    ],
    benefits: ["Hybrid, two days in", "A real hardware budget", "Conference budget each year"],
  },
  {
    id: "o-film",
    type: "Learnership",
    title: "Film & TV Production Learnership",
    org: "NFVF",
    location: "Johannesburg",
    remote: false,
    tag: "Fully funded",
    stipend: "R7 000 pm stipend",
    blurb: "On real sets from month two, not a classroom with a camera in it.",
    imageSeed: "wirejobfilm",
    closesAt: "2027-01-30",
    skills: ["Camera", "Lighting", "Sound", "Editing"],
    verified: true,
    applyMethod: "in-app",
    about:
      "Twelve months across camera, grip, sound and post. The first month is classroom; after that you are attached to productions as a paid trainee.",
    requirements: ["Matric", "18-30", "Able to work irregular hours"],
    benefits: [
      "Industry-recognised certificate",
      "Union introduction",
      "Credits on real productions",
    ],
  },
  {
    id: "o-sales",
    type: "Job",
    title: "Retail Sales Associate",
    org: "Sportscene",
    location: "Durban",
    remote: false,
    tag: "Entry level",
    stipend: "R7 500 pm + commission",
    blurb: "Shift work on the floor, with commission that rewards knowing the stock.",
    imageSeed: "wirejobretail",
    closesAt: "2026-12-02",
    skills: ["Customer service", "Point of sale"],
    verified: false,
    applyMethod: "external",
    applyUrl: "https://www.sportscene.co.za",
    about:
      "Floor sales in a high-traffic mall store. Shifts include weekends and public holidays. Commission is paid monthly against a team target.",
    requirements: ["Matric", "Available weekends", "Retail experience helps but is not required"],
    benefits: ["Staff discount", "Monthly commission", "Shift flexibility around study"],
  },
];

export const OPPORTUNITY_MAP: Record<string, Opportunity> = Object.fromEntries(
  OPPORTUNITIES.map((o) => [o.id, o])
);

export function getOpportunity(id: string | null | undefined): Opportunity | undefined {
  return id ? OPPORTUNITY_MAP[id] : undefined;
}

export const OPPORTUNITY_TYPES: (OpportunityType | "All")[] = [
  "All",
  "Job",
  "Internship",
  "Learnership",
  "Bursary",
  "Course",
  "Competition",
];

/** Accent per type, pulled from the category palette so Build matches the feed. */
export const TYPE_COLOR: Record<OpportunityType, string> = {
  Job: "#6FBFFF",
  Internship: "#D9A0FF",
  Learnership: "#6EE087",
  Bursary: "#FFD166",
  Course: "#8FE6CF",
  Competition: "#FF8FB1",
};

/**
 * Days until a listing closes; negative once it has.
 * Derived from the ISO date so a demo left running overnight stays honest.
 */
export function daysUntilClose(o: Opportunity, now = Date.now()): number {
  return Math.ceil((new Date(o.closesAt + "T23:59:59").getTime() - now) / 86400000);
}

/** One formatter, so the card, the detail sheet and the tracker always agree. */
export function closingLabel(o: Opportunity, now = Date.now()): string {
  const d = daysUntilClose(o, now);
  if (d < 0) return "Closed";
  if (d === 0) return "Closes today";
  if (d === 1) return "1 day left";
  if (d <= 14) return `${d} days left`;
  return (
    "Closes " +
    new Date(o.closesAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })
  );
}
