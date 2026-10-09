import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { clientsApi } from "../api/clients.api";
import { invalidateReservationDomain } from "./invalidate-reservation-domain";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateClientRequest,
  FindClientsParams,
  RecordConsentRequest,
  ResolveClientRequest,
  SetHairProfileRequest,
  UpdateClientRequest,
} from "../types/clients.types";

const CLIENTS_STALE_TIME = 60 * 1000;

export function useClients(
  params: FindClientsParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: adminQueryKeys.clients.list(params),
    queryFn: () => clientsApi.search(params),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
    staleTime: CLIENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useClient(clientId: string) {
  return useQuery({
    queryKey: adminQueryKeys.clients.detail(clientId),
    queryFn: () => clientsApi.findOne(clientId),
    enabled: Boolean(clientId),
    staleTime: CLIENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

function useInvalidateClient() {
  const queryClient = useQueryClient();

  return (clientId?: string) =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.clients.lists(),
      }),
      clientId
        ? queryClient.invalidateQueries({
            queryKey: adminQueryKeys.clients.detail(clientId),
          })
        : Promise.resolve(),
    ]);
}

export function useResolveClient() {
  const invalidate = useInvalidateClient();

  return useMutation({
    mutationKey: ["admin", "clients", "resolve"],
    mutationFn: (data: ResolveClientRequest) => clientsApi.resolve(data),
    onSuccess: () => invalidate(),
  });
}

export function useCreateClient() {
  const invalidate = useInvalidateClient();

  return useMutation({
    mutationKey: ["admin", "clients", "create"],
    mutationFn: (data: CreateClientRequest) => clientsApi.create(data),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateClient() {
  const invalidate = useInvalidateClient();

  return useMutation({
    mutationKey: ["admin", "clients", "update"],
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: UpdateClientRequest;
    }) => clientsApi.update(clientId, data),
    onSuccess: (_data, variables) => invalidate(variables.clientId),
  });
}

export function useSetHairProfile() {
  const invalidate = useInvalidateClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "clients", "hair-profile"],
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: SetHairProfileRequest;
    }) => clientsApi.setHairProfile(clientId, data),
    onSuccess: (_data, variables) =>
      Promise.all([
        invalidate(variables.clientId),
        invalidateReservationDomain(queryClient),
      ]),
  });
}

export function useConfirmHairProfile() {
  const invalidate = useInvalidateClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "clients", "hair-profile-confirm"],
    mutationFn: (clientId: string) => clientsApi.confirmHairProfile(clientId),
    onSuccess: (_data, clientId) =>
      Promise.all([
        invalidate(clientId),
        invalidateReservationDomain(queryClient),
      ]),
  });
}

export function useRecordConsent() {
  const invalidate = useInvalidateClient();

  return useMutation({
    mutationKey: ["admin", "clients", "consent"],
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: RecordConsentRequest;
    }) => clientsApi.recordConsent(clientId, data),
    onSuccess: (_data, variables) => invalidate(variables.clientId),
  });
}

const PENDING_HAIR_PROFILES_STALE_TIME = 60 * 1000;

export function usePendingHairProfiles(params: {
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: adminQueryKeys.clients.pendingHairProfiles(params),
    queryFn: () => clientsApi.findPendingHairProfiles(params),
    placeholderData: keepPreviousData,
    staleTime: PENDING_HAIR_PROFILES_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}
