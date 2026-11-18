import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BrandLoader } from "./brand-loader";

const render = (props: Parameters<typeof BrandLoader>[0]) =>
  renderToStaticMarkup(createElement(BrandLoader, props));

describe("BrandLoader", () => {
  it("anuncia la carga con el texto visible y dibuja las cuatro hojas", () => {
    const html = render({ label: "Cargando reservas…" });
    expect(html).toContain('role="status"');
    expect(html).toContain("Cargando reservas…");
    expect(html.match(/leonice-loader__leaf/g)).toHaveLength(4);
  });

  it("en línea deja el texto solo para lectores de pantalla", () => {
    const html = render({ variant: "inline", label: "Subiendo foto" });
    expect(html).toContain('role="status"');
    expect(html).toMatch(/class="sr-only">Subiendo foto</);
    expect(html).not.toContain("leonice-loader__leaf");
  });

  it("decorativo no se anuncia, para no repetir el texto del botón", () => {
    const html = render({ variant: "inline", decorative: true });
    expect(html).not.toContain('role="status"');
    expect(html).toContain('aria-hidden="true"');
  });

  it("dos cargadores en la misma pantalla no comparten ids de gradiente ni recorte", () => {
    const html = renderToStaticMarkup(
      createElement(
        Fragment,
        null,
        createElement(BrandLoader, { label: "A" }),
        createElement(BrandLoader, { label: "B" }),
      ),
    );
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toHaveLength(6);
    expect(new Set(ids).size).toBe(6);
  });
});
