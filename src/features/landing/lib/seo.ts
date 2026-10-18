import type { Metadata } from "next";

import { SPA_NAME } from "./site-config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const SITE_DESCRIPTION =
  "Spa capilar en Granada, Meta: diagnóstico capilar personalizado y tratamientos de grado profesional para recuperar la fuerza y el brillo de tu cabello.";

export const BUSINESS_ID = `${SITE_URL}/#negocio`;

export const DEFAULT_SHARE_IMAGE = "/opengraph-image";

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
}): Metadata {
  const resolvedDescription = description ?? SITE_DESCRIPTION;
  const shareImage = image ?? DEFAULT_SHARE_IMAGE;
  return {
    title,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: SPA_NAME,
      url: path,
      title,
      description: resolvedDescription,
      images: [{ url: shareImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: resolvedDescription,
      images: [shareImage],
    },
  };
}
