import type {
  ShowcaseCategoryDetail,
  ShowcaseCategorySummary,
  ShowcaseTreatmentDetail,
} from "@/src/features/treatments/api/showcase.types";

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 5000;

export class ShowcaseUnavailableError extends Error {}

async function getShowcase<T>(path: string): Promise<T | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new ShowcaseUnavailableError("NEXT_PUBLIC_API_URL no está configurada");

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/showcase${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["showcase"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new ShowcaseUnavailableError("No pudimos conectar con el catálogo", { cause: error });
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new ShowcaseUnavailableError(`El catálogo respondió ${response.status}`);

  const payload = (await response.json()) as T | { data: T };
  return payload !== null && typeof payload === "object" && "data" in payload
    ? (payload as { data: T }).data
    : (payload as T);
}

export async function getShowcaseCategories(): Promise<ShowcaseCategorySummary[]> {
  return (await getShowcase<ShowcaseCategorySummary[]>("/categories")) ?? [];
}

export function getShowcaseCategory(categorySlug: string) {
  return getShowcase<ShowcaseCategoryDetail>(`/categories/${encodeURIComponent(categorySlug)}`);
}

export function getShowcaseTreatment(categorySlug: string, treatmentSlug: string) {
  return getShowcase<ShowcaseTreatmentDetail>(
    `/categories/${encodeURIComponent(categorySlug)}/treatments/${encodeURIComponent(treatmentSlug)}`,
  );
}
