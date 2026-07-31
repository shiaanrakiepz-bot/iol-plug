// ---------------------------------------------------------------------------
// Status primitives
// ---------------------------------------------------------------------------
export type AssetStatus = "approved" | "needs-review" | "needs-confirmation" | "missing";
export type ApprovalStatus = "approved" | "in-review" | "needs-confirmation";
export type ColorStatus = "approved" | "needs-confirmation" | "needs-review";
export type TypographyStatus = "confirmed" | "needs-confirmation";

export const NEEDS_CONFIRMATION = "Needs official confirmation";

// ---------------------------------------------------------------------------
// Brand asset model
// ---------------------------------------------------------------------------
export type LogoType = "primary" | "black" | "white" | "icon" | "svg" | "png";

export interface LogoAsset {
  type: LogoType;
  label: string;
  description: string;
  status: AssetStatus;
}

export type ColorRole =
  | "background"
  | "accent"
  | "text"
  | "cta"
  | "newsletter-header"
  | "support";

export interface ColorSwatch {
  id: string;
  name: string;
  /** A null hex means the official value is unknown and must be confirmed. */
  hex: string | null;
  usage: string;
  role: ColorRole;
  status: ColorStatus;
}

export interface Typography {
  heading: string;
  body: string;
  digital: string;
  notes: string;
  status: TypographyStatus;
}

export interface CopyExample {
  label: string;
  text: string;
}

export interface Brand {
  id: string;
  name: string;
  shortName: string;
  category: string;
  region: string;
  audience: string;
  description: string;
  tone: string;
  designPersonality: string;
  designDirection: string;
  bestUseCases: string[];
  newsletterUses: string[];
  socialUses: string[];
  logoAssets: LogoAsset[];
  palette: ColorSwatch[];
  typography: Typography;
  dos: string[];
  donts: string[];
  copyExamples: CopyExample[];
  campaignExamples: string[];
  approvalStatus: ApprovalStatus;
  notes: string;
  /** Filter facets: Digital, Newspaper, Sport, Cape Town, Johannesburg, etc. */
  tags: string[];
  established?: string;
  /**
   * Internal Hub UI accent hue (0-360). Used ONLY for the Design Hub's own
   * interface theming (card accents, avatars). This is NOT an official brand
   * colour — official palettes live in `palette` and are marked for
   * confirmation where unknown.
   */
  uiHue: number;
}

// ---------------------------------------------------------------------------
// AI / generator model
// ---------------------------------------------------------------------------
export type Platform =
  | "Poster"
  | "Newsletter"
  | "Social media"
  | "Web banner"
  | "Video teaser"
  | "Email campaign"
  | "Internal presentation";

export type Tone =
  | "Bold"
  | "Professional"
  | "Urgent"
  | "Youthful"
  | "Emotional"
  | "Sporty"
  | "Premium"
  | "Serious"
  | "Editorial";

export type OutputType =
  | "Headline"
  | "Caption"
  | "CTA"
  | "Subject line"
  | "Intro paragraph"
  | "Campaign slogan"
  | "Design concept"
  | "Full campaign copy";

export interface GenerateOptions {
  brand: Brand;
  platform: Platform;
  tone: Tone;
  outputType: OutputType;
  topic: string;
  seed?: number;
}

export interface GenerateResult {
  campaignName: string;
  headline: string;
  supportingHeadline: string;
  alternativeHeadlines: string[];
  caption: string;
  ctas: string[];
  subjectLines: string[];
  intro: string;
  sectionHeadings: string[];
  slogan: string;
  designDirection: string[];
  colourUsage: string;
  layoutSuggestion: string;
  toneNote: string;
  internTip: string;
  meta: {
    brand: string;
    platform: Platform;
    tone: Tone;
    outputType: OutputType;
  };
}

// ---------------------------------------------------------------------------
// Prompt library
// ---------------------------------------------------------------------------
export type PromptCategory =
  | "Headlines"
  | "Social media captions"
  | "Newsletters"
  | "Campaign concepts"
  | "Design feedback"
  | "Tone adjustment"
  | "Brand guidance"
  | "Image generation prompts"
  | "Figma layout prompts";

export interface PromptTemplate {
  id: string;
  title: string;
  category: PromptCategory;
  text: string;
  builtIn?: boolean;
}

// ---------------------------------------------------------------------------
// Saved user artefacts (localStorage)
// ---------------------------------------------------------------------------
export interface SavedOutput {
  id: string;
  title: string;
  body: string;
  brandId?: string;
  meta?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: GenerateResult;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Design Doctor
// ---------------------------------------------------------------------------
export type Confidence =
  | "I just started"
  | "I have a rough layout"
  | "Almost finished"
  | "Ready for review";

export interface DesignReview {
  score: number;
  brandFit: string;
  colourUsage: string;
  typography: string;
  layout: string;
  hierarchy: string;
  copyStrength: string;
  working: string[];
  improve: string[];
  nextSteps: string[];
  managerNote: string;
}
