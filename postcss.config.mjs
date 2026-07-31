import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// This folder is the launch root for two separate apps: the design hub (its
// own src/) and iol-wire/. Tailwind's PostCSS plugin resolves its config from
// the process CWD, which is this folder either way — so without the check
// below, iol-wire's stylesheet gets compiled against the design hub's theme
// and content globs, and every iol-wire-specific class silently goes missing.
// Pick the config that owns the file being processed; fall back to this one.
const tailwindConfigFor = (file) =>
  String(file ?? "").replace(/\\/g, "/").includes("/iol-wire/")
    ? path.join(here, "iol-wire", "tailwind.config.ts")
    : path.join(here, "tailwind.config.ts");

/** @type {import('postcss-load-config').ConfigFn} */
export default (ctx) => ({
  plugins: {
    tailwindcss: { config: tailwindConfigFor(ctx?.file ?? ctx?.from) },
    autoprefixer: {},
  },
});
