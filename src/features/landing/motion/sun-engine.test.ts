import { describe, expect, it } from "vitest";

import {
  lightFor,
  sameLight,
  scrollThumbCenter,
  sunPosition,
  surfaceLight,
} from "@/src/features/landing/motion/sun-engine";

const viewport = { width: 1440, height: 900 };

describe("scrollThumbCenter", () => {
  it("sigue al pulgar de la barra de arriba a abajo", () => {
    const top = scrollThumbCenter(0, 9000, viewport);
    const bottom = scrollThumbCenter(8100, 9000, viewport);
    expect(top).toBeCloseTo(45);
    expect(bottom).toBeCloseTo(855);
    expect(scrollThumbCenter(4050, 9000, viewport)).toBeCloseTo(450);
  });

  it("usa un pulgar mínimo en páginas muy largas y centra el sol si no hay scroll", () => {
    expect(scrollThumbCenter(0, 100000, viewport)).toBe(24);
    expect(scrollThumbCenter(0, 800, viewport)).toBe(450);
  });

  it("no se sale de la barra con scroll elástico", () => {
    expect(scrollThumbCenter(-200, 9000, viewport)).toBeCloseTo(45);
    expect(scrollThumbCenter(99999, 9000, viewport)).toBeCloseTo(855);
  });
});

describe("surfaceLight", () => {
  const sun = sunPosition(100, viewport);

  it("proyecta la sombra lejos del sol que está a la derecha", () => {
    const light = surfaceLight({ left: 100, top: 400, width: 300, height: 200 }, sun, viewport);
    expect(light.sx).toBeLessThan(0);
    expect(light.sy).toBeGreaterThan(0);
  });

  it("un componente por encima del sol recibe la luz desde abajo", () => {
    const low = sunPosition(800, viewport);
    const light = surfaceLight({ left: 900, top: 50, width: 200, height: 100 }, low, viewport);
    expect(light.sy).toBeLessThan(0);
  });

  it("cuantiza para no reescribir estilos por cambios mínimos", () => {
    const a = lightFor(sun, { x: 500, y: 500 }, viewport);
    const b = lightFor(sun, { x: 500.4, y: 500.2 }, viewport);
    expect(sameLight(a, b)).toBe(true);
    expect(a.sd).toBeGreaterThan(0);
    expect(a.sd).toBeLessThanOrEqual(1);
  });
});
