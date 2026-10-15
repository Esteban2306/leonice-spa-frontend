import { describe, expect, it } from "vitest";

import { allowedImageUrl } from "@/src/features/landing/lib/allowed-image";

describe("allowedImageUrl", () => {
  it("acepta solo imágenes de la cuenta de Cloudinary configurada", () => {
    const ok = "https://res.cloudinary.com/exyhq5ry/image/upload/v1/leonice-spa/products/a.jpg";
    expect(allowedImageUrl(ok)).toBe(ok);
  });

  it("descarta hosts no configurados, http y URLs rotas", () => {
    expect(allowedImageUrl("https://ejemplo.com/shampoo.jpg")).toBeNull();
    expect(allowedImageUrl("http://res.cloudinary.com/exyhq5ry/a.jpg")).toBeNull();
    expect(allowedImageUrl("https://res.cloudinary.com/otra-cuenta/a.jpg")).toBeNull();
    expect(allowedImageUrl("no es una url")).toBeNull();
    expect(allowedImageUrl(null)).toBeNull();
  });
});
