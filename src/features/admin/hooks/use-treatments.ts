import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { treatmentsApi } from "../api/treatment.api";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateTreatmentRequest,
  FindTreatmentsParams,
  SetHairColorSurchargesRequest,
  SetHairLengthPricingRequest,
  UpdateTreatmentRequest,
} from "../types/treatments.types";

const TREATMENTS_STALE_TIME = 5 * 60 * 1000;

export function useTreatments(params?: FindTreatmentsParams) {
  return useQuery({
    queryKey: adminQueryKeys.treatments.list(params),
    queryFn: () => treatmentsApi.findMany(params),
    staleTime: TREATMENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useTreatment(treatmentId: string) {
  return useQuery({
    queryKey: adminQueryKeys.treatments.detail(treatmentId),
    queryFn: () => treatmentsApi.findOne(treatmentId),
    enabled: Boolean(treatmentId),
    staleTime: TREATMENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useTreatmentHairLengthPricing(treatmentId: string) {
  return useQuery({
    queryKey: adminQueryKeys.treatments.hairLengthPricing(treatmentId),
    queryFn: () => treatmentsApi.getHairLengthPricing(treatmentId),
    enabled: Boolean(treatmentId),
    staleTime: TREATMENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useTreatmentHairColorSurcharges(treatmentId: string) {
  return useQuery({
    queryKey: adminQueryKeys.treatments.hairColorSurcharges(treatmentId),
    queryFn: () => treatmentsApi.getHairColorSurcharges(treatmentId),
    enabled: Boolean(treatmentId),
    staleTime: TREATMENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useTreatmentHairPricingMatrix(treatmentId: string) {
  return useQuery({
    queryKey: adminQueryKeys.treatments.hairPricingMatrix(treatmentId),
    queryFn: () => treatmentsApi.getHairPricingMatrix(treatmentId),
    enabled: Boolean(treatmentId),
    staleTime: TREATMENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useCreateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "treatments", "create"],
    mutationFn: (data: CreateTreatmentRequest) => treatmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.lists(),
      });
    },
  });
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "treatments", "update"],
    mutationFn: ({
      treatmentId,
      data,
    }: {
      treatmentId: string;
      data: UpdateTreatmentRequest;
    }) => treatmentsApi.update(treatmentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.detail(variables.treatmentId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.lists(),
      });
    },
  });
}

export function useSetTreatmentHairLengthPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "treatments", "set-hair-length-pricing"],
    mutationFn: ({
      treatmentId,
      data,
    }: {
      treatmentId: string;
      data: SetHairLengthPricingRequest;
    }) => treatmentsApi.setHairLengthPricing(treatmentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.hairLengthPricing(
          variables.treatmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.hairPricingMatrix(
          variables.treatmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.detail(variables.treatmentId),
      });
    },
  });
}

export function useSetTreatmentHairColorSurcharges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "treatments", "set-hair-color-surcharges"],
    mutationFn: ({
      treatmentId,
      data,
    }: {
      treatmentId: string;
      data: SetHairColorSurchargesRequest;
    }) => treatmentsApi.setHairColorSurcharges(treatmentId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.hairColorSurcharges(
          variables.treatmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.hairPricingMatrix(
          variables.treatmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.treatments.detail(variables.treatmentId),
      });
    },
  });
}
