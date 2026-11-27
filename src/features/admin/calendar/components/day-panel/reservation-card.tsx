"use client";

import { useEffect, useRef, useState } from "react";
import { Ellipsis, MessageCircle } from "lucide-react";

import { AssessmentCallout } from "@/src/features/admin/components/hair-assessment/assessment-callout";
import { HairAssessmentDialog } from "@/src/features/admin/components/hair-assessment/hair-assessment-dialog";
import { ApproveDepositDialog } from "@/src/features/admin/components/reservation-actions/approve-deposit-dialog";
import { CancelReservationDialog } from "@/src/features/admin/components/reservation-actions/cancel-reservation-dialog";
import { CompleteReservationDialog } from "@/src/features/admin/components/reservation-actions/complete-reservation-dialog";
import { DepositProofViewer } from "@/src/features/admin/components/reservation-actions/deposit-proof-viewer";
import { RejectDepositDialog } from "@/src/features/admin/components/reservation-actions/reject-deposit-dialog";
import { useClientActions } from "@/src/features/admin/hooks/use-client-actions";

import {
  STAGE_ACTION_LABELS,
  describeStage,
  needsAssessment,
  type StageAction,
} from "../../lib/reservation-stage";
import type { CalendarReservation } from "../../types/calendar.types";
import { PRIMARY_ACTION, SECONDARY_ACTION } from "./panel-buttons";
import type { DayPanelHandlers } from "./panel-handlers";
import {
  ReservationActionsSheet,
  type ReservationDialog,
} from "./reservation-actions-sheet";
import { StageSummary } from "./stage-summary";

interface ReservationCardProps extends DayPanelHandlers {
  reservation: CalendarReservation;
  isSelected: boolean;
  belongsToCombo: boolean;
  showClientName?: boolean;
  onSelect: (reservationId: string | null) => void;
}

export function ReservationCard({
  reservation,
  isSelected,
  belongsToCombo,
  showClientName = true,
  onSelect,
  todayKey,
  nowMs,
  actions,
  onViewClient,
  onReschedule,
}: ReservationCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dialog, setDialog] = useState<ReservationDialog | null>(null);
  const clientActions = useClientActions();
  const cardRef = useRef<HTMLElement>(null);

  const stage = describeStage(reservation, { todayKey, nowMs });
  const isUpcoming = new Date(reservation.startsAt).getTime() > nowMs;
  const isBusy = actions.busyReservationId === reservation.id;
  // Si ya no es el siguiente paso, la valoración pendiente se avisa aparte.
  const warnsAssessment =
    needsAssessment(reservation) &&
    (reservation.status === "CONFIRMADA" ||
      reservation.status === "CITA_EN_CURSO");
  const closeDialog = (open: boolean) => {
    if (!open) setDialog(null);
  };

  // Un enlace a una cita concreta la deja a la vista.
  useEffect(() => {
    if (isSelected) cardRef.current?.scrollIntoView({ block: "nearest" });
  }, [isSelected]);

  const run: Record<StageAction, () => void> = {
    assess: () => setDialog("assess"),
    "register-payment": () => setDialog("approve"),
    "approve-proof": () => setDialog("approve"),
    "check-in": () => void actions.checkIn(reservation.id),
    "check-in-late": () => void actions.checkIn(reservation.id),
    complete: () => setDialog("complete"),
    revive: () => void actions.revive(reservation.id),
  };

  return (
    <article
      ref={cardRef}
      aria-label={`Cita de las ${reservation.start}`}
      className={`flex flex-col gap-3 rounded-2xl border bg-[#FBF8F0] p-4 ${
        isSelected ? "border-2 border-secondary" : "border-secondary/20"
      }`}
    >
      <div>
        <p className="whitespace-nowrap font-sans text-lg font-bold text-secondary">
          {reservation.start} – {reservation.end}
        </p>
        {showClientName && (
          <p className="break-words font-sans text-base text-secondary">
            {reservation.dependentName ?? reservation.clientName}
            {reservation.dependentName && (
              <span className="block font-sans text-sm text-secondary/80">
                Contacto: {reservation.clientName}
              </span>
            )}
          </p>
        )}
        <p className="font-sans text-sm text-secondary/80">
          {reservation.treatmentName}
        </p>
      </div>

      <StageSummary stage={stage} />

      {warnsAssessment && (
        <AssessmentCallout
          assessment={reservation.assessment}
          clientId={reservation.clientId}
          clientName={reservation.clientName}
          treatmentName={reservation.treatmentName}
        />
      )}

      {reservation.status === "PENDIENTE_DEPOSITO" && reservation.proofUrl && (
        <div className="flex items-center gap-3">
          <DepositProofViewer
            proofUrl={reservation.proofUrl}
            clientName={reservation.clientName}
          />
          <span className="font-sans text-sm text-secondary/80">
            Toca la imagen para ver el comprobante.
          </span>
        </div>
      )}

      {stage.primary && (
        <button
          type="button"
          disabled={isBusy}
          onClick={run[stage.primary]}
          className={PRIMARY_ACTION}
        >
          {STAGE_ACTION_LABELS[stage.primary]}
        </button>
      )}

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/${reservation.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY_ACTION}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            onSelect(reservation.id);
            setIsSheetOpen(true);
          }}
          className={SECONDARY_ACTION}
        >
          <Ellipsis className="size-4" aria-hidden="true" />
          Más acciones
        </button>
      </div>

      <ReservationActionsSheet
        reservation={reservation}
        open={isSheetOpen}
        primary={warnsAssessment ? "assess" : stage.primary}
        isUpcoming={isUpcoming}
        isBusy={isBusy}
        onOpenChange={setIsSheetOpen}
        onDialog={setDialog}
        onReschedule={() => onReschedule(reservation.id)}
        onViewClient={() => onViewClient(reservation.clientId)}
        onSendLink={() => void actions.sendCancellationLink(reservation.id)}
        onCopyLink={() => void actions.copyCancellationLink(reservation.id)}
      />

      {dialog === "assess" && (
        <HairAssessmentDialog
          open
          clientName={reservation.clientName}
          context={reservation.treatmentName}
          onOpenChange={closeDialog}
          onSave={(data) =>
            clientActions.setHairProfile(reservation.clientId, data)
          }
        />
      )}
      {dialog === "approve" && (
        <ApproveDepositDialog
          open
          onOpenChange={closeDialog}
          reservationId={reservation.id}
          clientName={reservation.clientName}
          priceThousands={reservation.price}
          hasProof={reservation.proofUrl !== null}
          belongsToGroup={belongsToCombo}
          onApprove={actions.approveDeposit}
        />
      )}
      {dialog === "reject" && (
        <RejectDepositDialog
          open
          onOpenChange={closeDialog}
          reservationId={reservation.id}
          clientName={reservation.clientName}
          onReject={actions.rejectDeposit}
        />
      )}
      {dialog === "complete" && (
        <CompleteReservationDialog
          open
          onOpenChange={closeDialog}
          reservationId={reservation.id}
          clientName={reservation.clientName}
          treatmentName={reservation.treatmentName}
          onComplete={actions.complete}
        />
      )}
      {dialog === "cancel" && (
        <CancelReservationDialog
          open
          onOpenChange={closeDialog}
          reservationId={reservation.id}
          clientName={reservation.clientName}
          treatmentName={reservation.treatmentName}
          onCancel={actions.cancel}
        />
      )}
    </article>
  );
}
