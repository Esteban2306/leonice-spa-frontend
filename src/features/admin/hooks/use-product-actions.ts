import { useMemo } from "react";

import { runAdminAction } from "../feedback/run-admin-action";
import {
  useAssignProductTags,
  useCreateProduct,
  useCreateProductCategory,
  useCreateProductRecommendation,
  useCreateProductTag,
  useCreateProductVariant,
  useRemoveProduct,
  useRemoveProductCategory,
  useRemoveProductRecommendation,
  useRemoveProductTag,
  useRemoveProductVariant,
  useRemoveVariantImage,
  useToggleProductActive,
  useUpdateProduct,
  useUpdateProductCategory,
  useUpdateProductTag,
  useUpdateProductVariant,
  useUploadVariantImage,
} from "./use-products";
import { useSingleFlight } from "./use-single-flight";

import type {
  AdminProduct,
  AdminProductCategory,
  CreateProductRequest,
  CreateProductVariantRequest,
  ProductTag,
  UpdateProductCategoryRequest,
  UpdateProductRequest,
  UpdateProductTagRequest,
  UpdateProductVariantRequest,
} from "../types/products.types";
import { prepareImageForUpload } from "../products/lib/prepare-image";

export interface ProductActions {
  createProduct: (data: CreateProductRequest) => Promise<AdminProduct | null>;
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<boolean>;
  setProductActive: (
    product: AdminProduct,
    isActive: boolean,
  ) => Promise<boolean>;
  removeProduct: (id: string) => Promise<boolean>;
  saveProductTags: (id: string, tagIds: string[]) => Promise<boolean>;
  createVariant: (
    productId: string,
    data: CreateProductVariantRequest,
  ) => Promise<boolean>;
  updateVariant: (
    variantId: string,
    data: UpdateProductVariantRequest,
  ) => Promise<boolean>;
  removeVariant: (variantId: string) => Promise<boolean>;
  uploadVariantImage: (variantId: string, file: File) => Promise<boolean>;
  removeVariantImage: (variantId: string) => Promise<boolean>;
  createCategory: (name: string) => Promise<AdminProductCategory | null>;
  updateCategory: (
    id: string,
    data: UpdateProductCategoryRequest,
  ) => Promise<boolean>;
  removeCategory: (id: string) => Promise<boolean>;
  createTag: (name: string) => Promise<ProductTag | null>;
  updateTag: (id: string, data: UpdateProductTagRequest) => Promise<boolean>;
  removeTag: (id: string) => Promise<boolean>;
  addRecommendation: (
    productId: string,
    treatmentId: string,
  ) => Promise<boolean>;
  removeRecommendation: (recommendationId: string) => Promise<boolean>;
  isSaving: boolean;
  uploadingVariantIds: ReadonlySet<string>;
}

export function useProductActions(): ProductActions {
  const singleFlight = useSingleFlight();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const toggleProduct = useToggleProductActive();
  const removeProduct = useRemoveProduct();
  const assignTags = useAssignProductTags();
  const createVariant = useCreateProductVariant();
  const updateVariant = useUpdateProductVariant();
  const removeVariant = useRemoveProductVariant();
  const uploadImage = useUploadVariantImage();
  const removeImage = useRemoveVariantImage();
  const createCategory = useCreateProductCategory();
  const updateCategory = useUpdateProductCategory();
  const removeCategory = useRemoveProductCategory();
  const createTag = useCreateProductTag();
  const updateTag = useUpdateProductTag();
  const removeTag = useRemoveProductTag();
  const addRecommendation = useCreateProductRecommendation();
  const removeRecommendation = useRemoveProductRecommendation();

  const { mutateAsync: createProductAsync } = createProduct;
  const { mutateAsync: updateProductAsync } = updateProduct;
  const { mutateAsync: toggleProductAsync } = toggleProduct;
  const { mutateAsync: removeProductAsync } = removeProduct;
  const { mutateAsync: assignTagsAsync } = assignTags;
  const { mutateAsync: createVariantAsync } = createVariant;
  const { mutateAsync: updateVariantAsync } = updateVariant;
  const { mutateAsync: removeVariantAsync } = removeVariant;
  const { mutateAsync: uploadImageAsync } = uploadImage;
  const { mutateAsync: removeImageAsync } = removeImage;
  const { mutateAsync: createCategoryAsync } = createCategory;
  const { mutateAsync: updateCategoryAsync } = updateCategory;
  const { mutateAsync: removeCategoryAsync } = removeCategory;
  const { mutateAsync: createTagAsync } = createTag;
  const { mutateAsync: updateTagAsync } = updateTag;
  const { mutateAsync: removeTagAsync } = removeTag;
  const { mutateAsync: addRecommendationAsync } = addRecommendation;
  const { mutateAsync: removeRecommendationAsync } = removeRecommendation;

  const actions = useMemo(
    () => ({
      createProduct: (data: CreateProductRequest) =>
        singleFlight("product:create", async () => {
          const outcome = await runAdminAction("createProduct", () =>
            createProductAsync(data),
          );
          return outcome.ok ? outcome.value : null;
        }),
      updateProduct: (id: string, data: UpdateProductRequest) =>
        singleFlight(`product:update:${id}`, async () => {
          const outcome = await runAdminAction("updateProduct", () =>
            updateProductAsync({ productId: id, data }),
          );
          return outcome.ok;
        }),
      setProductActive: (product: AdminProduct, isActive: boolean) =>
        singleFlight(`product:update:${product.id}`, async () => {
          if (product.isActive === isActive) return true;
          const outcome = await runAdminAction(
            isActive ? "activateProduct" : "deactivateProduct",
            () => toggleProductAsync(product.id),
          );
          return outcome.ok;
        }),
      removeProduct: (id: string) =>
        singleFlight(`product:remove:${id}`, async () => {
          const outcome = await runAdminAction("removeProduct", () =>
            removeProductAsync(id),
          );
          return outcome.ok;
        }),
      saveProductTags: (id: string, tagIds: string[]) =>
        singleFlight(`product:tags:${id}`, async () => {
          const outcome = await runAdminAction("saveProductTags", () =>
            assignTagsAsync({ productId: id, tagIds }),
          );
          return outcome.ok;
        }),
      createVariant: (productId: string, data: CreateProductVariantRequest) =>
        singleFlight(`variant:create:${productId}`, async () => {
          const outcome = await runAdminAction("createProductVariant", () =>
            createVariantAsync({ productId, data }),
          );
          return outcome.ok;
        }),
      updateVariant: (variantId: string, data: UpdateProductVariantRequest) =>
        singleFlight(`variant:update:${variantId}`, async () => {
          const outcome = await runAdminAction("updateProductVariant", () =>
            updateVariantAsync({ variantId, data }),
          );
          return outcome.ok;
        }),
      removeVariant: (variantId: string) =>
        singleFlight(`variant:remove:${variantId}`, async () => {
          const outcome = await runAdminAction("removeProductVariant", () =>
            removeVariantAsync(variantId),
          );
          return outcome.ok;
        }),
      uploadVariantImage: (variantId: string, file: File) =>
        singleFlight(`variant:image:${variantId}`, async () => {
          const outcome = await runAdminAction("uploadVariantImage", async () =>
            uploadImageAsync({
              variantId,
              file: await prepareImageForUpload(file),
            }),
          );
          return outcome.ok;
        }),
      removeVariantImage: (variantId: string) =>
        singleFlight(`variant:image:${variantId}`, async () => {
          const outcome = await runAdminAction("removeVariantImage", () =>
            removeImageAsync(variantId),
          );
          return outcome.ok;
        }),
      createCategory: (name: string) =>
        singleFlight("product-category:create", async () => {
          const outcome = await runAdminAction("createProductCategory", () =>
            createCategoryAsync({ name }),
          );
          return outcome.ok ? outcome.value : null;
        }),
      updateCategory: (id: string, data: UpdateProductCategoryRequest) =>
        singleFlight(`product-category:update:${id}`, async () => {
          const outcome = await runAdminAction("updateProductCategory", () =>
            updateCategoryAsync({ categoryId: id, data }),
          );
          return outcome.ok;
        }),
      removeCategory: (id: string) =>
        singleFlight(`product-category:remove:${id}`, async () => {
          const outcome = await runAdminAction("removeProductCategory", () =>
            removeCategoryAsync(id),
          );
          return outcome.ok;
        }),
      createTag: (name: string) =>
        singleFlight("product-tag:create", async () => {
          const outcome = await runAdminAction("createProductTag", () =>
            createTagAsync({ name }),
          );
          return outcome.ok ? outcome.value : null;
        }),
      updateTag: (id: string, data: UpdateProductTagRequest) =>
        singleFlight(`product-tag:update:${id}`, async () => {
          const outcome = await runAdminAction("updateProductTag", () =>
            updateTagAsync({ tagId: id, data }),
          );
          return outcome.ok;
        }),
      removeTag: (id: string) =>
        singleFlight(`product-tag:remove:${id}`, async () => {
          const outcome = await runAdminAction("removeProductTag", () =>
            removeTagAsync(id),
          );
          return outcome.ok;
        }),
      addRecommendation: (productId: string, treatmentId: string) =>
        singleFlight(`recommendation:create:${productId}`, async () => {
          const outcome = await runAdminAction(
            "createProductRecommendation",
            () => addRecommendationAsync({ productId, treatmentId }),
          );
          return outcome.ok;
        }),
      removeRecommendation: (recommendationId: string) =>
        singleFlight(`recommendation:remove:${recommendationId}`, async () => {
          const outcome = await runAdminAction(
            "removeProductRecommendation",
            () => removeRecommendationAsync(recommendationId),
          );
          return outcome.ok;
        }),
    }),
    [
      singleFlight,
      createProductAsync,
      updateProductAsync,
      toggleProductAsync,
      removeProductAsync,
      assignTagsAsync,
      createVariantAsync,
      updateVariantAsync,
      removeVariantAsync,
      uploadImageAsync,
      removeImageAsync,
      createCategoryAsync,
      updateCategoryAsync,
      removeCategoryAsync,
      createTagAsync,
      updateTagAsync,
      removeTagAsync,
      addRecommendationAsync,
      removeRecommendationAsync,
    ],
  );

  const pendingUploads = uploadImage.isPending ? uploadImage.variables : null;
  const uploadingVariantIds = useMemo(
    () => new Set(pendingUploads ? [pendingUploads.variantId] : []),
    [pendingUploads],
  );

  const isSaving = [
    createProduct,
    updateProduct,
    toggleProduct,
    removeProduct,
    assignTags,
    createVariant,
    updateVariant,
    removeVariant,
    removeImage,
    createCategory,
    updateCategory,
    removeCategory,
    createTag,
    updateTag,
    removeTag,
    addRecommendation,
    removeRecommendation,
  ].some((mutation) => mutation.isPending);

  return { ...actions, isSaving, uploadingVariantIds };
}
