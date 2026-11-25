import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "IOL Plug",
    short_name: "IOL Plug",
    description:
      "The future of news. Swipe through stories that matter, built on trusted IOL journalism.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#121016",
    orientation: "portrait",
    lang: "en-ZA",
    categories: ["news", "magazines"],
    icons: [
      { src: "/plug-icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/plug-icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops to a circle; this one keeps the lockup inside that zone.
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
