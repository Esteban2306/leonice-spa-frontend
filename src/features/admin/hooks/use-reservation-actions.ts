import { useMemo } from "react";

import { pesosToThousands } from "@/src/lib/money/cop";

import { runAdminAction } from "../feedback/run-admin-action";
import { useApproveDeposit, useRejectDeposit } from "./use-deposits";
import {
  useAdminCancelReservation,
  useCheckInReservation,
  useCompleteReservation,
  useIssueCancellationLink,
  useReviveReservation,
} from "./use-reservations";

import type { ApproveDepositScope } from "../types/deposits.types";
import type { DepositCoverage } from "../types/enums";

export interface ApproveDepositInput {
  reservationId: string;
  coverage: DepositCoverage;
  amountPesos: number;
  scope: ApproveDepositScope;
}

export interface CancelReservationInput {
  reservationId: string;
  reason?: string;
  notifyClient: boolean;
}

export interface ReservationActions {
  approveDeposit: (input: ApproveDepositInput) => Promise<boolean>;
  rejectDeposit: (reservationId: string, reason: string) => Promise<boolean>;
  cancel: (input: CancelReservationInput) => Promise<boolean>;
  checkIn: (reservationId: string) => Promise<boolean>;
  complete: (reservationId: string) => Promise<boolean>;
  revive: (reservationId: string) => Promise<boolean>;
  sendCancellationLink: (reservationId: string) => Promise<boolean>;
  copyCancellationLink: (reservationId: string) => Promise<boolean>;
  busyReservationId: string | null;
}

async function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    throw new Error(
      "El navegador no permite copiar automáticamente. Copia el enlace manualmente.",
    );
  }
  await navigator.clipboard.writeText(text);
}

export function useReservationActions(): ReservationActions {
  const approve = useApproveDeposit();
  const reject = useRejectDeposit();
  const cancel = useAdminCancelReservation();
  const checkIn = useCheckInReservation();
  const complete = useCompleteReservation();
  const revive = useReviveReservation();
  const issueLink = useIssueCancellationLink();

  const busyReservationId =
    (approve.isPending && approve.variables?.reservationId) ||
    (reject.isPending && reject.variables?.reservationId) ||
    (cancel.isPending && cancel.variables?.reservationId) ||
    (checkIn.isPending && checkIn.variables) ||
    (complete.isPending && complete.variables) ||
    (revive.isPending && revive.variables) ||
    (issueLink.isPending && issueLink.variables?.reservationId) ||
    null;

  const { mutateAsync: approveAsync } = approve;
  const { mutateAsync: rejectAsync } = reject;
  const { mutateAsync: cancelAsync } = cancel;
  const { mutateAsync: checkInAsync } = checkIn;
  const { mutateAsync: completeAsync } = complete;
  const { mutateAsync: reviveAsync } = revive;
  const { mutateAsync: issueLinkAsync } = issueLink;

  const actions = useMemo(
    () => ({
      approveDeposit: async (input: ApproveDepositInput) =>
        (
          await runAdminAction("approveDeposit", () =>
            approveAsync({
              reservationId: input.reservationId,
              data: {
                coverage: input.coverage,
                amount: pesosToThousands(input.amountPesos),
                scope: input.scope,
              },
            }),
          )
        ).ok,

      rejectDeposit: async (reservationId: string, reason: string) =>
        (
          await runAdminAction("rejectDeposit", () =>
            rejectAsync({ reservationId, data: { reason } }),
          )
        ).ok,

      cancel: async (input: CancelReservationInput) =>
        (
          await runAdminAction(
            "cancelReservation",
            () =>
              cancelAsync({
                reservationId: input.reservationId,
                data: {
                  reason: input.reason,
                  notifyClient: input.notifyClient,
                },
              }),
            () =>
              input.notifyClient
                ? "Se notificó al cliente por WhatsApp."
                : "No se envió aviso al cliente.",
          )
        ).ok,

      checkIn: async (reservationId: string) =>
        (await runAdminAction("checkIn", () => checkInAsync(reservationId)))
          .ok,

      complete: async (reservationId: string) =>
        (await runAdminAction("complete", () => completeAsync(reservationId)))
          .ok,

      revive: async (reservationId: string) =>
        (await runAdminAction("revive", () => reviveAsync(reservationId))).ok,

      sendCancellationLink: async (reservationId: string) =>
        (
          await runAdminAction("sendCancellationLink", () =>
            issueLinkAsync({ reservationId, data: { send: true } }),
          )
        ).ok,

      copyCancellationLink: async (reservationId: string) => {
        const issued = await runAdminAction(
          "copyCancellationLink",
          async () => {
            const link = await issueLinkAsync({
              reservationId,
              data: { send: false },
            });
            await copyToClipboard(link.url);
            return link;
          },
        );
        return issued.ok;
      },
    }),
    [
      approveAsync,
      rejectAsync,
      cancelAsync,
      checkInAsync,
      completeAsync,
      reviveAsync,
      issueLinkAsync,
    ],
  );

  return { ...actions, busyReservationId };
}
