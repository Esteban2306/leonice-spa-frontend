import { useMemo } from "react";

import { runAdminAction } from "../feedback/run-admin-action";
import { prepareImageForUpload } from "../products/lib/prepare-image";
import {
  useCreateTestimonial,
  useRemoveTestimonial,
  useRemoveTestimonialImage,
  useReorderTestimonials,
  useUpdateTestimonial,
  useUploadTestimonialImage,
} from "./use-testimonials";
import { useSingleFlight } from "./use-single-flight";

import type {
  AdminTestimonial,
  CreateTestimonialRequest,
  TestimonialPhotoSlot,
  UpdateTestimonialRequest,
} from "../types/testimonials.types";

export interface TestimonialActions {
  create: (
    data: CreateTestimonialRequest,
    photos: Partial<Record<TestimonialPhotoSlot, File>>,
  ) => Promise<boolean>;
  update: (id: string, data: UpdateTestimonialRequest) => Promise<boolean>;
  setPublished: (id: string, isPublished: boolean) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  reorder: (ids: string[]) => Promise<boolean>;
  uploadImage: (
    id: string,
    slot: TestimonialPhotoSlot,
    file: File,
  ) => Promise<boolean>;
  removeImage: (id: string, slot: TestimonialPhotoSlot) => Promise<boolean>;
  isReordering: boolean;
}

const SLOTS: TestimonialPhotoSlot[] = ["before", "after"];

export function useTestimonialActions(): TestimonialActions {
  const singleFlight = useSingleFlight();
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const remove = useRemoveTestimonial();
  const reorder = useReorderTestimonials();
  const upload = useUploadTestimonialImage();
  const removeImage = useRemoveTestimonialImage();

  const { mutateAsync: createAsync } = create;
  const { mutateAsync: updateAsync } = update;
  const { mutateAsync: removeAsync } = remove;
  const { mutateAsync: reorderAsync } = reorder;
  const { mutateAsync: uploadAsync } = upload;
  const { mutateAsync: removeImageAsync } = removeImage;

  const actions = useMemo(() => {
    const uploadPhoto = async (
      id: string,
      slot: TestimonialPhotoSlot,
      file: File,
    ) =>
      (
        await runAdminAction("uploadTestimonialImage", async () =>
          uploadAsync({ id, slot, file: await prepareImageForUpload(file) }),
        )
      ).ok;

    return {
      create: (
        data: CreateTestimonialRequest,
        photos: Partial<Record<TestimonialPhotoSlot, File>>,
      ) =>
        singleFlight("testimonial:create", async () => {
          const outcome = await runAdminAction("createTestimonial", () =>
            createAsync(data),
          );
          if (!outcome.ok) return false;
          const created: AdminTestimonial = outcome.value;
          for (const slot of SLOTS) {
            const file = photos[slot];
            if (file) await uploadPhoto(created.id, slot, file);
          }
          return true;
        }),
      update: (id: string, data: UpdateTestimonialRequest) =>
        singleFlight(`testimonial:${id}`, async () => {
          const outcome = await runAdminAction("updateTestimonial", () =>
            updateAsync({ id, data }),
          );
          return outcome.ok;
        }),
      setPublished: (id: string, isPublished: boolean) =>
        singleFlight(`testimonial:${id}`, async () => {
          const outcome = await runAdminAction(
            isPublished ? "publishTestimonial" : "hideTestimonial",
            () => updateAsync({ id, data: { isPublished } }),
          );
          return outcome.ok;
        }),
      remove: (id: string) =>
        singleFlight(`testimonial:${id}`, async () => {
          const outcome = await runAdminAction("removeTestimonial", () =>
            removeAsync(id),
          );
          return outcome.ok;
        }),
      reorder: (ids: string[]) =>
        singleFlight("testimonial:reorder", async () => {
          const outcome = await runAdminAction("reorderTestimonials", () =>
            reorderAsync(ids),
          );
          return outcome.ok;
        }),
      uploadImage: (id: string, slot: TestimonialPhotoSlot, file: File) =>
        singleFlight(`testimonial:${id}:${slot}`, () =>
          uploadPhoto(id, slot, file),
        ),
      removeImage: (id: string, slot: TestimonialPhotoSlot) =>
        singleFlight(`testimonial:${id}:${slot}`, async () => {
          const outcome = await runAdminAction("removeTestimonialImage", () =>
            removeImageAsync({ id, slot }),
          );
          return outcome.ok;
        }),
    };
  }, [
    singleFlight,
    createAsync,
    updateAsync,
    removeAsync,
    reorderAsync,
    uploadAsync,
    removeImageAsync,
  ]);

  return { ...actions, isReordering: reorder.isPending };
}
