export interface ShowcasePrice {
  fromThousands: number | null;
  toThousands: number | null;
  promotion: {
    name: string;
    discountPercentage: number;
    fromThousands: number | null;
    toThousands: number | null;
  } | null;
}

export interface ShowcaseTreatmentCard {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  tagline: string | null;
  summary: string | null;
  requiresPriorAssessment: boolean;
  price: ShowcasePrice;
  durationMinMinutes: number | null;
  durationMaxMinutes: number | null;
  videoUrl: string | null;
  posterUrl: string | null;
  benefits: string[];
  stepCount: number;
  contentNeedsReview: boolean;
}

export interface ShowcaseStep {
  position: number;
  title: string;
  description: string;
  durationMinutes: number | null;
}

export interface ShowcaseCategorySummary {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  iconKey: string | null;
  treatmentCount: number;
  priceFromThousands: number | null;
  durationMinMinutes: number | null;
  durationMaxMinutes: number | null;
  posterUrl: string | null;
  hasPromotion: boolean;
}

export interface ShowcaseCategoryDetail extends ShowcaseCategorySummary {
  treatments: ShowcaseTreatmentCard[];
}

export interface ShowcaseTreatmentDetail extends ShowcaseTreatmentCard {
  idealFor: string[];
  results: string | null;
  aftercare: string[];
  considerations: string[];
  recommendedFrequency: string | null;
  steps: ShowcaseStep[];
  category: ShowcaseCategorySummary;
  related: ShowcaseTreatmentCard[];
  recommendedProducts: {
    slug: string;
    name: string;
    tagline: string | null;
    priceFromPesos: number | null;
    imageUrl: string | null;
  }[];
}
