import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const config = readFileSync(join(__dirname, "..", "..", "..", "open-next.config.ts"), "utf8");

describe("configuración de OpenNext", () => {
  // Sirve páginas ya guardadas desde la capa de rutas, sin arrancar el servidor de Next.
  // Reduce la CPU por petición, que en el plan gratuito de Workers está limitada a 10 ms.
  it("mantiene activa la interceptación de caché", () => {
    expect(config).toMatch(/enableCacheInterception:\s*true/);
  });
});
