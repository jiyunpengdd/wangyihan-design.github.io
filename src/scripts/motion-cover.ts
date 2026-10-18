/**
 * The code-drawn cover for the interaction-motion article.
 *
 * One deterministic 10s timeline, no randomness: a cursor walks through a
 * wireframe UI and triggers hover, press, toggle, drag and stagger states.
 * Because every frame is a pure function of `t`, a static frame looks the
 * same as the animation would, which keeps screenshots and reduced-motion
 * users on the same image.
 */

const LOOP = 10000;
const DW = 1600;
const DH = 1000;

type Pt = { x: number; y: number };
type Ctx = CanvasRenderingContext2D;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Damped spring normalised to 0→1, overshoots once. */
const spring = (t: number, damping = 6.4, freq = 12) => 1 - Math.exp(-damping * t) * Math.cos(freq * t);

const CARD = { x: 250, y: 165, w: 1100, h: 670, r: 36 };
const PAD = 64;
const BTN = { x: CARD.x + CARD.w - PAD - 220, y: CARD.y + CARD.h - PAD - 68, w: 220, h: 68, r: 34 };
const TRACK = { x: CARD.x + CARD.w - PAD - 76, y: CARD.y + 58, w: 76, h: 40, r: 20 };
const ROW_TOP = CARD.y + 190;
const ROW_H = 100;
const ROW_GAP = 18;
const rowY = (i: number) => ROW_TOP + i * (ROW_H + ROW_GAP);

const BTN_PT: Pt = { x: BTN.x + BTN.w * 0.54, y: BTN.y + BTN.h * 0.58 };
const TRACK_PT: Pt = { x: TRACK.x + TRACK.w / 2, y: TRACK.y + TRACK.h / 2 };
const ROW_PT: Pt = { x: CARD.x + 300, y: rowY(1) + ROW_H / 2 };
const DRAG_DX = 132;

const PATH: { t: number; p: Pt }[] = [
  { t: 500, p: { x: 1490, y: 950 } },
  { t: 1500, p: BTN_PT },
  { t: 2600, p: BTN_PT },
  { t: 3450, p: TRACK_PT },
  { t: 4050, p: TRACK_PT },
  { t: 4950, p: ROW_PT },
  { t: 5500, p: { x: ROW_PT.x + DRAG_DX, y: ROW_PT.y } },
  { t: 6300, p: { x: ROW_PT.x + DRAG_DX, y: ROW_PT.y } },
  { t: 7200, p: { x: 1560, y: 1010 } },
];

function pointerAt(t: number): Pt {
  for (let i = 0; i < PATH.length - 1; i++) {
    const a = PATH[i];
    const b = PATH[i + 1];
    if (t <= b.t) {
      const u = easeInOutCubic(seg(t, a.t, b.t));
      return { x: lerp(a.p.x, b.p.x, u), y: lerp(a.p.y, b.p.y, u) };
    }
  }
  return PATH[PATH.length - 1].p;
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function fillBar(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawPointer(ctx: Ctx, p: Pt, ink: string, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 26);
  ctx.lineTo(7, 20);
  ctx.lineTo(11.5, 30);
  ctx.lineTo(16.5, 27.6);
  ctx.lineTo(12, 18);
  ctx.lineTo(21, 17);
  ctx.closePath();
  ctx.fillStyle = ink;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.stroke();
  ctx.restore();
}

const GESTURES: { from: number; to: number; label: string }[] = [
  { from: 1520, to: 1770, label: 'hover' },
  { from: 1800, to: 2200, label: 'press' },
  { from: 3420, to: 3820, label: 'tap' },
  { from: 4970, to: 6150, label: 'drag' },
];

function drawGestureLabel(ctx: Ctx, p: Pt, label: string, ink: string, surface: string) {
  ctx.save();
  ctx.font = '600 21px ui-monospace, SFMono-Regular, Menlo, monospace';
  const textWidth = ctx.measureText(label).width;
  const padX = 14;
  const height = 37;
  const x = p.x + 22;
  const y = p.y + 18;

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = ink;
  roundRect(ctx, x, y, textWidth + padX * 2, height, 10);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = surface;
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + padX, y + height / 2 + 1);
  ctx.restore();
}

interface Colors {
  ink: string;
  line: string;
  surface: string;
  accent: string;
  body: string;
  muted: string;
}

function drawFrame(ctx: Ctx, t: number, c: Colors, dark: boolean, showLabel: boolean) {
  ctx.clearRect(-400, -400, DW + 800, DH + 800);

  // Dot grid, the "canvas" the UI sits on.
  ctx.globalAlpha = dark ? 0.5 : 0.75;
  ctx.fillStyle = c.line;
  for (let x = 24; x < DW; x += 56) {
    for (let y = 24; y < DH; y += 56) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Card entrance.
  const enter = easeOutCubic(seg(t, 0, 520));
  ctx.save();
  ctx.globalAlpha = enter;
  ctx.translate(0, 26 * (1 - enter));
  const cs = 0.97 + 0.03 * enter;
  ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2);
  ctx.scale(cs, cs);
  ctx.translate(-(CARD.x + CARD.w / 2), -(CARD.y + CARD.h / 2));

  // Panel.
  ctx.shadowColor = dark ? 'rgba(0,0,0,0.6)' : 'rgba(18,18,17,0.16)';
  ctx.shadowBlur = 70;
  ctx.shadowOffsetY = 28;
  ctx.fillStyle = c.surface;
  roundRect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = c.line;
  ctx.stroke();

  // Header.
  fillBar(ctx, CARD.x + PAD, CARD.y + 58, 240, 20, c.ink, 0.82);
  fillBar(ctx, CARD.x + PAD, CARD.y + 96, 152, 14, c.muted, 0.55);

  // Toggle.
  const tap = spring(seg(t, 3450, 3900));
  const untap = spring(seg(t, 7300, 7700));
  const on = clamp01(tap - untap);
  ctx.globalAlpha = 1;
  ctx.fillStyle = c.line;
  roundRect(ctx, TRACK.x, TRACK.y, TRACK.w, TRACK.h, TRACK.r);
  ctx.fill();
  if (on > 0.01) {
    ctx.globalAlpha = on;
    ctx.fillStyle = c.accent;
    roundRect(ctx, TRACK.x, TRACK.y, TRACK.w, TRACK.h, TRACK.r);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  const knobX = TRACK.x + 6 + (TRACK.w - 40 - 6) * on;
  ctx.fillStyle = dark ? '#f4f3ee' : '#ffffff';
  ctx.beginPath();
  ctx.arc(knobX + 14, TRACK.y + TRACK.h / 2, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = c.ink;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Divider.
  ctx.strokeStyle = c.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CARD.x + PAD, CARD.y + 150);
  ctx.lineTo(CARD.x + CARD.w - PAD, CARD.y + 150);
  ctx.stroke();

  // Rows, with a drag on row 1 and a stagger highlight afterwards.
  const dragIn = easeOutCubic(seg(t, 4950, 5500));
  const dragOut = spring(seg(t, 5500, 6200));
  const dx = DRAG_DX * dragIn * (1 - dragOut);

  for (let i = 0; i < 3; i++) {
    const y = rowY(i);
    const isDrag = i === 1;
    const shift = isDrag ? dx : 0;

    const hlStart = 6300 + i * 200;
    const hu = seg(t, hlStart, hlStart + 420);
    const highlight = hu > 0 && hu < 1 ? Math.sin(hu * Math.PI) : 0;

    ctx.save();
    ctx.translate(shift, 0);
    if (isDrag && Math.abs(shift) > 1) {
      ctx.rotate((shift / DRAG_DX) * 0.02);
      ctx.shadowColor = dark ? 'rgba(0,0,0,0.5)' : 'rgba(18,18,17,0.18)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
    }

    if (highlight > 0.01) {
      ctx.globalAlpha = highlight * 0.16;
      ctx.fillStyle = c.accent;
      roundRect(ctx, CARD.x + PAD - 16, y - 8, CARD.w - PAD * 2 + 32, ROW_H + 16, 22);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = c.line;
    roundRect(ctx, CARD.x + PAD, y + 18, 64, 64, 20);
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = c.muted;
    roundRect(ctx, CARD.x + PAD + 20, y + 38, 24, 24, 8);
    ctx.fill();
    ctx.globalAlpha = 1;

    fillBar(ctx, CARD.x + PAD + 88, y + 26, 320, 16, c.ink, 0.72);
    fillBar(ctx, CARD.x + PAD + 88, y + 56, 200, 12, c.muted, 0.45);

    ctx.restore();
  }

  // Primary button: hover → press → spring back.
  let scale = lerp(1, 1.045, easeOutCubic(seg(t, 1500, 1780)));
  scale = lerp(scale, 0.955, easeOutCubic(seg(t, 1780, 1980)));
  const release = seg(t, 1980, 2600);
  if (release > 0) scale = lerp(0.955, 1, spring(release));

  const bcx = BTN.x + BTN.w / 2;
  const bcy = BTN.y + BTN.h / 2;
  ctx.save();
  ctx.translate(bcx, bcy);
  ctx.scale(scale, scale);
  ctx.translate(-bcx, -bcy);

  ctx.fillStyle = c.accent;
  roundRect(ctx, BTN.x, BTN.y, BTN.w, BTN.h, BTN.r);
  ctx.fill();

  if (t > 1780 && t < 2600) {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#000000';
    roundRect(ctx, BTN.x, BTN.y, BTN.w, BTN.h, BTN.r);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  fillBar(ctx, BTN.x + 62, bcy - 8, 96, 16, dark ? '#121211' : '#ffffff', 0.92);
  ctx.restore();

  // Press ripple.
  const ripple = seg(t, 1780, 2300);
  if (ripple > 0 && ripple < 1) {
    ctx.globalAlpha = 0.4 * (1 - ripple);
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bcx, bcy, 16 + 120 * easeOutExpo(ripple), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Secondary text link, bottom left.
  fillBar(ctx, CARD.x + PAD, CARD.y + CARD.h - PAD - 26, 148, 14, c.muted, 0.5);

  ctx.restore();

  // Cursor trail.
  const fade = seg(t, 500, 800) * (1 - seg(t, 7200, 7600));
  for (let i = 6; i >= 1; i--) {
    const tp = pointerAt(Math.max(0, t - i * 55));
    ctx.globalAlpha = fade * 0.06 * (7 - i);
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(tp.x, tp.y, 7 - i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const cursor = pointerAt(t);
  drawPointer(ctx, cursor, c.ink, fade);

  if (showLabel && fade > 0.5) {
    const gesture = GESTURES.find((item) => t >= item.from && t < item.to);
    if (gesture) drawGestureLabel(ctx, cursor, gesture.label, c.ink, c.surface);
  }
}

function readColors(el: HTMLElement): { colors: Colors; dark: boolean } {
  const cs = getComputedStyle(el);
  const get = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    dark: document.documentElement.classList.contains('dark'),
    colors: {
      ink: get('--ink', '#121211'),
      line: get('--line', '#e6e5df'),
      surface: get('--surface', '#ffffff'),
      accent: get('--accent', '#ff2d95'),
      body: get('--body', '#3b3b38'),
      muted: get('--muted', '#6a6964'),
    },
  };
}

export function initMotionCovers() {
  const roots = document.querySelectorAll<HTMLElement>('[data-motion-cover]');
  if (!roots.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const start = performance.now();

  roots.forEach((root) => {
    const canvas = root.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let visible = true;
    let frame = 0;
    let palette = readColors(root);

    const resize = () => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      palette = readColors(root);
    };

    const paint = (now: number) => {
      const scale = Math.max(width / DW, height / DH);
      const ox = (width - DW * scale) / 2;
      const oy = (height - DH * scale) / 2;
      const dpr = canvas.width / Math.max(width, 1);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
      const t = reduced.matches ? 1960 : (now - start) % LOOP;
      drawFrame(ctx, t, palette.colors, palette.dark, width > 640);
    };

    const loop = (now: number) => {
      if (visible) paint(now);
      frame = requestAnimationFrame(loop);
    };

    resize();
    paint(performance.now());

    new ResizeObserver(resize).observe(root);
    new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) paint(performance.now());
    }).observe(root);

    new MutationObserver(() => {
      palette = readColors(root);
      paint(performance.now());
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    reduced.addEventListener('change', () => paint(performance.now()));
    frame = requestAnimationFrame(loop);
    root.dataset.ready = 'true';
    void frame;
  });
}
