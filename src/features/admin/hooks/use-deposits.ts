import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { depositsApi } from "../api/deposits.api";
import { invalidateReservationDomain } from "./invalidate-reservation-domain";
import { adminQueryKeys } from "./query-keys";

import type {
  ApproveDepositRequest,
  FindDepositsParams,
  FindPendingDepositsParams,
  RejectDepositRequest,
  SubmitAutomaticDepositRequest,
} from "../types/deposits.types";

import type { SubmitDepositProofData } from "../api/deposits.api";

const DEPOSITS_STALE_TIME = 15 * 1000;

export function useDeposits(params?: FindDepositsParams) {
  return useQuery({
    queryKey: adminQueryKeys.deposits.list(params),
    queryFn: () => depositsApi.findMany(params),
    staleTime: DEPOSITS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}

export function usePendingDeposits(params: FindPendingDepositsParams) {
  return useQuery({
    queryKey: adminQueryKeys.deposits.pending(params),
    queryFn: () => depositsApi.findPending(params),
    enabled: Boolean(params.phone),
    staleTime: DEPOSITS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}

export function useClientCredits(clientId: string) {
  return useQuery({
    queryKey: adminQueryKeys.deposits.credits(clientId),
    queryFn: () => depositsApi.findClientCredits(clientId),
    enabled: Boolean(clientId),
    staleTime: DEPOSITS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useReservationDeposits(reservationId: string) {
  return useQuery({
    queryKey: adminQueryKeys.deposits.byReservation(reservationId),
    queryFn: () => depositsApi.findByReservation(reservationId),
    enabled: Boolean(reservationId),
    staleTime: DEPOSITS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}

export function useSubmitDepositProof() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "deposits", "submit-proof"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: SubmitDepositProofData;
    }) => depositsApi.submitProof(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useSubmitAutomaticDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "deposits", "submit-automatic"],
    mutationFn: (data: SubmitAutomaticDepositRequest) =>
      depositsApi.submitAutomatic(data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useSubmitAutomaticDepositForReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "deposits", "submit-automatic-reservation"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: SubmitAutomaticDepositRequest;
    }) => depositsApi.submitAutomaticForReservation(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useApproveDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "deposits", "approve"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: ApproveDepositRequest;
    }) => depositsApi.approve(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}

export function useRejectDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "deposits", "reject"],
    mutationFn: ({
      reservationId,
      data,
    }: {
      reservationId: string;
      data: RejectDepositRequest;
    }) => depositsApi.reject(reservationId, data),
    onSuccess: () => invalidateReservationDomain(queryClient),
  });
}
