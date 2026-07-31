# IOL Wire

**News that moves.** A TikTok-style, mobile-first news experience for 18–24 year olds, built on IOL journalism. Swipe through full-screen story cards, watch video reports, build playlists, and get an AI Daily Brief tuned to your interests.

> All articles are fictional placeholder copy written for this prototype — not real reporting.

## Run it

```powershell
npm install
npm run dev        # http://localhost:3010
npm run build      # production build
```

Open it in a mobile viewport (375×812) or install it as a PWA for the full experience.

## The experience

1. **Splash** — OLED-black launch screen; the IOL WIRE logo fades in, you swipe up, and the logo docks into the top bar (Dynamic Island-style).
2. **Onboarding** — Google / Apple / email sign-in, forgot-password, guest mode; then colourful interest pills that shape your feed.
3. **For You feed** — full-screen cards, gesture-driven:
   - **Swipe up** → next story
   - **Swipe down** → save to a playlist (creates one if none exist)
   - **Swipe left** → like (heart burst)
   - **Swipe right** → share (native sheet, in-app fallback)
   - **Tap** → open the article / enlarge the video
   - **Long-press** → article: context menu (Read Later, Follow topic, Not interested, Comments, Bookmark, Report); video: enlarged preview
   - Every gesture also has a button on the right-hand rail (accessibility).
4. **Article reader** — hero image, byline, body, plus AI features: **TL;DR**, **Listen** (text-to-speech), **Explain It**, **Why this matters**, fact-check badges, story timelines, offline download, related-stories carousel, comments.
5. **Video player** — fullscreen with scrubber, play/pause, mute, captions, "Read full story".
6. **Explore** — search, suggestion chips, category filters, breaking banner, ranked trending rail, masonry grid.
7. **Genre drawer** — top-left button slides in 15+ genres; picking one refilters the feed instantly.
8. **Profile** — stats + streak, achievements engine (12 unlockables), Liked / Playlists / Read Later / History / Downloads, and the **AI Daily Brief** (5 stories from your interests, listenable).
9. **Settings** — OLED dark / light theme, 7 accent colours that re-tint the whole app live, language cycle, notifications, data saver, autoplay, captions, video quality, text size (S–XL), reduced motion, manage account (sign out, delete data).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Zustand (persisted) · Lucide icons · Poppins · PWA manifest.

## Architecture

```
src/
  app/            layout (Poppins, PWA, theming), single-route app shell
  components/
    brand/        vector IOL WIRE logo
    onboarding/   splash, login, interest selection
    feed/         card stack, gesture engine, story card
    reader/       article reader (AI features), video overlay
    explore/      search + masonry discovery
    profile/      profile, library pages, achievements, daily brief, settings
    navigation/   bottom tabs, top bar, genre drawer
    sheets/       glass bottom sheets (context, playlist, share, comments)
    shared/       toast, offline banner
  data/           articles, categories, achievements (dummy content)
  lib/            zustand stores (settings, content, ui), share, utils
  types/          shared TypeScript types
```

The app is a client-side shell on one Next.js route so tab switches and overlays never remount the feed — that's what makes it feel native. All interaction state (likes, playlists, history, achievements, settings) persists to `localStorage` via Zustand.

### Design notes

- **Liquid glass** buttons/sheets: `backdrop-filter` + translucent borders (`.glass`, `.glass-strong` in `globals.css`).
- **Live theming**: the accent colour and text scale are CSS variables set by the theme provider; changing them re-skins every component instantly.
- **Resilience shim** in `layout.tsx` keeps animation frames flowing when the tab is hidden or aggressively throttled.
