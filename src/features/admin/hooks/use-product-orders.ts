import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { productOrdersApi } from "../api/product-orders.api";
import { runAdminAction } from "../feedback/run-admin-action";
import { adminQueryKeys } from "./query-keys";
import { useSingleFlight } from "./use-single-flight";

import type { FindProductOrdersParams } from "../types/product-orders.types";

const ORDERS_REFRESH_MS = 60 * 1000;

export function useProductOrders(params?: FindProductOrdersParams) {
  return useQuery({
    queryKey: adminQueryKeys.productOrders.list(params),
    queryFn: ({ signal }) => productOrdersApi.findMany(params, { signal }),
    placeholderData: keepPreviousData,
    refetchInterval: ORDERS_REFRESH_MS,
    refetchOnWindowFocus: true,
  });
}

export function useProductOrdersSummary() {
  return useQuery({
    queryKey: adminQueryKeys.productOrders.summary(),
    queryFn: ({ signal }) => productOrdersApi.summary({ signal }),
    refetchInterval: ORDERS_REFRESH_MS,
    refetchOnWindowFocus: true,
  });
}

export function useProductOrderActions() {
  const queryClient = useQueryClient();
  const singleFlight = useSingleFlight();
  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.productOrders.all(),
    });
  const mutation = useMutation({
    mutationKey: ["admin", "product-orders", "action"],
    mutationFn: (run: () => Promise<unknown>) => run(),
    onSettled: refresh,
  });

  return useMemo(
    () => ({
      isPending: mutation.isPending,
      verify: (id: string) =>
        singleFlight(
          `order:${id}`,
          async () =>
            (
              await runAdminAction("verifyProductPayment", () =>
                mutation.mutateAsync(() => productOrdersApi.verifyPayment(id)),
              )
            ).ok,
        ),
      reject: (id: string, reason: string) =>
        singleFlight(
          `order:${id}`,
          async () =>
            (
              await runAdminAction("rejectProductPayment", () =>
                mutation.mutateAsync(() =>
                  productOrdersApi.rejectPayment(id, reason),
                ),
              )
            ).ok,
        ),
      deliver: (id: string) =>
        singleFlight(
          `order:${id}`,
          async () =>
            (
              await runAdminAction("deliverProductOrder", () =>
                mutation.mutateAsync(() => productOrdersApi.deliver(id)),
              )
            ).ok,
        ),
      cancel: (id: string) =>
        singleFlight(
          `order:${id}`,
          async () =>
            (
              await runAdminAction("cancelProductOrder", () =>
                mutation.mutateAsync(() => productOrdersApi.cancel(id)),
              )
            ).ok,
        ),
      setTotal: (id: string, total: number) =>
        singleFlight(
          `order:${id}`,
          async () =>
            (
              await runAdminAction("setProductOrderTotal", () =>
                mutation.mutateAsync(() =>
                  productOrdersApi.setTotal(id, total),
                ),
              )
            ).ok,
        ),
    }),
    [mutation, singleFlight],
  );
}
