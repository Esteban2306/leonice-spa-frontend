import type { Metadata } from "next";

import { getLandingCatalog, getLandingProducts } from "@/src/features/landing/api/landing-catalog";
import { LandingPage } from "@/src/features/landing/landing-page";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Leonice Arenas Spa Capilar · Diagnóstico y tratamientos capilares",
  description:
    "Diagnóstico capilar personalizado y tratamientos de grado profesional en un espacio pensado para devolverte la confianza en tu cabello.",
};

export default async function MarketingHomePage() {
  const [catalog, products] = await Promise.all([getLandingCatalog(), getLandingProducts()]);
  return <LandingPage catalog={catalog} products={products} />;
}
