import {
  type LandingCatalog,
  type LandingProduct,
  type StoryItem,
} from "@/src/features/landing/content/landing-content";
import type { OpeningHoursRow } from "@/src/features/landing/lib/opening-hours";
import { SkipLink } from "@/src/components/ui/skip-link";
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
  featuredProducts,
  hours,
  stories,
}: {
  catalog: LandingCatalog;
  products: LandingProduct[];
  featuredProducts: LandingProduct[];
  hours: OpeningHoursRow[] | null;
  stories: StoryItem[];
}) {
  return (
    <SunlightStage>
      <SkipLink />
      <LandingNavbar categories={catalog.categories} products={products} />
      <SectionStack>
        <HeroSection />
        <WhySection />
        {catalog.featured.length > 0 && <TreatmentsSection catalog={catalog} />}
        <StoriesSection stories={stories} />
        <PromiseSection />
        {featuredProducts.length > 0 && <ProductsSection products={featuredProducts} />}
        <MetricsSection />
        <VisitSection hours={hours} />
      </SectionStack>
      <LandingFooter hours={hours} />
    </SunlightStage>
  );
}
