import type { Brand, Confidence, DesignReview } from "@/types";

const CONFIDENCE_BASE: Record<Confidence, number> = {
  "I just started": 52,
  "I have a rough layout": 64,
  "Almost finished": 74,
  "Ready for review": 82,
};

function has(text: string, words: string[]): boolean {
  const t = text.toLowerCase();
  return words.some((w) => t.includes(w));
}

export const PROJECT_TYPES = [
  "Poster",
  "Newsletter / email",
  "Social media post",
  "Web banner",
  "Brand campaign",
  "Internal presentation",
  "Other",
];

export const CONFIDENCE_LEVELS: Confidence[] = [
  "I just started",
  "I have a rough layout",
  "Almost finished",
  "Ready for review",
];

export function reviewDesign(
  brand: Brand,
  projectType: string,
  idea: string,
  confidence: Confidence,
): DesignReview {
  const text = idea.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const mentionsColour = has(text, ["colour", "color", "palette", "hex", "background", "accent"]);
  const mentionsType = has(text, ["font", "type", "headline", "heading", "serif", "sans", "text"]);
  const mentionsLayout = has(text, ["layout", "grid", "column", "align", "space", "margin", "top", "bottom", "left", "right", "center", "centre"]);
  const mentionsImage = has(text, ["image", "photo", "picture", "visual", "illustration", "graphic"]);
  const mentionsCTA = has(text, ["cta", "call to action", "button", "subscribe", "read more", "sign up", "link"]);
  const mentionsBrandColourRisk = has(text, ["recolour", "recolor", "stretch", "new colour", "new color", "change the logo"]);

  // Score
  let score = CONFIDENCE_BASE[confidence];
  if (wordCount > 25) score += 4;
  if (wordCount > 70) score += 3;
  if (mentionsColour) score += 2;
  if (mentionsType) score += 2;
  if (mentionsLayout) score += 2;
  if (mentionsCTA) score += 3;
  if (mentionsImage) score += 1;
  if (mentionsBrandColourRisk) score -= 6;
  if (wordCount < 8) score -= 8;
  score = Math.max(35, Math.min(96, score));

  const working: string[] = [];
  const improve: string[] = [];

  // What's working
  if (wordCount >= 8) working.push("You've described the idea clearly enough to actually review — great starting point.");
  if (mentionsCTA) working.push("You're already thinking about the call-to-action, which a lot of first drafts forget.");
  if (mentionsLayout) working.push("You're considering layout and spacing, not just content — that's a designer's instinct.");
  if (mentionsImage) working.push("Bringing imagery into the plan early will make the piece feel intentional.");
  if (mentionsType && mentionsColour) working.push("You're balancing both type and colour — that's the right level of thinking for this stage.");
  if (working.length === 0) working.push("You've taken the most important step: getting the idea out of your head and onto the page.");

  // What needs improvement
  if (!mentionsCTA) improve.push("Add a clear call-to-action — every piece should tell the reader exactly what to do next.");
  if (!mentionsLayout) improve.push("Note the layout: where the headline, image and CTA sit, and how much breathing room each gets.");
  if (!mentionsColour) improve.push(`Plan the colour usage against ${brand.name}'s palette — and remember its swatches are marked "Needs official confirmation" until verified.`);
  if (!mentionsType) improve.push("Decide your type hierarchy: one headline font, one body font, and a clear size jump between them.");
  if (mentionsBrandColourRisk) improve.push("Avoid recolouring or stretching the logo — that needs manager approval and usually breaks brand rules.");
  if (wordCount < 8) improve.push("Add a couple more sentences describing the goal, the audience and the single key message.");
  if (improve.length === 0) improve.push("Tighten the single key message — if you can say it in one sentence, the design will be stronger.");

  const brandFit = `For ${brand.name}, aim for a ${brand.tone.toLowerCase()} feel — ${brand.designPersonality.toLowerCase()} Check your idea matches that personality, and lean on the brand's suggested direction: ${brand.designDirection}`;

  const colourUsage = `Use the brand's primary colour to anchor the piece, the accent for one highlight and the CTA, and a high-contrast neutral for body text. ${
    brand.palette.some((c) => c.hex)
      ? "Confirm the exact hex values before final artwork."
      : `${brand.name}'s palette is currently "Needs official confirmation", so confirm the real values with your manager before you finalise.`
  }`;

  const typography = mentionsType
    ? "Good — keep it to one headline font and one body font, with an obvious size and weight contrast so the hierarchy reads instantly."
    : "Set a clear type hierarchy: a strong headline, a calmer subhead, and readable body. Don't mix more than two type families.";

  const layout = mentionsLayout
    ? "You're thinking about layout — now make sure there's one clear focal point and consistent spacing on a simple grid."
    : `Lead the eye in order: headline → key message → CTA. Use a simple grid and consistent margins so a ${projectType.toLowerCase()} feels intentional, not assembled.`;

  const hierarchy = `Make sure a reader's eye lands on the headline first, the supporting message second, and the CTA last. If everything shouts, nothing is heard — let one element dominate.`;

  const copyStrength = `Keep copy tight and on-brand: ${brand.tone.toLowerCase()}. Read it aloud — if it's a mouthful, cut words until it isn't. Match the brand's voice, not a generic one.`;

  const nextSteps: string[] = [];
  if (confidence === "I just started") {
    nextSteps.push("Sketch 2-3 rough layout options before committing to one.");
    nextSteps.push("Confirm the brand, tone and key message on the Brand Guide page.");
    nextSteps.push("Use the AI Assistant to generate a few headline directions to react to.");
  } else if (confidence === "I have a rough layout") {
    nextSteps.push("Lock your type hierarchy and check spacing on a consistent grid.");
    nextSteps.push("Pressure-test colour and contrast for readability.");
    nextSteps.push("Get a quick second opinion before you polish.");
  } else if (confidence === "Almost finished") {
    nextSteps.push("Proof every word and check the CTA is unmissable.");
    nextSteps.push("Preview at real size (and on mobile if it's digital).");
    nextSteps.push("Verify any 'Needs official confirmation' colours/fonts are confirmed.");
  } else {
    nextSteps.push("Do a final brand-fit pass against the do's and don'ts.");
    nextSteps.push("Export at the correct size and format for the platform.");
    nextSteps.push("Write a one-line rationale to present alongside the work.");
  }

  const managerNote = `When you present this to your manager, open with the goal and audience, show how it fits ${brand.name}'s ${brand.tone.toLowerCase()} brand, and flag anything still marked "Needs official confirmation". Confidence level: ${confidence.toLowerCase()} — current readiness around ${score}%.`;

  return {
    score,
    brandFit,
    colourUsage,
    typography,
    layout,
    hierarchy,
    copyStrength,
    working,
    improve,
    nextSteps,
    managerNote,
  };
}
