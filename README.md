# Independent Media Design Hub

The central command centre for designers and interns at **Independent Media**. It brings
brand guides, logo assets, colour palettes, typography guidance, campaign notes, design
rules and AI-assisted copywriting into one premium, internal web app — so the team can
produce on-brand work faster and with more confidence.

> **Built for a real workflow.** Search a brand, see what's missing, upload logo previews,
> copy colours, generate headlines, write newsletter copy, review a design idea, and save
> useful prompts — all before anything goes to a manager.

---

## ✨ Highlights

- **Premium newsroom UI** — sidebar navigation, command palette (`⌘/Ctrl + K`), dark/light
  mode, smooth micro-interactions and responsive layouts.
- **14 real brands** — Independent Media, IOL, IOL Sport, Cape Argus, Cape Times, The Star,
  Pretoria News, Daily News, The Mercury, Isolezwe, Daily Voice, Saturday Star,
  Sunday Independent and Weekend Argus, each with a structured brand profile.
- **Honest by design** — the app never invents official logos, hex codes or fonts. Anything
  unverified is clearly labelled **“Needs official confirmation”** so it can be confirmed
  before publishing.
- **AI Campaign Assistant** — a chat-style assistant that generates on-brand headlines,
  captions, CTAs and design direction using a smart local template engine (no API key
  required yet).
- **Everything saves locally** — uploads, palette edits, favourites, saved prompts and
  outputs are stored in your browser via `localStorage`. Export/import the whole dataset
  as JSON from Admin Mode.

---

## 🧱 Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com) with a shadcn/ui-style component system
- [lucide-react](https://lucide.dev) icons
- [framer-motion](https://www.framer.com/motion/) for subtle animations
- Local TypeScript data files for brand data
- Browser `localStorage` for all user edits (no backend required for v1)

---

## 🚀 Run it locally

**Prerequisites:** [Node.js](https://nodejs.org) **18.18+** (Node 20 or 22 LTS recommended)
and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# open http://localhost:3000

# Production build / start
npm run build
npm start

# Lint
npm run lint
```

> On Windows, if `node`/`npm` aren't recognised, install Node from
> [nodejs.org](https://nodejs.org) (or unzip the official Windows build and add its folder
> to your `PATH`), then re-open the terminal.

---

## 🗂️ Project structure

```
src/
├── app/                     # Routes (App Router)
│   ├── page.tsx             # Dashboard
│   ├── brands/              # Brand Library + [id] brand guide
│   ├── logo-vault/          # Logo asset management
│   ├── palettes/            # Colour Palette Manager
│   ├── assistant/           # AI Campaign Assistant
│   ├── newsletter/          # Newsletter Helper
│   ├── design-doctor/       # Design feedback tool
│   ├── campaign-builder/    # Guided campaign brief builder
│   ├── prompts/             # Prompt Library
│   ├── intern-mode/         # Beginner guide + checklist
│   ├── admin/               # Admin Mode (data management)
│   └── about/               # Settings & About
├── components/
│   ├── ui/                  # shadcn-style primitives (button, card, select…)
│   ├── shared/              # Brand cards, logo slots, colour swatches, etc.
│   ├── layout/              # Sidebar, topbar, command menu, app shell
│   └── providers/           # Theme, toast and the central Hub data store
├── data/
│   ├── brands.ts            # ← the brand dataset
│   └── prompts.ts           # prompt library seed
├── lib/
│   ├── generator.ts         # ← the AI template engine
│   ├── design-doctor.ts     # design-review rules
│   ├── nav.ts               # navigation config
│   └── hooks/               # localStorage + selection hooks
└── types/                   # shared TypeScript types
```

---

## 🖼️ How to add real logos

Two ways:

**1. In the app (quickest, per browser)**

1. Open **Logo Vault** (or a brand's guide → **Logo assets**).
2. Click **Upload** on the slot you need (Primary, Black, White, Icon, SVG, PNG).
3. Pick a file. PNG/JPG previews are auto-resized for storage; SVGs are kept as vectors.
4. Click **Approve** once it's signed off — it then counts as a “Ready for use” asset.

Uploads are saved to `localStorage` in your browser. Use **Admin → Export JSON** to share a
dataset (including uploaded previews) with a teammate.

**2. Ship official files with the app (for production)**

For permanent, shared assets, drop files in `public/logos/<brand-id>/` and reference them
in `src/data/brands.ts`. The recommended next step is to move asset storage to Supabase
Storage / Firebase Storage (see below) so the whole team shares one source of truth.

---

## 🎨 How to update brand palettes

- **In the app:** open **Colour Palettes** (or a brand guide → **Colour palette**). Click a
  swatch's **Edit** to set the name, hex, usage role and status; **Add colour** to add one;
  the trash icon to remove. Edits persist in `localStorage`.
- **In code (defaults):** edit the `palette` array for a brand in
  [`src/data/brands.ts`](src/data/brands.ts). Each swatch is:

  ```ts
  { id: "primary", name: "Primary brand colour", hex: "#C8102E",
    usage: "Masthead and key surfaces", role: "background", status: "approved" }
  ```

  Set `hex: null` and `status: "needs-confirmation"` for any value you can't yet verify —
  the UI will render the **“Needs official confirmation”** badge automatically.

> ⚠️ The app intentionally ships palettes as confirmable placeholders. Replace them with the
> **official** hex codes from each brand guide before using anything in production artwork.

---

## 🤖 How to connect a real AI API later

The assistant is intentionally swappable. All generation goes through a single function:

```ts
// src/lib/generator.ts
export function generate(options: GenerateOptions): GenerateResult { … }
```

To go live with a real model:

1. Create an API route, e.g. `src/app/api/generate/route.ts`, that calls the
   **[Claude](https://docs.anthropic.com)** or OpenAI API server-side (keep the key in
   `.env.local`, never in the client).
2. Build the prompt from the same `GenerateOptions` (brand, platform, tone, output type,
   topic) plus the brand's guide data, and ask the model to return the `GenerateResult`
   shape (headline, alternatives, caption, CTAs, design direction, etc.).
3. In the assistant/newsletter/campaign pages, replace the local `generate(...)` call with a
   `fetch("/api/generate")`. The UI doesn't need to change.

The local template engine stays as a free, offline fallback.

### Connecting Supabase / Firebase

The central store lives in
[`src/components/providers/hub-provider.tsx`](src/components/providers/hub-provider.tsx) and
already exposes clean actions (`updateBrand`, `addColor`, `setLogo`, `exportData`, …). To
sync to a backend, swap the `useLocalStorage` slices for Supabase/Firebase reads + writes
inside that provider — every page consumes `useHub()`, so nothing else needs to change.

---

## 🎤 How to present this to your manager

1. **Open on the Dashboard.** It frames the tool as a command centre and shows live stats
   (brands, approved assets, palettes still needing confirmation).
2. **Search a brand** with `⌘/Ctrl + K`, open its **Brand Guide**, and walk through tone,
   design direction, do's & don'ts and the approval checklist.
3. **Show the “Needs official confirmation” discipline.** Emphasise that the tool never
   guesses official colours, fonts or logos — it flags them for sign-off. This is the
   professional, brand-safe choice.
4. **Generate something live.** In the **AI Assistant** or **Campaign Builder**, pick a
   brand + platform + tone and generate a polished, on-brand draft in seconds.
5. **Show the Newsletter Helper preview** — a real, branded email mock built from the copy.
6. **Close with the roadmap** (Settings & About): connect a real AI API, sync data to
   Supabase/Firebase, and load official brand guides to replace every placeholder.

---

## 🔒 Data & privacy

All edits, uploads, favourites, saved prompts and outputs are stored **locally in your
browser**. Nothing is sent to a server in v1. Export everything to JSON or reset to the demo
data anytime from **Admin Mode**.

---

## 📄 Notes on brand content

Brand descriptions use safe, general, publicly-known framing and are written for internal
design guidance. They are **starting points**, not official brand-guide reproductions.
Always confirm specifics — colours, fonts, logo files and final wording — against each
title's official brand guide before publishing.
