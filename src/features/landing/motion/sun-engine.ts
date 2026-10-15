export interface Viewport {
  width: number;
  height: number;
}

export interface SunPoint {
  x: number;
  y: number;
}

export interface SurfaceLight {
  sx: number;
  sy: number;
  sd: number;
}

export interface SurfaceRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const MIN_THUMB = 48;
const SUN_OUTSET = 14;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, step: number) {
  return Math.round(value / step) * step;
}

export function scrollThumbCenter(scrollY: number, documentHeight: number, viewport: Viewport): number {
  const scrollable = Math.max(documentHeight - viewport.height, 0);
  if (scrollable === 0) return viewport.height / 2;
  const thumb = Math.max(viewport.height * (viewport.height / documentHeight), MIN_THUMB);
  const progress = clamp(scrollY / scrollable, 0, 1);
  return thumb / 2 + progress * (viewport.height - thumb);
}

export function sunPosition(thumbCenter: number, viewport: Viewport): SunPoint {
  return { x: viewport.width + SUN_OUTSET, y: thumbCenter };
}

export interface LightSteps {
  direction: number;
  distance: number;
}

export const FINE_STEPS: LightSteps = { direction: 0.04, distance: 0.05 };
export const MOVING_STEPS: LightSteps = { direction: 0.1, distance: 0.1 };

export function lightFor(
  point: SunPoint,
  target: { x: number; y: number },
  viewport: Viewport,
  steps: LightSteps = FINE_STEPS,
): SurfaceLight {
  const vx = target.x - point.x;
  const vy = target.y - point.y;
  const length = Math.hypot(vx, vy) || 1;
  const reach = Math.hypot(viewport.width, viewport.height) || 1;
  return {
    sx: round(vx / length, steps.direction),
    sy: round(vy / length, steps.direction),
    sd: round(clamp(length / reach, 0, 1), steps.distance),
  };
}

const NEAR_REACH = 0.62;

export function surfaceLight(
  rect: SurfaceRect,
  sun: SunPoint,
  viewport: Viewport,
  steps: LightSteps = FINE_STEPS,
): SurfaceLight {
  const center = lightFor(sun, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, viewport, steps);
  const nearestX = clamp(sun.x, rect.left, rect.left + rect.width);
  const nearestY = clamp(sun.y, rect.top, rect.top + rect.height);
  const gap = Math.hypot(sun.x - nearestX, sun.y - nearestY);
  const reach = Math.hypot(viewport.width, viewport.height) * NEAR_REACH || 1;
  return { ...center, sd: round(clamp(gap / reach, 0, 1), steps.distance) };
}

export function sameLight(a: SurfaceLight | undefined, b: SurfaceLight): boolean {
  return a !== undefined && a.sx === b.sx && a.sy === b.sy && a.sd === b.sd;
}

export function coarseLight(light: SurfaceLight): SurfaceLight {
  return { sx: round(light.sx, 0.2), sy: round(light.sy, 0.2), sd: round(light.sd, 0.25) };
}
