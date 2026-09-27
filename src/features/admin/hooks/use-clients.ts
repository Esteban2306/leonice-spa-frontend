import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { clientsApi } from "../api/clients.api";
import { adminQueryKeys } from "./query-keys";

import type {
  FindClientsParams,
  ResolveClientRequest,
  UpdateClientRequest,
} from "../types/clients.types";

const CLIENTS_STALE_TIME = 2 * 60 * 1000;

export function useClients(params: FindClientsParams) {
  return useQuery({
    queryKey: adminQueryKeys.clients.list(params),
    queryFn: () => clientsApi.search(params),
    enabled: Boolean(params.q && params.q.trim().length >= 2),
    staleTime: CLIENTS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
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
    refetchOnMount: false,
  });
}

export function useResolveClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "clients", "resolve"],
    mutationFn: (data: ResolveClientRequest) => clientsApi.resolve(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.clients.lists(),
      });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "clients", "update"],
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: UpdateClientRequest;
    }) => clientsApi.update(clientId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.clients.detail(variables.clientId),
      });

      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.clients.lists(),
      });
    },
  });
}
