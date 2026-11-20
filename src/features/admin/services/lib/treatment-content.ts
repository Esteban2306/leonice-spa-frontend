import type {
  Treatment,
  TreatmentContent,
} from "@/src/features/admin/types/treatments.types";

import { linesToList, listToLines } from "../../products/lib/ritual-catalog";

export interface TreatmentContentDraft {
  tagline: string;
  summary: string;
  idealFor: string;
  benefits: string;
  results: string;
  aftercare: string;
  considerations: string;
  recommendedFrequency: string;
}

export function contentDraftFrom(treatment: Treatment): TreatmentContentDraft {
  return {
    tagline: treatment.tagline ?? "",
    summary: treatment.summary ?? "",
    idealFor: listToLines(treatment.idealFor ?? []),
    benefits: listToLines(treatment.benefits ?? []),
    results: treatment.results ?? "",
    aftercare: listToLines(treatment.aftercare ?? []),
    considerations: listToLines(treatment.considerations ?? []),
    recommendedFrequency: treatment.recommendedFrequency ?? "",
  };
}

export function contentFromDraft(
  draft: TreatmentContentDraft,
): TreatmentContent {
  return {
    tagline: draft.tagline.trim() || null,
    summary: draft.summary.trim() || null,
    idealFor: linesToList(draft.idealFor),
    benefits: linesToList(draft.benefits),
    results: draft.results.trim() || null,
    aftercare: linesToList(draft.aftercare),
    considerations: linesToList(draft.considerations),
    recommendedFrequency: draft.recommendedFrequency.trim() || null,
  };
}

export const CONTENT_LIST_MAX_ITEMS = 12;

export function contentListTooLong(draft: TreatmentContentDraft): boolean {
  return (
    ["idealFor", "benefits", "aftercare", "considerations"] as const
  ).some((key) => linesToList(draft[key]).length > CONTENT_LIST_MAX_ITEMS);
}
