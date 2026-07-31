import type { PromptTemplate } from "@/types";

export const PROMPT_LIBRARY: PromptTemplate[] = [
  // Headlines
  {
    id: "p-headline-10",
    title: "10 headline options",
    category: "Headlines",
    text: "Generate 10 headline options for this campaign. Keep them punchy, on-brand and under 9 words each.",
    builtIn: true,
  },
  {
    id: "p-headline-shorter",
    title: "Make it shorter & punchier",
    category: "Headlines",
    text: "Make this headline shorter and punchier without losing the core message. Give me 3 versions.",
    builtIn: true,
  },
  {
    id: "p-headline-cta",
    title: "Poster copy with a strong CTA",
    category: "Headlines",
    text: "Give me poster copy with a strong call-to-action. Include a main headline, a one-line support, and a CTA.",
    builtIn: true,
  },
  // Social
  {
    id: "p-social-captions",
    title: "Social captions for a campaign",
    category: "Social media captions",
    text: "Create social media captions for this campaign. Give me 3 options with suggested hashtags and an emoji-light tone.",
    builtIn: true,
  },
  {
    id: "p-social-thread",
    title: "Carousel / thread outline",
    category: "Social media captions",
    text: "Outline a 5-slide social carousel for this story, with a hook slide, three points and a CTA slide.",
    builtIn: true,
  },
  // Newsletters
  {
    id: "p-news-subjects",
    title: "5 newsletter subject lines",
    category: "Newsletters",
    text: "Give me 5 newsletter subject lines for this story. Mix curiosity, clarity and urgency, and keep them under 55 characters.",
    builtIn: true,
  },
  {
    id: "p-news-intro",
    title: "Newsletter intro paragraph",
    category: "Newsletters",
    text: "Write a warm, on-brand newsletter intro paragraph (2-3 sentences) that sets up today's lead story.",
    builtIn: true,
  },
  // Campaign concepts
  {
    id: "p-concept-polish",
    title: "Polish a rough concept",
    category: "Campaign concepts",
    text: "Turn this rough concept into a polished campaign idea with a name, a big idea, and how it plays out across poster, social and newsletter.",
    builtIn: true,
  },
  {
    id: "p-concept-layout",
    title: "Suggest a layout direction",
    category: "Campaign concepts",
    text: "Suggest a layout direction for this campaign, including hierarchy, grid, imagery style and where the CTA should sit.",
    builtIn: true,
  },
  // Design feedback
  {
    id: "p-feedback-brandfit",
    title: "Review for brand fit",
    category: "Design feedback",
    text: "Review this design idea for brand fit. Tell me what's working, what's off-brand, and the top 3 things to fix.",
    builtIn: true,
  },
  {
    id: "p-feedback-hierarchy",
    title: "Check visual hierarchy",
    category: "Design feedback",
    text: "Check the visual hierarchy of this layout. Is the eye led to the headline, then the key message, then the CTA?",
    builtIn: true,
  },
  // Tone adjustment
  {
    id: "p-tone-editorial",
    title: "Rewrite in premium editorial tone",
    category: "Tone adjustment",
    text: "Write this in a premium editorial tone — refined, confident and intelligent, without sounding stiff.",
    builtIn: true,
  },
  {
    id: "p-tone-youthful",
    title: "Make it youthful & energetic",
    category: "Tone adjustment",
    text: "Rewrite this to feel youthful, bold and energetic while staying clear and readable.",
    builtIn: true,
  },
  // Brand guidance
  {
    id: "p-brand-tone",
    title: "What tone should I use?",
    category: "Brand guidance",
    text: "Based on this brand, what tone of voice should I use for this piece, and what are 3 words to keep front of mind?",
    builtIn: true,
  },
  {
    id: "p-brand-dosdonts",
    title: "Quick do's and don'ts",
    category: "Brand guidance",
    text: "Give me a quick do's and don'ts checklist for designing in this brand's style.",
    builtIn: true,
  },
  // Image generation
  {
    id: "p-image-sport-bg",
    title: "Sports newsletter background",
    category: "Image generation prompts",
    text: "Create an image generation prompt for a sports newsletter background — dynamic, match-day energy, dark base with a single bold accent, leaving clear space for a headline. No real logos or player likenesses.",
    builtIn: true,
  },
  {
    id: "p-image-editorial",
    title: "Editorial feature hero image",
    category: "Image generation prompts",
    text: "Write an image generation prompt for a premium editorial feature hero — considered, cinematic, soft natural light, generous negative space for a serif headline.",
    builtIn: true,
  },
  // Figma layout
  {
    id: "p-figma-poster",
    title: "Figma poster layout brief",
    category: "Figma layout prompts",
    text: "Describe a Figma poster layout for this campaign: frame size, grid columns, where the masthead, headline, image and CTA sit, and spacing rules.",
    builtIn: true,
  },
  {
    id: "p-figma-newsletter",
    title: "Figma newsletter template",
    category: "Figma layout prompts",
    text: "Outline a Figma email/newsletter template: header band, hero story block, 3 section blocks, CTA button and footer, with a 600px content width.",
    builtIn: true,
  },
];

export const PROMPT_CATEGORIES = [
  "Headlines",
  "Social media captions",
  "Newsletters",
  "Campaign concepts",
  "Design feedback",
  "Tone adjustment",
  "Brand guidance",
  "Image generation prompts",
  "Figma layout prompts",
] as const;
