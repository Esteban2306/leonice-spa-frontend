import { useMemo } from "react";

import { runAdminAction } from "../feedback/run-admin-action";
import {
  useCreateCapacityPool,
  useUpdateCapacityPool,
} from "./use-capacity-pools";
import { useCreateCategory, useUpdateCategory } from "./use-categories";
import {
  useCreatePromotion,
  useDeactivatePromotion,
  useUpdatePromotion,
} from "./use-promotions";
import { useSingleFlight } from "./use-single-flight";
import {
  useCreateTreatment,
  useRemoveTreatmentVideo,
  useSetTreatmentHairColorSurcharges,
  useSetTreatmentHairLengthPricing,
  useUpdateTreatment,
  useUploadTreatmentVideo,
} from "./use-treatments";

import type {
  CreateCapacityPoolRequest,
  UpdateCapacityPoolRequest,
} from "../types/capacity-pools.types";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/categories.types";
import type {
  CreatePromotionRequest,
  UpdatePromotionRequest,
} from "../types/promotions.types";
import type {
  CreateTreatmentRequest,
  SetHairColorSurchargesRequest,
  SetHairLengthPricingRequest,
  Treatment,
  UpdateTreatmentRequest,
} from "../types/treatments.types";

export interface HairPricingInput {
  enableVariablePricing: boolean;
  lengths: SetHairLengthPricingRequest["entries"];
  colors: SetHairColorSurchargesRequest["entries"];
}

export interface CatalogActions {
  createCategory: (data: CreateCategoryRequest) => Promise<boolean>;
  updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<boolean>;
  setCategoryActive: (id: string, isActive: boolean) => Promise<boolean>;
  createTreatment: (data: CreateTreatmentRequest) => Promise<Treatment | null>;
  updateTreatment: (
    id: string,
    data: UpdateTreatmentRequest,
  ) => Promise<boolean>;
  setTreatmentActive: (id: string, isActive: boolean) => Promise<boolean>;
  saveHairPricing: (id: string, input: HairPricingInput) => Promise<boolean>;
  uploadTreatmentVideo: (id: string, file: File) => Promise<boolean>;
  removeTreatmentVideo: (id: string) => Promise<boolean>;
  isVideoUploading: boolean;
  createCapacityPool: (data: CreateCapacityPoolRequest) => Promise<boolean>;
  updateCapacityPool: (
    id: string,
    data: UpdateCapacityPoolRequest,
  ) => Promise<boolean>;
  setCapacityPoolActive: (id: string, isActive: boolean) => Promise<boolean>;
  createPromotion: (data: CreatePromotionRequest) => Promise<boolean>;
  updatePromotion: (
    id: string,
    data: UpdatePromotionRequest,
  ) => Promise<boolean>;
  deactivatePromotion: (id: string) => Promise<boolean>;
  isSaving: boolean;
}

export function useCatalogActions(): CatalogActions {
  const singleFlight = useSingleFlight();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const createTreatment = useCreateTreatment();
  const updateTreatment = useUpdateTreatment();
  const setLengths = useSetTreatmentHairLengthPricing();
  const setColors = useSetTreatmentHairColorSurcharges();
  const uploadVideo = useUploadTreatmentVideo();
  const removeVideo = useRemoveTreatmentVideo();
  const createPool = useCreateCapacityPool();
  const updatePool = useUpdateCapacityPool();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deactivatePromotion = useDeactivatePromotion();

  const { mutateAsync: createCategoryAsync } = createCategory;
  const { mutateAsync: updateCategoryAsync } = updateCategory;
  const { mutateAsync: createTreatmentAsync } = createTreatment;
  const { mutateAsync: updateTreatmentAsync } = updateTreatment;
  const { mutateAsync: setLengthsAsync } = setLengths;
  const { mutateAsync: setColorsAsync } = setColors;
  const { mutateAsync: uploadVideoAsync } = uploadVideo;
  const { mutateAsync: removeVideoAsync } = removeVideo;
  const { mutateAsync: createPoolAsync } = createPool;
  const { mutateAsync: updatePoolAsync } = updatePool;
  const { mutateAsync: createPromotionAsync } = createPromotion;
  const { mutateAsync: updatePromotionAsync } = updatePromotion;
  const { mutateAsync: deactivatePromotionAsync } = deactivatePromotion;

  const actions = useMemo(
    () => ({
      createCategory: (data: CreateCategoryRequest) =>
        singleFlight("category:create", async () => {
          const outcome = await runAdminAction("createCategory", () =>
            createCategoryAsync(data),
          );
          return outcome.ok;
        }),
      updateCategory: (id: string, data: UpdateCategoryRequest) =>
        singleFlight(`category:update:${id}`, async () => {
          const outcome = await runAdminAction("updateCategory", () =>
            updateCategoryAsync({ categoryId: id, data }),
          );
          return outcome.ok;
        }),
      setCategoryActive: (id: string, isActive: boolean) =>
        singleFlight(`category:update:${id}`, async () => {
          const outcome = await runAdminAction(
            isActive ? "activateCategory" : "deactivateCategory",
            () => updateCategoryAsync({ categoryId: id, data: { isActive } }),
          );
          return outcome.ok;
        }),
      createTreatment: (data: CreateTreatmentRequest) =>
        singleFlight("treatment:create", async () => {
          const outcome = await runAdminAction("createTreatment", () =>
            createTreatmentAsync(data),
          );
          return outcome.ok ? outcome.value : null;
        }),
      updateTreatment: (id: string, data: UpdateTreatmentRequest) =>
        singleFlight(`treatment:update:${id}`, async () => {
          const outcome = await runAdminAction("updateTreatment", () =>
            updateTreatmentAsync({ treatmentId: id, data }),
          );
          return outcome.ok;
        }),
      setTreatmentActive: (id: string, isActive: boolean) =>
        singleFlight(`treatment:update:${id}`, async () => {
          const outcome = await runAdminAction(
            isActive ? "activateTreatment" : "deactivateTreatment",
            () => updateTreatmentAsync({ treatmentId: id, data: { isActive } }),
          );
          return outcome.ok;
        }),
      saveHairPricing: (id: string, input: HairPricingInput) =>
        singleFlight(`treatment:hair-pricing:${id}`, async () => {
          const outcome = await runAdminAction("saveHairPricing", async () => {
            if (input.enableVariablePricing) {
              await updateTreatmentAsync({
                treatmentId: id,
                data: { hasHairVariablePricing: true },
              });
            }
            await setLengthsAsync({
              treatmentId: id,
              data: { entries: input.lengths },
            });
            await setColorsAsync({
              treatmentId: id,
              data: { entries: input.colors },
            });
          });
          return outcome.ok;
        }),
      uploadTreatmentVideo: (id: string, file: File) =>
        singleFlight(`treatment:video:${id}`, async () => {
          const outcome = await runAdminAction("uploadTreatmentVideo", () =>
            uploadVideoAsync({ treatmentId: id, file }),
          );
          return outcome.ok;
        }),
      removeTreatmentVideo: (id: string) =>
        singleFlight(`treatment:video:${id}`, async () => {
          const outcome = await runAdminAction("removeTreatmentVideo", () =>
            removeVideoAsync(id),
          );
          return outcome.ok;
        }),
      createCapacityPool: (data: CreateCapacityPoolRequest) =>
        singleFlight(`pool:create:${data.categoryId}`, async () => {
          const outcome = await runAdminAction("createCapacityPool", () =>
            createPoolAsync(data),
          );
          return outcome.ok;
        }),
      updateCapacityPool: (id: string, data: UpdateCapacityPoolRequest) =>
        singleFlight(`pool:update:${id}`, async () => {
          const outcome = await runAdminAction("updateCapacityPool", () =>
            updatePoolAsync({ poolId: id, data }),
          );
          return outcome.ok;
        }),
      setCapacityPoolActive: (id: string, isActive: boolean) =>
        singleFlight(`pool:update:${id}`, async () => {
          const outcome = await runAdminAction(
            isActive ? "activateCapacityPool" : "deactivateCapacityPool",
            () => updatePoolAsync({ poolId: id, data: { isActive } }),
          );
          return outcome.ok;
        }),
      createPromotion: (data: CreatePromotionRequest) =>
        singleFlight("promotion:create", async () => {
          const outcome = await runAdminAction("createPromotion", () =>
            createPromotionAsync(data),
          );
          return outcome.ok;
        }),
      updatePromotion: (id: string, data: UpdatePromotionRequest) =>
        singleFlight(`promotion:update:${id}`, async () => {
          const outcome = await runAdminAction("updatePromotion", () =>
            updatePromotionAsync({ promotionId: id, data }),
          );
          return outcome.ok;
        }),
      deactivatePromotion: (id: string) =>
        singleFlight(`promotion:update:${id}`, async () => {
          const outcome = await runAdminAction("deactivatePromotion", () =>
            deactivatePromotionAsync(id),
          );
          return outcome.ok;
        }),
    }),
    [
      singleFlight,
      createCategoryAsync,
      updateCategoryAsync,
      createTreatmentAsync,
      updateTreatmentAsync,
      setLengthsAsync,
      setColorsAsync,
      uploadVideoAsync,
      removeVideoAsync,
      createPoolAsync,
      updatePoolAsync,
      createPromotionAsync,
      updatePromotionAsync,
      deactivatePromotionAsync,
    ],
  );

  return {
    ...actions,
    isVideoUploading: uploadVideo.isPending || removeVideo.isPending,
    isSaving:
      createCategory.isPending ||
      updateCategory.isPending ||
      createTreatment.isPending ||
      updateTreatment.isPending ||
      setLengths.isPending ||
      setColors.isPending ||
      createPool.isPending ||
      updatePool.isPending ||
      createPromotion.isPending ||
      updatePromotion.isPending ||
      deactivatePromotion.isPending,
  };
}
