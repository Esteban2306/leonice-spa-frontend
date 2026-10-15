import type { LandingCatalog, LandingProduct } from "@/src/features/landing/content/landing-content";
import { SectionStack } from "@/src/features/landing/components/section-stack";
import { SunlightStage } from "@/src/features/landing/motion/sunlight-stage";
import { LandingNavbar } from "@/src/features/landing/navbar/landing-navbar";
import { HeroSection } from "@/src/features/landing/sections/hero-section";
import { LandingFooter } from "@/src/features/landing/sections/landing-footer";
import { MetricsSection } from "@/src/features/landing/sections/metrics-section";
import { ProductsSection } from "@/src/features/landing/sections/products/products-section";
import { PromiseSection } from "@/src/features/landing/sections/promise-section";
import { StoriesSection } from "@/src/features/landing/sections/stories-section";
import { TreatmentsSection } from "@/src/features/landing/sections/treatments/treatments-section";
import { VisitSection } from "@/src/features/landing/sections/visit-section";
import { WhySection } from "@/src/features/landing/sections/why-section";

export function LandingPage({
  catalog,
  products,
}: {
  catalog: LandingCatalog;
  products: LandingProduct[];
}) {
  return (
    <SunlightStage>
      <LandingNavbar categories={catalog.categories} products={products} />
      <SectionStack>
        <HeroSection />
        <WhySection />
        <TreatmentsSection catalog={catalog} />
        <StoriesSection />
        <PromiseSection />
        <ProductsSection products={products} />
        <MetricsSection />
        <VisitSection />
      </SectionStack>
      <LandingFooter />
    </SunlightStage>
  );
}
