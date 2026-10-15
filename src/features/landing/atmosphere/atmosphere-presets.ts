export type AtmosphereTone = "hero" | "paper" | "cream" | "forest" | "gold";

export type ColorField = {
  color: string;
  x: number;
  y: number;
  size: number;
  depth: number;
  drift: number;
};

export type AtmospherePreset = {
  tone: AtmosphereTone;
  fields: readonly ColorField[];
  sun?: string;
};

const SAND = "224 188 135";
const GOLD = "191 146 80";
const SAGE = "143 163 120";
const BLUSH = "232 196 168";
const CREAM = "253 248 241";
const UMBER = "122 90 44";
const EMERALD = "34 92 58";

const tint = (rgb: string, alpha: number) => `rgb(${rgb} / ${alpha})`;

export const ATMOSPHERES = {
  hero: {
    tone: "hero",
    fields: [{ color: tint(SAND, 0.51), x: 78, y: 28, size: 62, depth: 0.5, drift: 0 }],
  },
  why: {
    tone: "paper",
    fields: [
      { color: tint(SAND, 0.54), x: 12, y: 22, size: 58, depth: 0.6, drift: 0 },
      { color: tint(SAGE, 0.32), x: 88, y: 70, size: 54, depth: 1, drift: 1 },
      { color: tint(BLUSH, 0.38), x: 52, y: 92, size: 46, depth: 0.4, drift: 2 },
    ],
    sun: tint(GOLD, 0.38),
  },
  treatments: {
    tone: "cream",
    fields: [
      { color: tint(CREAM, 0.85), x: 70, y: 18, size: 56, depth: 0.5, drift: 1 },
      { color: tint(GOLD, 0.32), x: 6, y: 74, size: 52, depth: 1, drift: 2 },
      { color: tint(SAGE, 0.26), x: 46, y: 50, size: 44, depth: 0.7, drift: 0 },
    ],
    sun: tint(SAND, 0.51),
  },
  stories: {
    tone: "paper",
    fields: [
      { color: tint(BLUSH, 0.48), x: 84, y: 26, size: 56, depth: 0.7, drift: 2 },
      { color: tint(SAND, 0.48), x: 14, y: 64, size: 60, depth: 0.5, drift: 0 },
      { color: tint(SAGE, 0.26), x: 60, y: 96, size: 48, depth: 1, drift: 1 },
    ],
    sun: tint(GOLD, 0.35),
  },
  promise: {
    tone: "forest",
    fields: [
      { color: tint(EMERALD, 0.7), x: 20, y: 30, size: 62, depth: 0.6, drift: 0 },
      { color: tint(SAND, 0.12), x: 86, y: 74, size: 52, depth: 1, drift: 1 },
      { color: tint(GOLD, 0.1), x: 46, y: 6, size: 44, depth: 0.4, drift: 2 },
    ],
    sun: tint(SAND, 0.14),
  },
  products: {
    tone: "cream",
    fields: [
      { color: tint(GOLD, 0.32), x: 88, y: 24, size: 54, depth: 0.8, drift: 2 },
      { color: tint(CREAM, 0.85), x: 22, y: 70, size: 58, depth: 0.5, drift: 0 },
      { color: tint(BLUSH, 0.35), x: 56, y: 88, size: 42, depth: 1, drift: 1 },
    ],
    sun: tint(SAND, 0.48),
  },
  metrics: {
    tone: "paper",
    fields: [
      { color: tint(SAGE, 0.29), x: 10, y: 30, size: 52, depth: 1, drift: 1 },
      { color: tint(SAND, 0.51), x: 74, y: 56, size: 62, depth: 0.5, drift: 0 },
      { color: tint(BLUSH, 0.35), x: 34, y: 94, size: 44, depth: 0.7, drift: 2 },
    ],
    sun: tint(GOLD, 0.35),
  },
  visit: {
    tone: "gold",
    fields: [
      { color: tint(CREAM, 0.54), x: 16, y: 18, size: 56, depth: 0.6, drift: 0 },
      { color: tint(UMBER, 0.45), x: 90, y: 86, size: 58, depth: 1, drift: 1 },
      { color: tint(SAND, 0.58), x: 58, y: 52, size: 46, depth: 0.4, drift: 2 },
    ],
    sun: tint(CREAM, 0.48),
  },
  footer: {
    tone: "forest",
    fields: [
      { color: tint(EMERALD, 0.6), x: 80, y: 20, size: 56, depth: 0.5, drift: 1 },
      { color: tint(SAND, 0.08), x: 12, y: 90, size: 48, depth: 0.8, drift: 0 },
    ],
  },
} satisfies Record<string, AtmospherePreset>;

export type AtmosphereName = keyof typeof ATMOSPHERES;
