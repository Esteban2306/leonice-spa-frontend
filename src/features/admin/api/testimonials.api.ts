import { httpClient } from "@/src/lib/api/client";

import type {
  AdminTestimonial,
  CreateTestimonialRequest,
  TestimonialPhotoSlot,
  UpdateTestimonialRequest,
} from "../types/testimonials.types";

export const testimonialsApi = {
  findAll() {
    return httpClient.request<AdminTestimonial[]>("/testimonials/admin", "GET");
  },

  create(data: CreateTestimonialRequest) {
    return httpClient.request<AdminTestimonial>("/testimonials", "POST", data);
  },

  update(id: string, data: UpdateTestimonialRequest) {
    return httpClient.request<AdminTestimonial>(
      `/testimonials/${id}`,
      "PATCH",
      data,
    );
  },

  remove(id: string) {
    return httpClient.request<null>(`/testimonials/${id}`, "DELETE");
  },

  reorder(ids: string[]) {
    return httpClient.request<AdminTestimonial[]>(
      "/testimonials/reorder",
      "POST",
      { ids },
    );
  },

  uploadImage(id: string, slot: TestimonialPhotoSlot, file: File) {
    const form = new FormData();
    form.append("image", file);
    return httpClient.request<AdminTestimonial>(
      `/testimonials/${id}/images/${slot}`,
      "POST",
      form,
    );
  },

  removeImage(id: string, slot: TestimonialPhotoSlot) {
    return httpClient.request<AdminTestimonial>(
      `/testimonials/${id}/images/${slot}`,
      "DELETE",
    );
  },
};
