import { useMemo } from "react";

import { runAdminAction } from "../feedback/run-admin-action";
import {
  useAdminRescheduleReservation,
  useCreateReservation,
} from "./use-reservations";

import type { CreatedReservations } from "../types/reservations.types";

export interface CreateBookingInput {
  treatmentIds: string[];
  scheduledStart: string;
  client: { phone: string; name?: string; birthDate?: string };
}

export interface RescheduleBookingInput {
  reservationId: string;
  newScheduledStart: string;
  notifyClient: boolean;
}

export interface BookingActions {
  create: (input: CreateBookingInput) => Promise<CreatedReservations | null>;
  reschedule: (input: RescheduleBookingInput) => Promise<boolean>;
  isSubmitting: boolean;
}

export function useBookingActions(): BookingActions {
  const create = useCreateReservation();
  const reschedule = useAdminRescheduleReservation();
  const { mutateAsync: createAsync } = create;
  const { mutateAsync: rescheduleAsync } = reschedule;

  const actions = useMemo(
    () => ({
      create: async (input: CreateBookingInput) => {
        const outcome = await runAdminAction(
          "createReservation",
          () =>
            createAsync({
              client: input.client,
              treatments: input.treatmentIds,
              scheduledStart: input.scheduledStart,
              channel: "WEB",
            }) as Promise<CreatedReservations>,
          (created) => created.summary,
        );
        return outcome.ok ? outcome.value : null;
      },
      reschedule: async (input: RescheduleBookingInput) =>
        (
          await runAdminAction(
            "rescheduleReservation",
            () =>
              rescheduleAsync({
                reservationId: input.reservationId,
                data: {
                  newScheduledStart: input.newScheduledStart,
                  notifyClient: input.notifyClient,
                },
              }),
            () =>
              input.notifyClient
                ? "Se avisó al cliente por WhatsApp."
                : "No se envió aviso al cliente.",
          )
        ).ok,
    }),
    [createAsync, rescheduleAsync],
  );

  return {
    ...actions,
    isSubmitting: create.isPending || reschedule.isPending,
  };
}
