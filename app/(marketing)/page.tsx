import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { getBusinessHours } from "@/src/features/landing/api/business-hours";
import { getLandingStories } from "@/src/features/landing/api/landing-testimonials";
import {
  getFeaturedLandingProducts,
  getLandingCatalog,
  getLandingProducts,
} from "@/src/features/landing/api/landing-catalog";
import { LandingPage } from "@/src/features/landing/landing-page";
import { groupOpeningHours } from "@/src/features/landing/lib/opening-hours";
import { pageMetadata } from "@/src/features/landing/lib/seo";
import { localBusinessJsonLd, websiteJsonLd } from "@/src/features/landing/lib/structured-data";
import { SPA_NAME } from "@/src/features/landing/lib/site-config";

export const revalidate = 60;

const home = pageMetadata({
  title: `${SPA_NAME} · Tratamientos capilares en Granada, Meta`,
  path: "/",
});

export const metadata: Metadata = {
  ...home,
  title: { absolute: `${SPA_NAME} · Tratamientos capilares en Granada, Meta` },
};

export default async function MarketingHomePage() {
  const [catalog, products, featuredProducts, businessHours, stories] = await Promise.all([
    getLandingCatalog(),
    getLandingProducts(),
    getFeaturedLandingProducts(),
    getBusinessHours(),
    getLandingStories(),
  ]);
  return (
    <>
      <JsonLd data={localBusinessJsonLd(businessHours)} />
      <JsonLd data={websiteJsonLd()} />
      <LandingPage
        catalog={catalog}
        products={products}
        featuredProducts={featuredProducts}
        hours={businessHours ? groupOpeningHours(businessHours) : null}
        stories={stories}
      />
    </>
  );
}
