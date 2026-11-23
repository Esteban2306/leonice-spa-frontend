import { describe, expect, it } from "vitest";

import imageLoader, {
  cloudinaryDelivery,
  cloudinaryVideo,
  videoPoster,
  videoWidthFor,
} from "@/src/lib/images/cloudinary-loader";

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

  it("las imágenes propias del sitio llevan el ancho sin cambiar el archivo", () => {
    expect(imageLoader({ src: "/_next/static/media/logo.png", width: 256 })).toBe(
      "/_next/static/media/logo.png?w=256",
    );
  });
});

describe("entrega de imágenes y videos con tope de 1280 px", () => {
  const VIDEO = "https://res.cloudinary.com/exyhq5ry/video/upload/v17/leonice-spa/treatments/video-1.mp4";

  it("nunca pide imágenes de más de 1280 px", () => {
    expect(cloudinaryDelivery(`${BASE}/v1/a.jpg`, 3840)).toBe(`${BASE}/f_auto,q_auto,c_limit,w_1280/v1/a.jpg`);
  });

  it("el video sale con formato, calidad y códec automáticos al ancho pedido", () => {
    expect(cloudinaryVideo(VIDEO, 720)).toBe(
      "https://res.cloudinary.com/exyhq5ry/video/upload/f_auto,q_auto,vc_auto,c_limit,w_720/v17/leonice-spa/treatments/video-1.mp4",
    );
    expect(cloudinaryVideo(VIDEO, 1920)).toContain("w_1280/");
  });

  it("la portada es el final del video, aunque venga otra portada guardada", () => {
    const lastFrame =
      "https://res.cloudinary.com/exyhq5ry/video/upload/so_99p,f_auto,q_auto,c_limit,w_1280/v17/leonice-spa/treatments/video-1.jpg";
    expect(videoPoster(VIDEO, null, 1280)).toBe(lastFrame);
    expect(videoPoster(VIDEO, `${BASE}/v1/p.jpg`, 1280)).toBe(lastFrame);
  });

  it("si el video no es de Cloudinary, usa la portada guardada", () => {
    expect(videoPoster("blob:http://localhost/1", `${BASE}/v1/p.jpg`, 720)).toBe(
      `${BASE}/f_auto,q_auto,c_limit,w_720/v1/p.jpg`,
    );
  });

  it("en celular pide 720 px y en pantallas grandes 1280", () => {
    expect(videoWidthFor(390)).toBe(720);
    expect(videoWidthFor(1440)).toBe(1280);
  });

  it("un video que no es de Cloudinary queda igual y sin portada inventada", () => {
    expect(cloudinaryVideo("blob:http://localhost/1", 720)).toBe("blob:http://localhost/1");
    expect(videoPoster("blob:http://localhost/1", null, 720)).toBeUndefined();
  });
});
