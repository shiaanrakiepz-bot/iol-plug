import type { Article, Comment } from "@/types";

const V = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

/** Commenter pool — avatar chips are initials on a category-ish colour. */
const VOICES: [initials: string, color: string, name: string][] = [
  ["LM", "#FF8FB1", "Lwazi M."],
  ["AK", "#7CC4FF", "Aisha K."],
  ["SD", "#6EE087", "Sipho D."],
  ["ZV", "#FFD166", "Zoe V."],
  ["KP", "#D9A0FF", "Kayden P."],
];

const REACTIONS: [text: string, likes: number, timeAgo: string][] = [
  ["This is actually huge for SA", 214, "2h"],
  ["Was there. Unreal atmosphere, still shaking", 96, "1h"],
  ["Sending this straight to the group chat", 41, "44m"],
  ["Okay but why is nobody talking about the last paragraph", 18, "12m"],
];

/**
 * Every story gets the same reaction set, attributed to a different rotation
 * of the voice pool so no two threads read identically.
 */
function seedComments(articleId: string): Comment[] {
  return REACTIONS.map(([text, likes, timeAgo], i) => {
    const [initials, color, author] =
      VOICES[(articleId.length + i) % VOICES.length];
    return {
      id: `${articleId}-c${i}`,
      author,
      initials,
      color,
      text,
      likes,
      timeAgo,
    };
  });
}

export function imageUrl(seed: string, w = 720, h = 1280): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/**
 * Poster for a story. Stories carrying a real asset serve it from /public at
 * its native size; the rest fall back to a sized picsum placeholder.
 */
export function posterUrl(
  article: Pick<Article, "image" | "imageSeed">,
  w = 720,
  h = 1280
): string {
  return article.image ?? imageUrl(article.imageSeed, w, h);
}

type Seed = Omit<Article, "comments">;

/**
 * Fictional demo copy written for the IOL Wire prototype — not real
 * reporting. Videos are Google's public sample clips.
 */
const SEEDS: Seed[] = [
  {
    id: "storm",
    type: "video",
    section: "capetown",
    category: "capetown",
    source: "IOL Weather",
    author: "zoe",
    publishedAt: "2m",
    readLabel: "0:17 watch",
    likes: "24.7k",
    breaking: true,
    trending: true,
    duration: "0:17",
    imageSeed: "iolstorm",
    image: "/stories/cape-storm.jpg",
    videoUrl: "/stories/cape-storm.mp4",
    posterFirst: true,
    caption:
      "Cue the dark clouds, dramatic soundtrack and crashing waves.",
    title: "The Western Cape has officially entered its villain arc",
    summary:
      "Today's forecast reads like the opening scene of a disaster movie. If you had outdoor plans, I'm so sorry — they are cancelled.",
    tldr: [
      "A deep cold front is sitting over the Western Cape today.",
      "Expect gale-force gusts, heavy swell and horizontal rain.",
      "Outdoor plans along the coast are effectively cancelled.",
    ],
    explain:
      "A cold front is a wall of cold air pushing into warmer air. When it hits the Cape it drags in strong wind, big waves and a lot of rain all at once — which is why the sky looks like the trailer for a disaster film.",
    whyItMatters:
      "Coastal roads flood, the swell closes harbours and Table Mountain's cableway shuts on days like this. Knowing before you leave saves you the drive.",
    body: [
      "Cue the dark clouds, dramatic soundtrack and crashing waves — today's forecast reads like the opening scene of a disaster movie.",
      "No, because who gave the weather permission to act like this? The Western Cape has officially entered its villain arc, and if you had outdoor plans today... I'm so sorry, but they are canceled.",
    ],
  },
  {
    id: "burnout",
    type: "video",
    section: "lifestyle",
    category: "travel",
    source: "IOL Lifestyle",
    author: "leah",
    publishedAt: "18m",
    readLabel: "0:07 watch",
    likes: "9.8k",
    trending: true,
    duration: "0:07",
    imageSeed: "iolburnout",
    image: "/stories/burnout-escape.jpg",
    videoUrl: "/stories/burnout-escape.mp4",
    posterFirst: true,
    caption: "Hey — is this a good time to talk about burnout?",
    title: "Burnout's new coping mechanism is a one-way ticket to Sri Lanka",
    summary:
      "Therapy is expensive. A flight, apparently, is a personality. Sri Lanka is quietly becoming everyone's emotional support destination.",
    tldr: [
      "Sri Lanka is one of the biggest wellness travel hotspots for 2026.",
      "Young travellers are booking to disconnect, not to chase a trend.",
      "Think sunrise meditation, surfing before breakfast and jungle retreats.",
    ],
    explain:
      "Wellness travel means picking a trip for how it makes you feel rather than what you can photograph. Sri Lanka has become a favourite because it is cheap to reach, warm all year, and set up for exactly that kind of slow, quiet holiday.",
    whyItMatters:
      "Burnout is hitting people earlier every year, and a week away is often cheaper than a month of private therapy. Where this generation goes to recover is becoming its own economy.",
    body: [
      "Need a new coping mechanism for burnout? Therapy is already expensive... so maybe you should book a flight to Sri Lanka. At least this coping mechanism comes with beaches.",
      "Sri Lanka is quietly becoming everyone's emotional support destination, as it has become one of the world's biggest wellness travel hotspots for 2026. And we're not just talking about overpriced smoothies and yoga poses for Instagram.",
      "Think sunrise meditation overlooking the ocean, surfing before breakfast, jungle retreats, and food that's actually good for your body. It's basically giving Eat, Pray, Love... without needing a full-on life crisis first.",
      "Many young travellers are choosing experiences that help them disconnect from stress instead of just chasing the next wellness trend. So if your For You Page has suddenly become nothing but travel content... maybe your algorithm is telling you something.",
      "So book that flight and abuse your leave days. Because you deserve a break where the only thing asking for your attention is the ocean.",
    ],
  },
  {
    id: "pointduty",
    type: "video",
    section: "local",
    category: "local",
    source: "IOL News",
    author: "shazia",
    publishedAt: "1h",
    readLabel: "0:34 watch",
    likes: "112k",
    trending: true,
    duration: "0:34",
    imageSeed: "iolpoint",
    image: "/stories/point-duty.jpg",
    videoUrl: "/stories/point-duty.mp4",
    posterFirst: true,
    caption: "The funniest people online live in this country, sorry.",
    title: "The point-duty officer turning a beachfront intersection into a stage",
    summary:
      "Broken robots, a jammed promenade, and one officer directing traffic like a conductor. The internet has decided he is a national treasure.",
    tldr: [
      "A traffic officer went viral for directing cars with full choreography.",
      "The clip has passed 4 million views in a day.",
      "The city says he has worked the same intersection for nine years.",
    ],
    explain:
      "The traffic lights at a busy beachfront intersection stopped working, so an officer stepped in to direct cars by hand. Instead of just waving them through, he did it with rhythm — and someone filmed it.",
    whyItMatters:
      "It is a small thing that made a lot of people's day, and a reminder that the people keeping a city moving are usually invisible until someone points a camera at them.",
    body: [
      "The robots at the beachfront intersection have been out since Tuesday. Officer Marlon Adams has been standing in the middle of them ever since, and somewhere around Thursday he stopped merely directing traffic and started performing it.",
      "The clip — thirty-four seconds of immaculate footwork between a stop sign and oncoming traffic — passed four million views in a day. In the comments, drivers who sat through the jam insisted they did not mind waiting.",
      "The city confirmed Adams has worked the same corner for nine years. “The cars must move and the people must smile,” he said when reached for comment. “Both are my job.”",
      "He has since been offered a slot at a summer festival, three brand deals and, according to one commenter, the mayoralty.",
    ],
  },
  {
    id: "m3",
    type: "video",
    section: "cars",
    category: "cars",
    source: "IOL Motoring",
    author: "shi-aan",
    publishedAt: "5m",
    readLabel: "1:00 watch",
    likes: "18.2k",
    trending: true,
    duration: "1:00",
    imageSeed: "iolm3",
    image: "/stories/bmw-m3-e92.png",
    videoUrl: "/stories/bmw-m3-e92.mp4",
    posterFirst: true,
    caption: "The new M3 might beat the E92... but can it replace it?",
    title: "Better than the E92? BMW's next M3 goes electric",
    summary:
      "Over 600 horsepower, four electric motors, and torque to outrun every M3 before it. The question is whether it can replace a legend.",
    tldr: [
      "The next M3 is expected to make over 600 horsepower.",
      "Four electric motors drive each wheel independently.",
      "It should outperform every M3 before it — on paper.",
    ],
    explain:
      "BMW's next M3 swaps its petrol engine for four electric motors, one at each wheel. Because a computer controls each wheel separately, it can react faster than a driver can, which makes the car quicker and easier to control.",
    whyItMatters:
      "The M3 badge has meant a howling petrol engine for forty years. If BMW can make an electric one feel like an M3, it settles the argument for every performance car that follows.",
    body: [
      "This is BMW's next M3. I know... it doesn't sound like an M3, does it?",
      "It's expected to have over 600 horsepower. Four electric motors. And enough instant torque to outperform every M3 before it.",
      "Power is sent to each wheel independently, reacting faster than any driver ever could. This is what happens when BMW stops chasing bigger engines and starts chasing smarter performance.",
      "On paper, this could be the greatest M3 BMW has ever built. But every legend has a benchmark. And for the M3... it's this.",
    ],
  },
  {
    id: "f1",
    type: "video",
    section: "sport",
    category: "formula1",
    source: "IOL Motorsport",
    publishedAt: "12m",
    readLabel: "0:42 watch",
    likes: "12.4k",
    breaking: true,
    factChecked: true,
    trending: true,
    duration: "0:42",
    imageSeed: "iolf1",
    videoUrl: `${V}/SubaruOutbackOnStreetAndDirt.mp4`,
    caption:
      "The final lap: Verstappen holds the inside line into Crowthorne.",
    title: "Kyalami roars back: Verstappen pips Norris by 0.08 seconds",
    summary:
      "F1 returned to South African soil after 33 years — and delivered the closest finish of the season in front of 90 000 fans.",
    tldr: [
      "First SA Grand Prix since 1993, at an upgraded Kyalami.",
      "Verstappen beat Norris by 0.08s — the closest finish this season.",
      "Kyalami is locked onto the F1 calendar until 2031.",
    ],
    explain:
      "Formula 1 used to race in South Africa but stopped in 1993. This weekend it came back. Two drivers fought for the win the whole race, and the champion won by less than a blink of an eye.",
    whyItMatters:
      "A home Grand Prix puts SA motorsport, tourism and engineering on the world stage — and 2027 tickets go on sale Friday.",
    body: [
      "Thirty-three years after Alain Prost won the last South African Grand Prix, Formula 1 came home — and Kyalami delivered an instant classic. Max Verstappen crossed the line 0.08 seconds ahead of Lando Norris after 72 laps of wheel-to-wheel racing.",
      "The upgraded circuit drew 90 000 fans, with millions more streaming locally — the biggest live sports audience in SABC history. Traffic on the M1 was, predictably, less of a classic.",
      "“The energy here is unlike anywhere we race,” Verstappen said afterwards. Organisers confirmed Kyalami holds a contract through 2031, with a sprint weekend planned for next season.",
    ],
    timeline: [
      { label: "1993", text: "Last SA Grand Prix — won by Alain Prost" },
      { label: "2024", text: "Kyalami bid launched with F1" },
      { label: "2025", text: "Circuit upgraded to FIA Grade 1" },
      { label: "TODAY", text: "Lights out in front of 90 000 fans" },
    ],
  },
  {
    id: "foot",
    type: "article",
    section: "sport",
    category: "football",
    source: "IOL Sport",
    publishedAt: "28m",
    readLabel: "2 min read",
    likes: "8.9k",
    factChecked: true,
    trending: true,
    imageSeed: "iolfoot",
    title: "Sundowns silence Cairo: 94th-minute rocket sinks Al Ahly",
    summary:
      "Ten-man Mamelodi Sundowns pulled off the CAF Champions League shock of the year — away, in front of 74 000.",
    tldr: [
      "Sundowns beat Al Ahly 2–1 away in the Champions League semi.",
      "The winner came in the 94th minute, with ten men on the pitch.",
      "They now top the tie with the home leg still to come.",
    ],
    explain:
      "Sundowns played the biggest club in Africa, in their stadium, with one player sent off — and still won with nearly the last kick of the game.",
    whyItMatters:
      "No SA side has won in Cairo in 11 years. Win the home leg and Sundowns are 90 minutes from the final.",
    body: [
      "The Brazilians arrived in Cairo as underdogs and lost Teboho Mokoena to a red card before half-time. What followed was the most disciplined defensive performance of Rhulani Mokwena’s era.",
      "Then, four minutes into stoppage time, Peter Shalulile chested down a clearance on the edge of the box and buried it into the top corner. Seventy-four thousand people went silent at once.",
      "“We came here to make the country proud,” Shalulile said. The return leg at Loftus is already sold out.",
    ],
  },
  {
    id: "pol",
    type: "article",
    section: "politics",
    category: "politics",
    source: "IOL Politics",
    publishedAt: "1h",
    readLabel: "3 min read",
    likes: "5.2k",
    factChecked: true,
    trending: true,
    imageSeed: "iolpol",
    title: "Stage 0, forever? Inside the bill that could end load shedding for good",
    summary:
      "Parliament passed the Energy Resilience Bill 232–108. Here is what actually changes — minus the jargon.",
    tldr: [
      "The bill guarantees grid access for private solar and wind producers.",
      "Municipalities can now buy power directly from anyone who makes it.",
      "Analysts say stage 6 events become “near impossible” by 2028.",
    ],
    explain:
      "South Africa used to rely on one company for almost all its electricity. This new law lets lots of smaller producers sell power too, so if one plant breaks, the lights stay on.",
    whyItMatters:
      "Electricity has shaped everything from matric results to the rand. If this works, it is the biggest economic unlock in a decade.",
    body: [
      "The Energy Resilience Bill passed its final reading on Tuesday by 232 votes to 108, capping three years of negotiation. It rewrites who is allowed to generate, sell and move electricity in South Africa.",
      "The headline change: any producer — from a rooftop in Soweto to a wind farm in the Karoo — gets guaranteed, regulated access to the grid. Municipalities can contract them directly.",
      "Energy analyst Thandi Mabaso calls it “the quiet end of the load shedding era”. The first municipal power deals are expected before December.",
    ],
    timeline: [
      { label: "2019", text: "Stage 6 load shedding hits for the first time" },
      { label: "2023", text: "Private generation cap scrapped" },
      { label: "2025", text: "Grid stabilises — a full year at stage 0" },
      { label: "TODAY", text: "Energy Resilience Bill passes 232–108" },
    ],
  },
  {
    id: "tech",
    type: "article",
    section: "technology",
    category: "technology",
    source: "IOL Tech",
    publishedAt: "2h",
    readLabel: "3 min read",
    likes: "6.7k",
    trending: true,
    imageSeed: "ioltech",
    title: "Inside “Silicon Docks”: the Cape Town startups minting 21-year-old millionaires",
    summary:
      "A strip of warehouses near the V&A is now home to 40 startups, three unicorn hopefuls and a lot of very young money.",
    tldr: [
      "40+ startups now operate from the redeveloped Docks precinct.",
      "Three companies are valued above R1 billion.",
      "The average founder age is 24.",
    ],
    explain:
      "A group of old warehouses in Cape Town got turned into cheap offices for tech companies. Some of those companies are now worth huge amounts, and many founders are barely out of school.",
    whyItMatters:
      "SA’s tech sector now employs more graduates than mining. Where this generation builds decides where the next decade’s jobs are.",
    body: [
      "Five years ago the buildings between the harbour and the highway stored fish. Today they store servers — and the ambitions of the youngest founder class in the country’s history.",
      "Payments startup Khoko, founded by two UCT dropouts, closed a R400 million round last month. Its co-founder, 21, still lives with his parents in Mitchells Plain. “The commute is the hard part,” he laughs.",
      "Investors from Lagos, London and San Francisco flew in for last week’s demo day. Of the 14 companies that pitched, 11 walked away with term sheets.",
    ],
  },
  {
    id: "ai",
    type: "article",
    section: "technology",
    category: "ai",
    source: "IOL Tech",
    publishedAt: "3h",
    readLabel: "2 min read",
    likes: "9.1k",
    factChecked: true,
    trending: true,
    imageSeed: "iolai",
    title: "Your new matric tutor is an AI — and it is completely free",
    summary:
      "The education department switched on a national AI tutor that speaks all 11 official languages. One million learners signed up in a week.",
    tldr: [
      "Free AI tutor launched for grades 8–12, in 11 languages.",
      "It runs on WhatsApp — no smartphone app or data plan needed.",
      "One million learners registered in the first seven days.",
    ],
    explain:
      "The government built a chatbot that helps with homework. You message it like a friend on WhatsApp, ask it maths or science questions, and it explains the answer step by step — for free.",
    whyItMatters:
      "Private tutoring costs more per month than many households earn. This levels a playing field that has never been level.",
    body: [
      "The tutor, called Thuto, answers questions in text or voice notes and adapts its explanations to each learner’s pace. It was trained on the full CAPS curriculum.",
      "Because it runs over WhatsApp with zero-rated data, it works on the R250 phones that most learners actually own — not the devices education apps usually assume.",
      "Early pilots in Limpopo showed a 23% improvement in maths pass rates. “It never gets tired of my questions,” one grade 11 learner told IOL.",
    ],
  },
  {
    id: "music",
    type: "video",
    section: "entertainment",
    category: "music",
    source: "IOL Entertainment",
    publishedAt: "45m",
    readLabel: "0:31 watch",
    likes: "21.3k",
    trending: true,
    duration: "0:31",
    imageSeed: "iolmusic",
    videoUrl: `${V}/ForBiggerFun.mp4`,
    caption: "Waffles opens with Tanzania as the sun sets over the main stage.",
    title: "Uncle Waffles just broke Coachella — amapiano has gone fully global",
    summary:
      "The Coachella main stage, 100 000 people, and a log drum. Watch the moment the desert learned to dance.",
    tldr: [
      "Uncle Waffles headlined Coachella’s main stage on Saturday.",
      "It is the first amapiano headline set at a major US festival.",
      "Streams of SA artists jumped 300% overnight.",
    ],
    explain:
      "Amapiano is a style of dance music invented in South African townships. One of its biggest DJs just played the most famous festival in America, to one of its biggest crowds ever.",
    whyItMatters:
      "Every global genre had a crossover moment — this was amapiano’s. SA artists’ bookings and royalties will feel it for years.",
    body: [
      "She opened with “Tanzania” and by the second drop the overhead shots showed a hundred thousand people moving in sync with a sound born in Katlehong.",
      "Industry trackers logged a 300% overnight jump in international streams of South African artists. Three US labels announced amapiano imprints before Monday.",
      "“We are not a moment, we are a movement,” Waffles told the crowd. The internet, for once, agreed unanimously.",
    ],
  },
  {
    id: "gaming",
    type: "article",
    section: "gaming",
    category: "gaming",
    source: "IOL Tech",
    publishedAt: "5h",
    readLabel: "2 min read",
    likes: "4.4k",
    imageSeed: "iolgame",
    title: "Two Joburg teens just qualified for the Valorant world champs",
    summary:
      "They practise in a Fordsburg internet café with 40ms ping. Now they are flying to Seoul with a shot at $1 million.",
    tldr: [
      "Duo “MZWave” won the EMEA qualifier from a Fordsburg café.",
      "They are the first South Africans to reach Valorant Champions.",
      "The prize pool in Seoul is $2.25 million.",
    ],
    explain:
      "Two 17-year-olds from Johannesburg beat teams from all over Europe, the Middle East and Africa at a video game called Valorant. Now they compete at the world finals in South Korea.",
    whyItMatters:
      "SA esports has produced talent for years but never a world-stage qualification. Sponsors, and parents, are paying attention now.",
    body: [
      "Thabang “Wave” Ndlovu and Muhammad “MZ” Patel met in a Discord server three years ago. They have still never owned their own PCs.",
      "Playing on rented café machines, the pair fought through a 512-team open bracket, then stunned two professional European squads in the final qualifier.",
      "A local telco has already offered to cover their Seoul bootcamp. “First we tell our moms,” Wave said after the winning round. “Then we practise.”",
    ],
  },
  {
    id: "biz",
    type: "article",
    section: "business",
    category: "business",
    source: "IOL Business",
    publishedAt: "1h",
    readLabel: "2 min read",
    likes: "3.8k",
    factChecked: true,
    imageSeed: "iolbiz",
    title: "Rand hits a two-year high as global money floods into SA tech",
    summary:
      "R16.90 to the dollar. Economists point at three things — and one of them is an app you probably use.",
    tldr: [
      "The rand touched R16.90/$, its strongest level since 2024.",
      "Foreign direct investment into SA tech doubled this quarter.",
      "Lower fuel prices should follow within weeks.",
    ],
    explain:
      "The rand getting stronger means South Africa’s money buys more. It happened because foreign investors are putting billions into South African companies, especially tech ones.",
    whyItMatters:
      "A stronger rand means cheaper petrol, cheaper imports and cheaper data — the stuff that actually hits your wallet.",
    body: [
      "The currency broke through R17 on Tuesday morning and kept going, closing at R16.90 — a level last seen two years ago.",
      "Behind the move: a doubling of foreign investment into local tech, the energy bill’s passage, and a record quarter for SA exports to the rest of the continent.",
      "Economists caution the rally could cool, but fuel price relief is already locked in for next month’s adjustment.",
    ],
  },
  {
    id: "ct",
    type: "article",
    section: "capetown",
    category: "capetown",
    source: "IOL News",
    publishedAt: "6h",
    readLabel: "2 min read",
    likes: "2.9k",
    imageSeed: "iolct",
    title: "Table Mountain cableway goes fully solar — and tickets get cheaper",
    summary:
      "The cable car now runs on sunshine, and locals with an ID pay 40% less. Here is how the new pricing works.",
    tldr: [
      "The cableway now runs on 100% solar power.",
      "SA ID holders get 40% off, all year round.",
      "Off-peak sunset tickets drop to R120.",
    ],
    explain:
      "The famous cable car up Table Mountain now gets all its electricity from solar panels. Because that is cheaper, ticket prices for South Africans are coming down a lot.",
    whyItMatters:
      "The world’s most iconic urban mountain just became cheaper for the people who live under it. That is rare, and worth copying.",
    body: [
      "A solar farm on the lower station’s roof and slopes now covers the cableway’s full draw, with battery storage for cloudy days and evening descents.",
      "Management passed the savings on: South African ID holders pay 40% less from Friday, and off-peak sunset returns drop to R120.",
      "“Locals should not need a special occasion to go up their own mountain,” the operations chief said. Bookings for the weekend sold out in four hours.",
    ],
  },
  {
    id: "snkr",
    type: "article",
    section: "lifestyle",
    category: "sneakers",
    source: "IOL Lifestyle",
    publishedAt: "4h",
    readLabel: "1 min read",
    likes: "7.6k",
    imageSeed: "iolsnkr",
    title: "Bathu’s Joburg-skyline drop sold out in 11 minutes",
    summary:
      "The mesh pioneers put Ponte and the Hillbrow Tower on a midsole. Resale prices tripled before lunch.",
    tldr: [
      "Bathu’s “Skyline” colourway sold out in 11 minutes.",
      "The design features Ponte Tower and the Joburg skyline.",
      "A restock is confirmed for month-end.",
    ],
    explain:
      "Bathu is a South African sneaker brand. Their newest shoe, decorated with the Johannesburg skyline, sold out almost instantly — faster than any local release before it.",
    whyItMatters:
      "A township-born brand outselling global giants at home rewrites who gets to define SA streetwear.",
    body: [
      "The drop went live at 09:00. By 09:11 all eight thousand pairs were gone, crashing the site twice along the way.",
      "Designed with a Soweto art collective, the shoe stitches the city’s skyline across the midsole, with a reflective Hillbrow Tower on the heel.",
      "Founder Theo Baloyi confirmed a month-end restock — and a Cape Town skyline edition “sooner than people think”.",
    ],
  },
  {
    id: "bball",
    type: "article",
    section: "sport",
    category: "basketball",
    source: "IOL Sport",
    publishedAt: "8h",
    readLabel: "2 min read",
    likes: "3.1k",
    imageSeed: "iolbball",
    title: "Cape Town Tigers stun the champs in their BAL opener",
    summary:
      "Down 18 at half-time, the Tigers roared back to beat defending champions Petro de Luanda at a sold-out GrandWest.",
    tldr: [
      "Tigers beat defending BAL champions Petro de Luanda 89–86.",
      "They trailed by 18 points at half-time.",
      "Rookie guard Sive Mbolekwa scored 31.",
    ],
    explain:
      "Cape Town’s pro basketball team beat the best team in Africa after being far behind at half-time. A 19-year-old from Khayelitsha was the star of the game.",
    whyItMatters:
      "Basketball is quietly becoming SA’s fastest-growing school sport. Nights like this are why.",
    body: [
      "GrandWest was a wall of noise as the Tigers erased an 18-point deficit in a single quarter, feeding off a crowd that refused to sit down.",
      "Nineteen-year-old Sive Mbolekwa, playing his first professional season, hit five threes in the fourth — including the dagger with 12 seconds left.",
      "“They told us to respect the champions,” coach Rasheed Hazzard smiled. “We did. Then we beat them.”",
    ],
  },
  {
    id: "health",
    type: "article",
    section: "health",
    category: "health",
    source: "IOL News",
    publishedAt: "9h",
    readLabel: "2 min read",
    likes: "5.5k",
    factChecked: true,
    imageSeed: "iolhealth",
    title: "A free mental-health app just launched for every SA student",
    summary:
      "Unlimited chat counselling, 24/7, in your language — paid for by a coalition of universities and medical schemes.",
    tldr: [
      "Free counselling app for all registered SA students.",
      "24/7 chat with registered counsellors, in 11 languages.",
      "No medical aid or airtime required.",
    ],
    explain:
      "Every student in the country can now talk to a real counsellor through an app, any time, for free. Universities and health companies are covering the cost together.",
    whyItMatters:
      "Campus counselling waiting lists run six weeks or more. For a student in crisis, tonight matters more than next month.",
    body: [
      "The service, called Khusela, connects students to registered counsellors within minutes, by text or voice note, at any hour.",
      "It is funded jointly by 19 universities and three medical schemes, and works on zero-rated data — no airtime needed.",
      "In its pilot at two campuses, average wait time for a first conversation fell from 41 days to 8 minutes.",
    ],
  },
  {
    id: "cars",
    type: "video",
    section: "cars",
    category: "cars",
    source: "IOL Motoring",
    publishedAt: "7h",
    readLabel: "0:58 watch",
    likes: "6.2k",
    duration: "0:58",
    imageSeed: "iolcars",
    videoUrl: `${V}/VolkswagenGTIReview.mp4`,
    caption: "Instant torque, zero fuel stops — our first drive of the eBakkie.",
    title: "We drove SA’s first electric bakkie — it might change everything",
    summary:
      "Built in Rosslyn, 480km of range, and it can power your house through load shedding. Our first drive.",
    tldr: [
      "The eBakkie is built in Rosslyn, Pretoria — 480km range.",
      "It can back-feed a house for up to three days.",
      "Pricing starts at R589 900, undercutting imported EVs.",
    ],
    explain:
      "A South African factory is building an electric bakkie — a pickup truck that runs on batteries instead of petrol. It can even be used as a giant battery to power your home.",
    whyItMatters:
      "A locally built EV protects 30 000 auto jobs as the world stops buying petrol cars — and your next bakkie might charge off your roof.",
    body: [
      "It pulls away in total silence, then shoves you into the seat — 540Nm from a standstill will do that. On our 400km test loop we arrived with 80km to spare.",
      "The party trick is vehicle-to-home: plug the bakkie into a compatible inverter and it will run a household’s essentials for up to three days.",
      "Production starts in January with 60% local content, rising to 80% by 2028. The waiting list opened this morning.",
    ],
  },
];

export const ARTICLES: Article[] = SEEDS.map((s) => ({
  ...s,
  comments: seedComments(s.id),
}));

export const ARTICLE_MAP: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.id, a])
);

export function getArticle(id: string | null | undefined): Article | undefined {
  return id ? ARTICLE_MAP[id] : undefined;
}

/**
 * "Keep scrolling" picks: same desk first, then anything else, so the rail
 * is never short even for a one-off story.
 */
export function relatedArticles(article: Article, limit = 4): Article[] {
  const pool = ARTICLES.filter((a) => a.id !== article.id);
  const sameDesk = (a: Article) =>
    a.section === article.section || a.category === article.category;
  return [...pool.filter(sameDesk), ...pool.filter((a) => !sameDesk(a))].slice(
    0,
    limit
  );
}
