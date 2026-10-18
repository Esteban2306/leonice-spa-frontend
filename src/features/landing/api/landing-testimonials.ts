import {
  storiesContent,
  type StoryItem,
} from "@/src/features/landing/content/landing-content";
import { allowedImageUrl } from "@/src/features/landing/lib/allowed-image";

interface ApiTestimonial {
  id: string;
  authorName: string;
  quote: string;
  treatmentName: string;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
}

const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 4000;

function isApiTestimonial(value: unknown): value is ApiTestimonial {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.authorName === "string" &&
    typeof item.quote === "string" &&
    typeof item.treatmentName === "string"
  );
}

export function toStory(item: ApiTestimonial): StoryItem {
  return {
    id: item.id,
    title: item.treatmentName,
    quote: item.quote,
    author: item.authorName,
    treatment: item.treatmentName,
    before: allowedImageUrl(item.beforeImageUrl),
    after: allowedImageUrl(item.afterImageUrl),
    sample: false,
  };
}

export async function getLandingStories(): Promise<StoryItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return storiesContent.items;

  try {
    const response = await fetch(`${apiUrl}/testimonials`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return storiesContent.items;
    const payload: unknown = await response.json();
    const list = Array.isArray(payload) ? payload.filter(isApiTestimonial) : [];
    return list.length > 0 ? list.map(toStory) : storiesContent.items;
  } catch {
    return storiesContent.items;
  }
}
