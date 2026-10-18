import type { BusinessHours } from "../api/business-hours";
import { toOpeningHoursSpecification } from "./opening-hours";
import { absoluteUrl, BUSINESS_ID, SITE_DESCRIPTION, SITE_URL } from "./seo";
import { SPA_NAME, siteContact } from "./site-config";

const CONTEXT = "https://schema.org";

export function localBusinessJsonLd(hours: BusinessHours | null) {
  const openingHours = hours ? toOpeningHoursSpecification(hours) : [];
  return {
    "@context": CONTEXT,
    "@type": "HairSalon",
    "@id": BUSINESS_ID,
    name: SPA_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: absoluteUrl("/leonice-logo-b.png"),
    image: absoluteUrl("/leonice-logo-b.png"),
    ...(siteContact.whatsappDigits ? { telephone: `+${siteContact.whatsappDigits}` } : {}),
    address: { "@type": "PostalAddress", ...siteContact.postalAddress },
    geo: { "@type": "GeoCoordinates", ...siteContact.geo },
    hasMap: siteContact.mapsUrl,
    ...(openingHours.length > 0 ? { openingHoursSpecification: openingHours } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": `${SITE_URL}/#sitio`,
    name: SPA_NAME,
    url: SITE_URL,
    inLanguage: "es-CO",
    publisher: { "@id": BUSINESS_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function priceSpecification(min: number | null, max: number | null) {
  if (min === null) return null;
  return {
    "@type": "PriceSpecification",
    priceCurrency: "COP",
    minPrice: min,
    ...(max !== null && max !== min ? { maxPrice: max } : {}),
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string | null;
  path: string;
  categoryName: string;
  image: string | null;
  priceFromPesos: number | null;
  priceToPesos: number | null;
}) {
  const price = priceSpecification(service.priceFromPesos, service.priceToPesos);
  return {
    "@context": CONTEXT,
    "@type": "Service",
    name: service.name,
    serviceType: service.categoryName,
    url: absoluteUrl(service.path),
    ...(service.description ? { description: service.description } : {}),
    ...(service.image ? { image: service.image } : {}),
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "City", name: siteContact.postalAddress.addressLocality },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "COP",
            priceSpecification: price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function productJsonLd(product: {
  name: string;
  description: string | null;
  path: string;
  image: string | null;
  brand: string | null;
  categoryName: string;
  priceMinPesos: number | null;
  priceMaxPesos: number | null;
}) {
  return {
    "@context": CONTEXT,
    "@type": "Product",
    name: product.name,
    url: absoluteUrl(product.path),
    category: product.categoryName,
    ...(product.description ? { description: product.description } : {}),
    ...(product.image ? { image: product.image } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.priceMinPesos !== null
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "COP",
            lowPrice: product.priceMinPesos,
            highPrice: product.priceMaxPesos ?? product.priceMinPesos,
            availability: "https://schema.org/InStock",
            seller: { "@id": BUSINESS_ID },
          },
        }
      : {}),
  };
}
