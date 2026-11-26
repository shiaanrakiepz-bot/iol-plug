"use client";

/**
 * Liquid Glass refraction filters.
 *
 * Ported from Kyant's AndroidLiquidGlass (Apache-2.0), which implements the
 * effect as an AGSL shader. The shader does this:
 *
 *   1. take the signed distance to the rounded rect
 *   2. if the pixel is deeper than `refractionHeight`, sample straight through
 *   3. otherwise displace the sample along the SDF gradient — the outward
 *      normal — by `circleMap(1 - -sd/height)`, where circleMap(x)=1-√(1-x²)
 *
 * So only a band at the edge bends the backdrop, and it bends it along the
 * surface normal with a circular falloff. The centre stays optically flat,
 * which is exactly what makes real glass read as glass rather than as blur.
 *
 * The web has no backdrop shader, but `feDisplacementMap` inside
 * `backdrop-filter` does the same job: encode the normal in a map's R and G
 * channels and let the filter resample the backdrop. These maps are that
 * encoding — R carries the horizontal normal, G the vertical, mid-grey is no
 * displacement, and the band is confined to the edge by a mask. The circular
 * falloff is approximated by the gradient stops.
 *
 * Rendered once, near the root. The maps stretch to whatever they are applied
 * to, so one pill and one card cover the whole app.
 */

/** Edge-normal map. `r` is the corner radius as a percentage of the box. */
function normalMap(id: string, r: number, band: number) {
  const inner = band;
  const innerR = Math.max(0, r - band * 0.6);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' preserveAspectRatio='none'>
<defs>
<linearGradient id='h' x1='0' y1='0' x2='1' y2='0'>
<stop offset='0' stop-color='rgb(0,128,0)'/><stop offset='0.5' stop-color='rgb(128,128,0)'/><stop offset='1' stop-color='rgb(255,128,0)'/>
</linearGradient>
<linearGradient id='v' x1='0' y1='0' x2='0' y2='1'>
<stop offset='0' stop-color='rgb(0,0,0)'/><stop offset='0.5' stop-color='rgb(0,128,0)'/><stop offset='1' stop-color='rgb(0,255,0)'/>
</linearGradient>
<mask id='band'>
<rect width='200' height='200' rx='${r}' ry='${r}' fill='white'/>
<rect x='${inner}' y='${inner}' width='${200 - inner * 2}' height='${200 - inner * 2}' rx='${innerR}' ry='${innerR}' fill='black'/>
</mask>
</defs>
<rect width='200' height='200' fill='rgb(128,128,0)'/>
<g mask='url(#band)'>
<rect width='200' height='200' fill='url(#h)'/>
<rect width='200' height='200' fill='url(#v)' style='mix-blend-mode:screen'/>
</g>
</svg>`;
  return { id, href: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` };
}

const MAPS = [
  // pill-shaped chrome: the tab bar, buttons, chips
  { ...normalMap("lg-map-pill", 98, 26), filter: "lg-pill", scale: 22 },
  // cards, sheets and panels
  { ...normalMap("lg-map-card", 34, 20), filter: "lg-card", scale: 18 },
];

export function GlassFilters() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        {MAPS.map((m) => (
          <filter
            key={m.filter}
            id={m.filter}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={m.href}
              result="map"
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={m.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
