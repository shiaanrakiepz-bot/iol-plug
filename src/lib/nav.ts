import {
  LayoutDashboard,
  Library,
  Images,
  Palette,
  Sparkles,
  Mails,
  Stethoscope,
  Megaphone,
  MessageSquareText,
  GraduationCap,
  ShieldCheck,
  Info,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        description: "Your design command centre",
      },
    ],
  },
  {
    label: "Brand system",
    items: [
      {
        title: "Brand Library",
        href: "/brands",
        icon: Library,
        description: "Every title, searchable and filterable",
      },
      {
        title: "Logo Vault",
        href: "/logo-vault",
        icon: Images,
        description: "Upload and track logo assets",
      },
      {
        title: "Colour Palettes",
        href: "/palettes",
        icon: Palette,
        description: "Manage swatches across brands",
      },
    ],
  },
  {
    label: "Create",
    items: [
      {
        title: "AI Assistant",
        href: "/assistant",
        icon: Sparkles,
        description: "Generate on-brand campaign copy",
      },
      {
        title: "Newsletter Helper",
        href: "/newsletter",
        icon: Mails,
        description: "Build newsletter copy fast",
      },
      {
        title: "Campaign Builder",
        href: "/campaign-builder",
        icon: Megaphone,
        description: "Guided end-to-end campaign brief",
      },
      {
        title: "Design Doctor",
        href: "/design-doctor",
        icon: Stethoscope,
        description: "Get feedback on a design idea",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "Prompt Library",
        href: "/prompts",
        icon: MessageSquareText,
        description: "Reusable, copy-ready prompts",
      },
      {
        title: "Intern Mode",
        href: "/intern-mode",
        icon: GraduationCap,
        description: "Start here if you're new",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Admin Mode",
        href: "/admin",
        icon: ShieldCheck,
        description: "Manage data and assets",
      },
      {
        title: "Settings & About",
        href: "/about",
        icon: Info,
        description: "Preferences and product info",
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
