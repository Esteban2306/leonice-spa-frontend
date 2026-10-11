import {
  fallbackCatalog,
  treatmentsContent,
  type LandingCatalog,
  type LandingCategory,
  type LandingTreatment,
  type TreatmentCopy,
} from "@/src/features/landing/content/landing-content";

interface ApiTreatment {
  id: string;
  name: string;
  isActive: boolean;
  requiresPriorAssessment: boolean;
  basePriceMin: string | number | null;
  basePriceMax: string | number | null;
  baseDurationMinMinutes: number | null;
  baseDurationMaxMinutes: number | null;
  category: { id: string; name: string } | null;
  activePromotion: { name: string; discountPercentage: string | number } | null;
  effectiveBasePriceMin?: number | null;
}

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 4000;

const toNumber = (value: string | number | null | undefined) =>
  value === null || value === undefined ? null : Number(value);

function copyFor(treatment: ApiTreatment): TreatmentCopy {
  return (
    treatmentsContent.copyByName[treatment.name] ??
    (treatment.category
      ? treatmentsContent.copyByCategory[treatment.category.name]
      : undefined) ??
    treatmentsContent.defaultCopy
  );
}

function toLanding(treatment: ApiTreatment): LandingTreatment | null {
  const from = toNumber(treatment.basePriceMin);
  if (from === null || !treatment.category) return null;
  const to = toNumber(treatment.basePriceMax) ?? from;
  const promoFrom = toNumber(treatment.effectiveBasePriceMin);
  return {
    id: treatment.id,
    name: treatment.name,
    categoryName: treatment.category.name,
    durationMinutes:
      treatment.baseDurationMinMinutes ?? treatment.baseDurationMaxMinutes ?? 60,
    priceFromThousands: from,
    priceToThousands: to,
    promotion:
      treatment.activePromotion && promoFrom !== null
        ? {
            name: treatment.activePromotion.name,
            discountPercentage: Number(treatment.activePromotion.discountPercentage),
            priceFromThousands: promoFrom,
          }
        : null,
    requiresAssessment: treatment.requiresPriorAssessment,
    copy: copyFor(treatment),
    image: null,
  };
}

function pickFeatured(treatments: LandingTreatment[]): LandingTreatment[] {
  const byName = new Map(treatments.map((t) => [t.name, t]));
  const chosen: LandingTreatment[] = [];
  for (const name of treatmentsContent.featuredNames) {
    const match = byName.get(name);
    if (match && !chosen.includes(match)) chosen.push(match);
  }
  for (const treatment of treatments) {
    if (chosen.length >= 3) break;
    if (
      treatment.categoryName === treatmentsContent.fallbackCategory &&
      !chosen.includes(treatment)
    ) {
      chosen.push(treatment);
    }
  }
  return chosen.slice(0, 3);
}

function groupCategories(treatments: LandingTreatment[]): LandingCategory[] {
  const groups = new Map<string, LandingTreatment[]>();
  for (const treatment of treatments) {
    const list = groups.get(treatment.categoryName) ?? [];
    list.push(treatment);
    groups.set(treatment.categoryName, list);
  }
  return [...groups.entries()]
    .map(([name, list]) => {
      const sorted = [...list].sort(
        (a, b) => a.priceFromThousands - b.priceFromThousands,
      );
      return {
        id: name,
        name,
        treatmentCount: list.length,
        fromThousands: sorted[0]?.priceFromThousands ?? null,
        highlights: sorted.slice(0, 3),
      };
    })
    .sort((a, b) => b.treatmentCount - a.treatmentCount);
}

export async function getLandingCatalog(): Promise<LandingCatalog> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return fallbackCatalog;

  try {
    const response = await fetch(`${apiUrl}/treatments`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return fallbackCatalog;
    const payload = (await response.json()) as ApiTreatment[] | { data: ApiTreatment[] };
    const list = Array.isArray(payload) ? payload : payload.data;

    const treatments = list
      .filter(
        (t) =>
          t.isActive &&
          t.category &&
          !treatmentsContent.hiddenCategories.includes(t.category.name),
      )
      .map(toLanding)
      .filter((t): t is LandingTreatment => t !== null);

    if (treatments.length === 0) return fallbackCatalog;

    return {
      source: "api",
      featured: pickFeatured(treatments),
      all: [...treatments].sort(
        (a, b) =>
          a.categoryName.localeCompare(b.categoryName, "es") ||
          a.priceFromThousands - b.priceFromThousands,
      ),
      categories: groupCategories(treatments),
    };
  } catch {
    return fallbackCatalog;
  }
}
