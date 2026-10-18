export type TestimonialPhotoSlot = "before" | "after";

export interface AdminTestimonial {
  id: string;
  authorName: string;
  quote: string;
  treatmentName: string;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
  consentConfirmedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialRequest {
  authorName: string;
  quote: string;
  treatmentName: string;
  isPublished?: boolean;
  consentConfirmed: true;
}

export interface UpdateTestimonialRequest {
  authorName?: string;
  quote?: string;
  treatmentName?: string;
  isPublished?: boolean;
}
