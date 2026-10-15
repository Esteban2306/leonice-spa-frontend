export type Point = readonly [number, number];

export type StrandSpec = {
  from: Point;
  c1: Point;
  c2: Point;
  to: Point;
  count: number;
  spread: number;
};

export type BranchSpec = {
  origin: Point;
  angle: number;
  length: number;
  leaves: number;
  size: number;
  bend: number;
};

export type Leaf = { d: string; transform: string };

export const LEAF_PATH = "M0 0C8-9 26-11 40 0C26 11 8 9 0 0Z";

const round = (value: number) => Math.round(value * 10) / 10;

const pair = ([x, y]: Point) => `${round(x)} ${round(y)}`;

const shift = ([x, y]: Point, dx: number, dy: number): Point => [x + dx, y + dy];

export function strandBundle(spec: StrandSpec): string[] {
  const middle = (spec.count - 1) / 2;
  return Array.from({ length: spec.count }, (_, index) => {
    const k = (index - middle) * spec.spread;
    const from = shift(spec.from, 0, k * 0.5);
    const c1 = shift(spec.c1, k * 0.3, k * 1.4);
    const c2 = shift(spec.c2, -k * 0.2, -k * 0.9);
    const to = shift(spec.to, 0, k * 1.8);
    return `M${pair(from)}C${pair(c1)} ${pair(c2)} ${pair(to)}`;
  });
}

function quadraticPoint(start: Point, control: Point, end: Point, t: number): Point {
  const u = 1 - t;
  return [
    u * u * start[0] + 2 * u * t * control[0] + t * t * end[0],
    u * u * start[1] + 2 * u * t * control[1] + t * t * end[1],
  ];
}

function quadraticAngle(start: Point, control: Point, end: Point, t: number) {
  const dx = 2 * (1 - t) * (control[0] - start[0]) + 2 * t * (end[0] - control[0]);
  const dy = 2 * (1 - t) * (control[1] - start[1]) + 2 * t * (end[1] - control[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function branch(spec: BranchSpec): { stem: string; leaves: Leaf[] } {
  const radians = (spec.angle * Math.PI) / 180;
  const end: Point = [
    spec.origin[0] + Math.cos(radians) * spec.length,
    spec.origin[1] + Math.sin(radians) * spec.length,
  ];
  const mid: Point = [(spec.origin[0] + end[0]) / 2, (spec.origin[1] + end[1]) / 2];
  const control: Point = [mid[0] - Math.sin(radians) * spec.bend, mid[1] + Math.cos(radians) * spec.bend];

  const leaves = Array.from({ length: spec.leaves }, (_, index) => {
    const t = (index + 1) / (spec.leaves + 1);
    const [x, y] = quadraticPoint(spec.origin, control, end, t);
    const side = index % 2 === 0 ? 1 : -1;
    const angle = quadraticAngle(spec.origin, control, end, t) + side * 38;
    const scale = spec.size * (1 - 0.45 * t);
    return {
      d: LEAF_PATH,
      transform: `translate(${round(x)} ${round(y)}) rotate(${round(angle)}) scale(${round(scale * 100) / 100})`,
    };
  });

  return { stem: `M${pair(spec.origin)}Q${pair(control)} ${pair(end)}`, leaves };
}
