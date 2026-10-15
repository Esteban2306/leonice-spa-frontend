import { describe, expect, it } from "vitest";

import { currentLayerId, naturalTop, stackTop } from "@/src/features/landing/motion/section-stack";

describe("stackTop", () => {
  it("una sección alta se fija mostrando su parte inferior", () => {
    expect(stackTop(900, 700)).toBe(0);
    expect(stackTop(900, 1400)).toBe(-500);
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

  it("devuelve null si ninguna capa llegó", () => {
    expect(currentLayerId(layers([["a", 600, 0, 1440]]), 1440, 900)).toBeNull();
  });
});

describe("naturalTop", () => {
  it("suma las alturas previas sin depender de sticky", () => {
    expect(naturalTop(0, 0, [900, 903])).toBe(1803);
    expect(naturalTop(120, 300, [])).toBe(420);
  });
});
