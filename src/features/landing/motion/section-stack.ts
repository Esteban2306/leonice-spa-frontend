export const NAV_OFFSET = 88;

export interface LayerRect {
  id: string;
  top: number;
  left: number;
  right: number;
}

const CURRENT_LINE = 0.4;

export function stackTop(viewportHeight: number, sectionHeight: number): number {
  return Math.min(0, viewportHeight - sectionHeight);
}

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
