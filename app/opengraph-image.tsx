import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SPA_NAME } from "@/src/features/landing/lib/site-config";

export const alt = `${SPA_NAME} · Tratamientos capilares en Granada, Meta`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/leonice-logo-b.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "linear-gradient(135deg, #FDF8F1 0%, #F2EBDB 60%, #E0BC87 100%)",
          color: "#062112",
        }}
      >
        <img src={logoSrc} width={340} height={340} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 620 }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 700 }}>
            Recupera la fuerza y el brillo de tu cabello
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#062112CC" }}>
            Diagnóstico capilar personalizado y tratamientos profesionales en Granada, Meta.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
