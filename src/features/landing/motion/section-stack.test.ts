import { describe, expect, it } from "vitest";

import {
  currentLayerId,
  naturalTop,
  directionFor,
  easeInOutCubic,
  layerState,
  NAV_OFFSET,
  originY,
  stackTop,
} from "@/src/features/landing/motion/section-stack";

describe("directionFor", () => {
  it("alterna los sentidos y la primera sección no se monta sobre nada", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(directionFor)).toEqual([
      "up",
      "from-left",
      "up",
      "from-right",
      "up",
      "from-left",
      "from-right",
    ]);
    expect(directionFor(0)).toBe("up");
    expect(directionFor(20)).toBe("up");
  });
});

describe("stackTop / originY", () => {
  it("una sección alta se fija mostrando su parte inferior", () => {
    expect(stackTop(900, 700)).toBe(0);
    expect(stackTop(900, 1400)).toBe(-500);
  });

  it("el origen de la escala queda en el centro de lo visible", () => {
    expect(originY(900, 700, 0)).toBe(450);
    expect(originY(900, 1400, -500)).toBe(950);
    expect(originY(900, 600, 0)).toBe(450);
  });
});

describe("layerState", () => {
  const base = { viewportHeight: 900, mobile: false, nextProgress: 0 };

  it("la sección que sube desde abajo no recibe desplazamiento horizontal", () => {
    const state = layerState({ ...base, direction: "up", progress: 0.4 });
    expect(state.x).toBe(0);
    expect(state.y).toBe(0);
    expect(state.settleY).toBeGreaterThan(0);
    expect(state.radius).toBeGreaterThan(0);
  });

  it("entra desde la izquierda o la derecha y queda en su sitio al terminar", () => {
    const left = layerState({ ...base, direction: "from-left", progress: 0 });
    const right = layerState({ ...base, direction: "from-right", progress: 0 });
    expect(left.x).toBe(-100);
    expect(right.x).toBe(100);

    const done = layerState({ ...base, direction: "from-left", progress: 1 });
    expect(done).toMatchObject({ x: 0, y: 0, radius: 0, rim: 0, settleX: 0, settleY: 0 });
  });

  it("compensa el scroll para que la sección deslice con el borde superior fijo", () => {
    const start = layerState({ ...base, direction: "from-right", progress: 0 });
    const half = layerState({ ...base, direction: "from-right", progress: 0.5 });
    expect(start.y).toBe(-900);
    expect(half.y).toBe(-450);
    const naturalTop = (p: number) => 900 - p * (900 - NAV_OFFSET);
    expect(naturalTop(0.5) + half.y).toBeCloseTo(0.5 * NAV_OFFSET);
  });

  it("la anterior se achica y se oscurece a medida que la nueva entra", () => {
    const idle = layerState({ ...base, direction: "up", progress: 1, nextProgress: 0 });
    const covered = layerState({ ...base, direction: "up", progress: 1, nextProgress: 0.8 });
    expect(idle.scale).toBe(1);
    expect(covered.scale).toBeLessThan(1);
    expect(covered.shade).toBeGreaterThan(0.3);
  });

  it("en móvil no escala la anterior y el recorrido horizontal es menor", () => {
    const mobile = layerState({ ...base, mobile: true, direction: "from-left", progress: 0, nextProgress: 0.8 });
    expect(mobile.scale).toBe(1);
    expect(mobile.x).toBe(-55);
  });

  it("la curva de deslizamiento arranca y termina suave", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.25)).toBeLessThan(0.25);
  });
});

describe("currentLayerId", () => {
  const layers = (items: [string, number, number, number][]) =>
    items.map(([id, top, left, right]) => ({ id, top, left, right }));

  it("elige la última capa que ya llegó a la línea de lectura", () => {
    const rects = layers([
      ["a", 20, 0, 1440],
      ["b", 30, 0, 1440],
      ["c", 700, 0, 1440],
    ]);
    expect(currentLayerId(rects, 1440, 900)).toBe("b");
  });

  it("ignora la capa que todavía está fuera de la pantalla horizontalmente", () => {
    const rects = layers([
      ["a", 20, 0, 1440],
      ["b", 0, -1440, 0],
    ]);
    expect(currentLayerId(rects, 1440, 900)).toBe("a");
    const arriving = layers([
      ["a", 20, 0, 1440],
      ["b", 12, -400, 1040],
    ]);
    expect(currentLayerId(arriving, 1440, 900)).toBe("b");
  });

  it("devuelve null si ninguna capa llegó", () => {
    expect(currentLayerId(layers([["a", 600, 0, 1440]]), 1440, 900)).toBeNull();
  });
});

describe("naturalTop", () => {
  it("suma las alturas previas sin depender de sticky ni transform", () => {
    expect(naturalTop(0, 0, [900, 903])).toBe(1803);
    expect(naturalTop(120, 300, [])).toBe(420);
  });
});
