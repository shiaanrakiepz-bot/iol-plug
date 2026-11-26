import type { WrappedWeek } from "./wrapped";
import { weekLabel, weekRange } from "./wrapped";

/**
 * Renders the week as a 1080×1920 image.
 *
 * This is the part of Wrapped that actually does the work. A recap you can
 * only look at inside the app is a nice screen; a recap that leaves as a file
 * is a growth loop, and the story-sized canvas is what makes it paste cleanly
 * into the places this audience actually shares things.
 *
 * Drawn on a canvas rather than screenshotted from the DOM so the output is
 * identical on every device and does not depend on the viewport.
 */

const W = 1080;
const H = 1920;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Wraps text to a width and returns the y the caller should continue from. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineHeight: number,
  maxLines = 3
): number {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      lines++;
      line = word;
      if (lines >= maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line) {
    let out = line;
    while (ctx.measureText(`${out}…`).width > maxW && out.length > 4) {
      out = out.slice(0, -1);
    }
    ctx.fillText(out === line ? out : `${out}…`, x, y);
    y += lineHeight;
  }
  return y;
}

export async function renderWrappedCard(
  w: WrappedWeek,
  accent: string
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  // Canvas falls back to a system face if Poppins has not finished loading,
  // which quietly changes the whole card's character.
  try {
    await document.fonts?.ready;
  } catch {
    /* older browsers: draw with whatever is resolved */
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const P = "Poppins, system-ui, sans-serif";
  const topic = w.topTopic;
  const tint = topic?.color ?? accent;

  /* ---- background: deep base with the week's colour bleeding in ---- */
  ctx.fillStyle = "#0d0b10";
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.5, H * 0.26, 40, W * 0.5, H * 0.26, W * 1.05);
  glow.addColorStop(0, `${tint}55`);
  glow.addColorStop(0.55, `${tint}14`);
  glow.addColorStop(1, "#0d0b1000");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  /* ---- masthead ---- */
  ctx.fillStyle = accent;
  roundRect(ctx, 88, 120, 104, 104, 28);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 40px ${P}`;
  ctx.textAlign = "center";
  ctx.fillText("IOL", 140, 186);

  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 44px ${P}`;
  ctx.fillText("IOL Plug", 216, 166);
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.font = `500 30px ${P}`;
  ctx.fillText(weekRange(w), 216, 210);

  /* ---- headline statement ---- */
  ctx.fillStyle = "rgba(255,255,255,.6)";
  ctx.font = `700 30px ${P}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("MY WEEK ON THE PLUG", 88, 360);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "#ffffff";
  ctx.font = `900 150px ${P}`;
  ctx.fillText(String(w.storiesRead), 88, 510);

  const numW = ctx.measureText(String(w.storiesRead)).width;
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.font = `600 44px ${P}`;
  ctx.fillText(w.storiesRead === 1 ? "story" : "stories", 88 + numW + 24, 510);

  ctx.fillStyle = tint;
  ctx.font = `800 54px ${P}`;
  wrap(ctx, weekLabel(w), 88, 600, W - 176, 64, 2);

  /* ---- top topic block ---- */
  if (topic) {
    roundRect(ctx, 88, 680, W - 176, 220, 44);
    ctx.fillStyle = "rgba(255,255,255,.06)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.1)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.5)";
    ctx.font = `700 26px ${P}`;
    ctx.letterSpacing = "4px";
    ctx.fillText("MOST READ", 136, 752);
    ctx.letterSpacing = "0px";

    ctx.fillStyle = topic.color;
    ctx.font = `800 68px ${P}`;
    ctx.fillText(topic.label, 136, 836);

    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.font = `600 32px ${P}`;
    const lw = ctx.measureText(topic.label).width;
    ctx.font = `800 68px ${P}`;
    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.font = `600 32px ${P}`;
    ctx.fillText(`${topic.count}×`, 136 + lw + 22, 836);
  }

  /* ---- three stats ---- */
  const stats: [string, string][] = [
    [`${w.daysCompleted}/7`, "days finished"],
    [`${w.outsidePct}%`, "outside my topics"],
    [w.accuracyPct === null ? "—" : `${w.accuracyPct}%`, "checks correct"],
  ];

  const boxW = (W - 176 - 48) / 3;
  stats.forEach(([value, label], i) => {
    const x = 88 + i * (boxW + 24);
    roundRect(ctx, x, 950, boxW, 210, 40);
    ctx.fillStyle = "rgba(255,255,255,.06)";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 58px ${P}`;
    ctx.fillText(value, x + boxW / 2, 1050);

    ctx.fillStyle = "rgba(255,255,255,.5)";
    ctx.font = `500 24px ${P}`;
    wrap(ctx, label, x + boxW / 2 - boxW / 2 + 16, 1096, boxW - 32, 30, 2);
    ctx.textAlign = "left";
  });

  /* ---- the story that defined the week ---- */
  if (w.headline) {
    ctx.fillStyle = "rgba(255,255,255,.5)";
    ctx.font = `700 26px ${P}`;
    ctx.letterSpacing = "4px";
    ctx.fillText("THE ONE I KEEP THINKING ABOUT", 88, 1280);
    ctx.letterSpacing = "0px";

    ctx.fillStyle = "#ffffff";
    ctx.font = `700 48px ${P}`;
    wrap(ctx, w.headline.title, 88, 1352, W - 176, 62, 3);
  }

  /* ---- streak + xp strip ---- */
  roundRect(ctx, 88, 1560, W - 176, 150, 40);
  ctx.fillStyle = `${tint}1f`;
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 46px ${P}`;
  ctx.fillText(`${w.bestStreak} day streak`, 136, 1630);
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.font = `600 32px ${P}`;
  ctx.fillText(`${w.xpEarned} XP this week`, 136, 1678);

  /* ---- footer ---- */
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,.4)";
  ctx.font = `600 30px ${P}`;
  ctx.fillText("iol.co.za/plug", W / 2, 1810);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/**
 * Hands the card to the OS share sheet where that exists, and falls back to a
 * download. Returns how it went so the caller can say the right thing.
 */
export async function shareWrappedCard(
  blob: Blob,
  week: WrappedWeek
): Promise<"shared" | "downloaded" | "failed"> {
  const file = new File([blob], `iol-plug-week-${week.to}.png`, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
  };

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({
        files: [file],
        title: "My week on IOL Plug",
        text: `${week.storiesRead} stories, ${week.bestStreak}-day streak.`,
      });
      return "shared";
    } catch (err) {
      // Dismissing the sheet is a choice, not a failure worth reporting.
      if (err instanceof Error && err.name === "AbortError") return "shared";
    }
  }

  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return "downloaded";
  } catch {
    return "failed";
  }
}
