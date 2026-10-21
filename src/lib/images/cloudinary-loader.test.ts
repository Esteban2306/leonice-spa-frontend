import { describe, expect, it } from "vitest";

import imageLoader, { cloudinaryDelivery } from "@/src/lib/images/cloudinary-loader";

const BASE = "https://res.cloudinary.com/exyhq5ry/image/upload";

describe("cloudinaryDelivery", () => {
  it("pide formato y calidad automáticos al ancho solicitado, sin ampliar", () => {
    expect(cloudinaryDelivery(`${BASE}/v1700000000/leonice-spa/a.jpg`, 640)).toBe(
      `${BASE}/f_auto,q_auto,c_limit,w_640/v1700000000/leonice-spa/a.jpg`,
    );
  });

  it("aplica el ancho después de las transformaciones que ya traiga la URL", () => {
    expect(cloudinaryDelivery(`${BASE}/c_fill,w_800,h_1000/v12/a.jpg`, 320)).toBe(
      `${BASE}/c_fill,w_800,h_1000/f_auto,q_auto,c_limit,w_320/v12/a.jpg`,
    );
  });

  it("funciona con URLs sin versión", () => {
    expect(cloudinaryDelivery(`${BASE}/leonice-spa/a.jpg`, 128)).toBe(
      `${BASE}/f_auto,q_auto,c_limit,w_128/leonice-spa/a.jpg`,
    );
  });

  it("deja intactas las imágenes que no son de entrega pública de Cloudinary", () => {
    expect(cloudinaryDelivery("/_next/static/media/logo.png", 256)).toBe("/_next/static/media/logo.png");
    const authenticated = "https://res.cloudinary.com/exyhq5ry/image/authenticated/s--x--/v1/a.jpg";
    expect(cloudinaryDelivery(authenticated, 256)).toBe(authenticated);
    expect(cloudinaryDelivery("https://example.com/image/upload/a.jpg", 256)).toBe(
      "https://example.com/image/upload/a.jpg",
    );
  });

  it("el loader de Next usa el ancho que recibe", () => {
    expect(imageLoader({ src: `${BASE}/v1/a.jpg`, width: 828 })).toContain("w_828");
  });
});
