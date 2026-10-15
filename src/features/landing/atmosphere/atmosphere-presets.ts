import type { BranchSpec, StrandSpec } from "@/src/features/landing/atmosphere/atmosphere-geometry";

export type AtmosphereTone = "hero" | "paper" | "cream" | "forest" | "gold";

export type WindowPlacement = {
  side: "left" | "right";
  top: string;
  width: string;
};

export type AtmospherePreset = {
  tone: AtmosphereTone;
  window?: WindowPlacement;
  sprig?: readonly BranchSpec[];
  strands: readonly StrandSpec[];
};

export const OLIVE_SPRIG: readonly BranchSpec[] = [
  { origin: [400, 10], angle: 148, length: 340, leaves: 11, size: 1.3, bend: 46 },
  { origin: [400, 150], angle: 172, length: 230, leaves: 7, size: 1.05, bend: -34 },
];

export const EUCALYPTUS_SPRIG: readonly BranchSpec[] = [
  { origin: [400, 60], angle: 160, length: 360, leaves: 9, size: 1.5, bend: -40 },
  { origin: [300, 0], angle: 120, length: 210, leaves: 6, size: 1.1, bend: 26 },
];

export const ATMOSPHERES = {
  hero: {
    tone: "hero",
    strands: [{ from: [-60, 820], c1: [420, 660], c2: [820, 1010], to: [1500, 690], count: 6, spread: 7 }],
  },
  why: {
    tone: "paper",
    window: { side: "right", top: "-4%", width: "clamp(18rem, 34vw, 34rem)" },
    sprig: OLIVE_SPRIG,
    strands: [{ from: [-60, 300], c1: [280, 80], c2: [880, 460], to: [1500, 170], count: 5, spread: 6 }],
  },
  treatments: {
    tone: "cream",
    window: { side: "right", top: "-12%", width: "clamp(16rem, 30vw, 30rem)" },
    sprig: EUCALYPTUS_SPRIG,
    strands: [{ from: [1500, 80], c1: [1100, 260], c2: [620, -40], to: [-60, 210], count: 5, spread: 6 }],
  },
  stories: {
    tone: "paper",
    window: { side: "right", top: "18%", width: "clamp(18rem, 32vw, 32rem)" },
    sprig: EUCALYPTUS_SPRIG,
    strands: [{ from: [-60, 760], c1: [360, 900], c2: [980, 560], to: [1500, 780], count: 6, spread: 6 }],
  },
  promise: {
    tone: "forest",
    window: { side: "right", top: "8%", width: "clamp(18rem, 34vw, 36rem)" },
    sprig: OLIVE_SPRIG,
    strands: [{ from: [-60, 180], c1: [500, -20], c2: [940, 420], to: [1500, 120], count: 6, spread: 7 }],
  },
  products: {
    tone: "cream",
    window: { side: "right", top: "-10%", width: "clamp(16rem, 28vw, 28rem)" },
    strands: [{ from: [-60, 660], c1: [400, 860], c2: [1000, 520], to: [1500, 700], count: 5, spread: 6 }],
  },
  metrics: {
    tone: "paper",
    window: { side: "left", top: "40%", width: "clamp(16rem, 28vw, 28rem)" },
    sprig: OLIVE_SPRIG,
    strands: [{ from: [1500, 760], c1: [1040, 940], c2: [560, 600], to: [-60, 820], count: 5, spread: 6 }],
  },
  visit: {
    tone: "gold",
    window: { side: "right", top: "-6%", width: "clamp(18rem, 32vw, 34rem)" },
    sprig: EUCALYPTUS_SPRIG,
    strands: [{ from: [-60, 760], c1: [460, 600], c2: [900, 960], to: [1500, 640], count: 6, spread: 7 }],
  },
  footer: {
    tone: "forest",
    strands: [{ from: [-60, 300], c1: [420, 120], c2: [1000, 520], to: [1500, 260], count: 5, spread: 6 }],
  },
} satisfies Record<string, AtmospherePreset>;

export type AtmosphereName = keyof typeof ATMOSPHERES;
