import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { promoEventsApi } from "../api/promo-events.api";
import { runAdminAction } from "../feedback/run-admin-action";
import { adminQueryKeys } from "./query-keys";
import { useSingleFlight } from "./use-single-flight";

import type {
  DrawResult,
  SavePromoEventRequest,
  UpdatePromoEventRequest,
} from "../types/promo-events.types";

const EVENTS_STALE_TIME = 60 * 1000;

export function usePromoEvents() {
  return useQuery({
    queryKey: adminQueryKeys.promoEvents.list(),
    queryFn: ({ signal }) => promoEventsApi.findAll({ signal }),
    staleTime: EVENTS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useEventTickets(eventId: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.promoEvents.tickets(eventId ?? ""),
    queryFn: ({ signal }) => promoEventsApi.tickets(eventId ?? "", { signal }),
    enabled: eventId !== null,
    staleTime: EVENTS_STALE_TIME,
  });
}

export interface PromoEventActions {
  create: (data: SavePromoEventRequest) => Promise<boolean>;
  update: (id: string, data: UpdatePromoEventRequest) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  draw: (id: string, prize: string) => Promise<DrawResult | null>;
}

export function usePromoEventActions(): PromoEventActions {
  const queryClient = useQueryClient();
  const singleFlight = useSingleFlight();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: adminQueryKeys.promoEvents.all(),
    });

  const { mutateAsync: createAsync } = useMutation({
    mutationFn: (data: SavePromoEventRequest) => promoEventsApi.create(data),
    onSuccess: invalidate,
  });
  const { mutateAsync: updateAsync } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromoEventRequest }) =>
      promoEventsApi.update(id, data),
    onSuccess: invalidate,
  });
  const { mutateAsync: removeAsync } = useMutation({
    mutationFn: (id: string) => promoEventsApi.remove(id),
    onSuccess: invalidate,
  });
  const { mutateAsync: drawAsync } = useMutation({
    mutationFn: ({ id, prize }: { id: string; prize: string }) =>
      promoEventsApi.draw(id, prize),
    onSuccess: invalidate,
  });

  return useMemo(
    () => ({
      create: (data) =>
        singleFlight("promo-event:create", async () => {
          const outcome = await runAdminAction("createPromoEvent", () =>
            createAsync(data),
          );
          return outcome.ok;
        }),
      update: (id, data) =>
        singleFlight(`promo-event:update:${id}`, async () => {
          const outcome = await runAdminAction("updatePromoEvent", () =>
            updateAsync({ id, data }),
          );
          return outcome.ok;
        }),
      remove: (id) =>
        singleFlight(`promo-event:remove:${id}`, async () => {
          const outcome = await runAdminAction("removePromoEvent", () =>
            removeAsync(id),
          );
          return outcome.ok;
        }),
      draw: (id, prize) =>
        singleFlight(`promo-event:draw:${id}`, async () => {
          const outcome = await runAdminAction(
            "drawPromoEvent",
            () => drawAsync({ id, prize }),
            (winner) => `Boleta #${winner.number}: ${winner.client.name}`,
          );
          return outcome.ok ? outcome.value : null;
        }),
    }),
    [singleFlight, createAsync, updateAsync, removeAsync, drawAsync],
  );
}
