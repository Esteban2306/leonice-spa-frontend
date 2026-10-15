export type StackDirection = "up" | "from-left" | "from-right";

export const STACK_PLAN: StackDirection[] = [
  "up",
  "from-left",
  "up",
  "from-right",
  "up",
  "from-left",
  "from-right",
];

export const NAV_OFFSET = 88;

const SLIDE_END = 0.9;
const DEPTH_SCALE = 0.06;
const DEPTH_SHADE = 0.52;
const RADIUS = 44;
const RADIUS_STEP = 11;

export function directionFor(index: number): StackDirection {
  return index <= 0 ? "up" : (STACK_PLAN[index - 1] ?? "up");
}

function zero(value: number) {
  return value === 0 ? 0 : value;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function easeInOutCubic(t: number) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

export function stackTop(viewportHeight: number, sectionHeight: number): number {
  return Math.min(0, viewportHeight - sectionHeight);
}

export function originY(viewportHeight: number, sectionHeight: number, top: number): number {
  return Math.min(sectionHeight, Math.max(0, -top + viewportHeight / 2));
}

export interface LayerInput {
  direction: StackDirection;
  progress: number;
  nextProgress: number;
  viewportHeight: number;
  mobile: boolean;
}

export interface LayerState {
  x: number;
  y: number;
  scale: number;
  shade: number;
  radius: number;
  rim: number;
  settleX: number;
  settleY: number;
  active: boolean;
}

export function layerState(input: LayerInput): LayerState {
  const p = clamp01(input.progress);
  const next = clamp01(input.nextProgress);
  const slide = 1 - easeInOutCubic(p / SLIDE_END);
  const horizontal = input.direction !== "up";
  const sign = input.direction === "from-left" ? -1 : 1;
  const travel = input.mobile ? 55 : 100;

  const depth = easeOutCubic(next);
  const entering = p > 0 && p < 1;

  return {
    x: zero(horizontal ? sign * slide * travel : 0),
    y: zero(horizontal ? -(1 - p) * input.viewportHeight : 0),
    scale: input.mobile ? 1 : 1 - DEPTH_SCALE * depth,
    shade: DEPTH_SHADE * depth,
    radius: Math.round((RADIUS * (1 - easeOutCubic(p))) / RADIUS_STEP) * RADIUS_STEP,
    rim: entering ? 1 - p : 0,
    settleX: zero(horizontal ? -sign * slide * (input.mobile ? 8 : 14) : 0),
    settleY: horizontal ? 0 : (1 - easeOutCubic(p)) * (input.mobile ? 36 : 64),
    active: entering || (next > 0 && next < 1),
  };
}

export interface LayerRect {
  id: string;
  top: number;
  left: number;
  right: number;
}

const CURRENT_LINE = 0.4;

export function currentLayerId(layers: LayerRect[], viewportWidth: number, viewportHeight: number): string | null {
  let current: string | null = null;
  for (const layer of layers) {
    const reachesLine = layer.top <= viewportHeight * CURRENT_LINE;
    const coversCenter = layer.left <= viewportWidth / 2 && layer.right >= viewportWidth / 2;
    if (reachesLine && coversCenter) current = layer.id;
  }
  return current;
}

export function naturalTop(mainTop: number, scrollY: number, previousHeights: number[]): number {
  return mainTop + scrollY + previousHeights.reduce((sum, height) => sum + height, 0);
}
