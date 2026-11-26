import path from "node:path";
import { fileURLToPath } from "node:url";

// Point Tailwind at this project's config by absolute path. Tailwind's PostCSS
// plugin otherwise looks it up from the process CWD, and this app is often
// launched from the parent folder — which has its own tailwind.config.ts for a
// different app, and would silently compile that app's classes instead.
const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: { config: path.join(here, "tailwind.config.ts") },
    autoprefixer: {},
  },
};

export default config;
