import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { DEFAULT_CACHE_MODE, resolveCacheMode } from "./revalidate";

const ROOT = join(__dirname, "..", "..", "..");

// Las páginas no deben declarar `revalidate`: si lo hacen, Next aplica el menor entre ese
// valor y el de los datos, y el modo elegido deja de mandar.
const PAGES = [
  "app/(marketing)/page.tsx",
  "app/(marketing)/tratamientos/page.tsx",
  "app/(marketing)/tratamientos/[categoria]/page.tsx",
  "app/(marketing)/tratamientos/[categoria]/[tratamiento]/page.tsx",
  "app/(marketing)/productos/[producto]/page.tsx",
];

const FETCH_FILES = [
  "src/features/products-catalog/api/catalog.api.ts",
  "src/features/landing/api/business-hours.ts",
  "src/features/landing/api/landing-testimonials.ts",
  "src/features/landing/api/landing-catalog.ts",
  "src/features/treatments/api/showcase.api.ts",
];

describe("modo de caché", () => {
  it("usa economy cuando no hay variable", () => {
    expect(resolveCacheMode(undefined)).toBe("economy");
    expect(resolveCacheMode("")).toBe("economy");
    expect(DEFAULT_CACHE_MODE).toBe("economy");
  });

  it("acepta fresh y economy sin importar mayúsculas ni espacios", () => {
    expect(resolveCacheMode("fresh")).toBe("fresh");
    expect(resolveCacheMode(" FRESH ")).toBe("fresh");
    expect(resolveCacheMode("Economy")).toBe("economy");
  });

  it("ante un valor desconocido cae en economy, el modo seguro", () => {
    expect(resolveCacheMode("rapido")).toBe("economy");
  });

  it.each(PAGES)("%s no declara su propio revalidate", (file) => {
    expect(readFileSync(join(ROOT, file), "utf8")).not.toMatch(/export const revalidate\b/);
  });

  it.each(FETCH_FILES)("%s toma su tiempo del módulo de caché", (file) => {
    const source = readFileSync(join(ROOT, file), "utf8");
    expect(source).toContain('from "@/src/lib/cache/revalidate"');
    expect(source).not.toMatch(/const [A-Z_]*REVALIDATE_SECONDS\s*=/);
    expect(source).not.toMatch(/revalidate:\s*\d+/);
  });
});
