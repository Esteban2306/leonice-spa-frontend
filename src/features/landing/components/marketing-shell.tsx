import type { ReactNode } from "react";

import { SkipLink } from "@/src/components/ui/skip-link";
import { getBusinessHours } from "@/src/features/landing/api/business-hours";
import { getLandingCatalog, getLandingProducts } from "@/src/features/landing/api/landing-catalog";
import { groupOpeningHours } from "@/src/features/landing/lib/opening-hours";
import { SunlightStage } from "@/src/features/landing/motion/sunlight-stage";
import { LandingNavbar } from "@/src/features/landing/navbar/landing-navbar";
import { LandingFooter } from "@/src/features/landing/sections/landing-footer";

import "@/src/features/landing/marketing-surfaces.css";

export async function MarketingShell({ children }: { children: ReactNode }) {
  const [catalog, products, businessHours] = await Promise.all([
    getLandingCatalog(),
    getLandingProducts(),
    getBusinessHours(),
  ]);
  return (
    <SunlightStage>
      <SkipLink />
      <LandingNavbar categories={catalog.categories} products={products} />
      <main id="contenido" tabIndex={-1} className="bg-[#FDF8F1] pt-28 outline-none sm:pt-32">
        {children}
      </main>
      <LandingFooter hours={businessHours ? groupOpeningHours(businessHours) : null} />
    </SunlightStage>
  );
}
