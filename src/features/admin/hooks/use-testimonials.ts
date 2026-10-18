import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { testimonialsApi } from "../api/testimonials.api";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateTestimonialRequest,
  TestimonialPhotoSlot,
  UpdateTestimonialRequest,
} from "../types/testimonials.types";

const TESTIMONIALS_STALE_TIME = 5 * 60 * 1000;

export function useAdminTestimonials() {
  return useQuery({
    queryKey: adminQueryKeys.testimonials.list(),
    queryFn: () => testimonialsApi.findAll(),
    staleTime: TESTIMONIALS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

function useTestimonialsMutation<TVariables, TResult>(
  name: string,
  mutationFn: (variables: TVariables) => Promise<TResult>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "testimonials", name],
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.testimonials.all(),
      }),
  });
}

export function useCreateTestimonial() {
  return useTestimonialsMutation("create", (data: CreateTestimonialRequest) =>
    testimonialsApi.create(data),
  );
}

export function useUpdateTestimonial() {
  return useTestimonialsMutation(
    "update",
    ({ id, data }: { id: string; data: UpdateTestimonialRequest }) =>
      testimonialsApi.update(id, data),
  );
}

export function useRemoveTestimonial() {
  return useTestimonialsMutation("remove", (id: string) =>
    testimonialsApi.remove(id),
  );
}

export function useReorderTestimonials() {
  return useTestimonialsMutation("reorder", (ids: string[]) =>
    testimonialsApi.reorder(ids),
  );
}

export function useUploadTestimonialImage() {
  return useTestimonialsMutation(
    "upload-image",
    ({
      id,
      slot,
      file,
    }: {
      id: string;
      slot: TestimonialPhotoSlot;
      file: File;
    }) => testimonialsApi.uploadImage(id, slot, file),
  );
}

export function useRemoveTestimonialImage() {
  return useTestimonialsMutation(
    "remove-image",
    ({ id, slot }: { id: string; slot: TestimonialPhotoSlot }) =>
      testimonialsApi.removeImage(id, slot),
  );
}
