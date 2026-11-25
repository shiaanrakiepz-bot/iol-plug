/**
 * A short particle burst for the moments that have actually been earned.
 *
 * Hand-rolled rather than pulled from a package for three reasons: it is about
 * sixty lines, it adds nothing to the bundle, and — the real one — it has to
 * be refusable. Celebration in a news app is a judgement call, so the thing
 * that fires it needs a gate that a general-purpose confetti library has no
 * concept of. See `canCelebrate` in lib/progress.
 *
 * Honours `prefers-reduced-motion` and the in-app reduce-motion setting by
 * doing nothing at all.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  life: number;
}

const PALETTE = ["#E8192C", "#FFD166", "#6EE087", "#6FBFFF", "#D9A0FF", "#FFFFFF"];

export function celebrate(opts: { x?: number; y?: number; count?: number } = {}): void {
  if (typeof window === "undefined") return;

  const reduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("reduce-motion");
  if (reduced) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "200",
  });
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const originX = opts.x ?? w / 2;
  const originY = opts.y ?? h * 0.42;
  const count = opts.count ?? 70;

  const parts: Particle[] = Array.from({ length: count }, () => {
    // Biased upward: particles that only fall look like a dropped tray.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 4 + Math.random() * 7;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: 5 + Math.random() * 5,
      color: PALETTE[(Math.random() * PALETTE.length) | 0],
      life: 1,
    };
  });

  let raf = 0;
  const start = performance.now();

  const frame = (now: number) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, w, h);

    let alive = false;
    for (const p of parts) {
      p.vy += 0.22; // gravity
      p.vx *= 0.99; // drag
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - elapsed / 1600);
      if (p.life > 0 && p.y < h + 40) alive = true;

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    if (alive) raf = requestAnimationFrame(frame);
    else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };

  raf = requestAnimationFrame(frame);
}
