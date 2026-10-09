"use client";

import { useState } from "react";
import { ClipboardPen } from "lucide-react";

import { cn } from "@/lib/utils";
import { useClientActions } from "@/src/features/admin/hooks/use-client-actions";
import type { ReservationAssessment } from "@/src/features/admin/types/reservations.types";

import { HairAssessmentDialog } from "./hair-assessment-dialog";

interface AssessmentCalloutProps {
  assessment: ReservationAssessment | undefined;
  clientId: string;
  clientName: string;
  treatmentName: string;
  density?: "regular" | "compact";
}

const REASON_COPY = {
  REQUIRES_ASSESSMENT: "El servicio requiere valoración previa",
  HAIR_PRICING: "El precio depende del largo y color del cabello",
} as const;

const PROFILE_COPY = {
  MISSING: "la clienta no tiene perfil capilar",
  EXPIRED: "su perfil capilar está vencido",
  VALID: "",
} as const;

export function AssessmentCallout({
  assessment,
  clientId,
  clientName,
  treatmentName,
  density = "regular",
}: AssessmentCalloutProps) {
  const [open, setOpen] = useState(false);
  const clientActions = useClientActions();

  if (!assessment || assessment.state !== "PENDING" || !assessment.reason)
    return null;

  const detail = `${REASON_COPY[assessment.reason]} y ${PROFILE_COPY[assessment.hairProfileStatus]}`;

  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300 bg-amber-50",
        density === "compact" ? "px-3 py-2" : "p-3",
      )}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 font-sans text-sm font-semibold text-amber-900">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-amber-600"
          />
          Pendiente de valoración
        </p>
        {density === "regular" && (
          <p className="mt-0.5 font-sans text-xs text-amber-900/80">
            {detail}.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        title={detail}
        className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 font-sans text-xs font-medium text-primary transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        <ClipboardPen className="size-3.5" strokeWidth={1.8} />
        Registrar valoración
      </button>

      {open && (
        <HairAssessmentDialog
          open={open}
          clientName={clientName}
          context={treatmentName}
          onOpenChange={setOpen}
          onSave={(data) => clientActions.setHairProfile(clientId, data)}
        />
      )}
    </div>
  );
}
