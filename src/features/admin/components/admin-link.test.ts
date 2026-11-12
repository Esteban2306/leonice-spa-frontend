import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ADMIN_DIR = join(__dirname, "..");
const WRAPPER = join(__dirname, "admin-link.tsx");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

describe("enlaces del panel", () => {
  it("el envoltorio desactiva la precarga por defecto", () => {
    expect(readFileSync(WRAPPER, "utf8")).toMatch(/prefetch = false/);
  });

  it("ningún archivo del panel importa next/link directamente", () => {
    const offenders = sourceFiles(ADMIN_DIR).filter(
      (file) => file !== WRAPPER && /from ["']next\/link["']/.test(readFileSync(file, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
