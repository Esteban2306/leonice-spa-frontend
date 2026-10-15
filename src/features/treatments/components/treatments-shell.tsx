import type { ReactNode } from "react";

import { getLandingCatalog, getLandingProducts } from "@/src/features/landing/api/landing-catalog";
import { SunlightStage } from "@/src/features/landing/motion/sunlight-stage";
import { LandingNavbar } from "@/src/features/landing/navbar/landing-navbar";
import { LandingFooter } from "@/src/features/landing/sections/landing-footer";

import "@/src/features/treatments/treatments.css";

export async function TreatmentsShell({ children }: { children: ReactNode }) {
  const [catalog, products] = await Promise.all([getLandingCatalog(), getLandingProducts()]);
  return (
    <SunlightStage>
      <LandingNavbar categories={catalog.categories} products={products} />
      <main className="bg-[#FDF8F1] pt-28 sm:pt-32">{children}</main>
      <LandingFooter />
    </SunlightStage>
  );
}
