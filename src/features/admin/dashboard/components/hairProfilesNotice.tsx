"use client";

import { useState } from "react";
import {
  ChevronDown,
  ClipboardPen,
  RefreshCcw,
  Scissors,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatBogotaDayLabel, formatBogotaTime } from "@/src/lib/date/bogota";
import { HairAssessmentDialog } from "@/src/features/admin/components/hair-assessment/hair-assessment-dialog";
import type {
  PendingHairProfile,
  SetHairProfileRequest,
} from "@/src/features/admin/types/clients.types";

export const HAIR_PROFILES_NOTICE_ID = "perfiles-por-renovar";

interface HairProfilesNoticeProps {
  profiles: readonly PendingHairProfile[];
  total: number;
  isFetching: boolean;
  canLoadMore: boolean;
  isSaving: boolean;
  onLoadMore: () => void;
  onRegister: (
    clientId: string,
    data: SetHairProfileRequest,
  ) => Promise<boolean>;
  onConfirm: (clientId: string) => Promise<boolean>;
  onViewClient: (clientId: string) => void;
}

const STATUS_COPY = {
  MISSING: "Sin perfil",
  EXPIRED: "Vencido",
  VALID: "Vigente",
} as const;

const ROW_BUTTON =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 font-sans text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-50";

export function HairProfilesNotice({
  profiles,
  total,
  isFetching,
  canLoadMore,
  isSaving,
  onLoadMore,
  onRegister,
  onConfirm,
  onViewClient,
}: HairProfilesNoticeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [registering, setRegistering] = useState<PendingHairProfile | null>(
    null,
  );

  if (total === 0) return null;

  return (
    <section
      id={HAIR_PROFILES_NOTICE_ID}
      aria-labelledby="hair-profiles-notice-title"
      className="scroll-mt-6 overflow-hidden rounded-[1.75rem] border border-amber-300 bg-amber-50/70"
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls="hair-profiles-notice-list"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full cursor-pointer items-center gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tertiary"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-900">
          <Scissors className="size-5" strokeWidth={1.7} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            id="hair-profiles-notice-title"
            className="block font-heading text-2xl leading-tight text-secondary"
          >
            {total}{" "}
            {total === 1
              ? "perfil capilar por renovar"
              : "perfiles capilares por renovar"}
          </span>
          <span className="mt-1 block font-sans text-sm text-secondary/75">
            Clientas con citas capilares próximas sin perfil vigente. Mientras
            no se renueve, el sistema cotiza el caso más alto.
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-secondary/70 transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {isExpanded && (
        <div
          id="hair-profiles-notice-list"
          className="border-t border-amber-200 bg-[#FCF6EB] px-3 py-3 sm:px-5"
        >
          <ul
            className={cn(
              "flex flex-col divide-y divide-tertiary/20",
              isFetching && "opacity-70",
            )}
          >
            {profiles.map((profile) => (
              <li
                key={profile.clientId}
                className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-sans text-sm font-semibold text-secondary">
                    {profile.name}
                    <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-normal text-amber-900">
                      {STATUS_COPY[profile.hairProfile.status]}
                    </span>
                  </p>
                  {profile.nextReservation && (
                    <p className="mt-0.5 font-sans text-xs text-secondary/70">
                      Próxima cita:{" "}
                      {formatBogotaDayLabel(
                        profile.nextReservation.scheduledStart,
                      )}{" "}
                      ·{" "}
                      {formatBogotaTime(profile.nextReservation.scheduledStart)}{" "}
                      · {profile.nextReservation.treatment}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setRegistering(profile)}
                    className={`${ROW_BUTTON} bg-secondary font-medium text-primary hover:bg-secondary/90`}
                  >
                    <ClipboardPen className="size-3.5" strokeWidth={1.8} />
                    Registrar valoración
                  </button>
                  {profile.hairProfile.status === "EXPIRED" && (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => void onConfirm(profile.clientId)}
                      title="Renueva 4 meses sin cambiar largo ni color"
                      className={`${ROW_BUTTON} border border-tertiary/50 text-secondary hover:bg-quaternary/25`}
                    >
                      <RefreshCcw className="size-3.5" strokeWidth={1.8} />
                      Confirmar sin cambios
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewClient(profile.clientId)}
                    className={`${ROW_BUTTON} text-secondary/75 hover:bg-secondary/5`}
                  >
                    <UserRound className="size-3.5" strokeWidth={1.8} />
                    Ficha
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {canLoadMore && (
            <button
              type="button"
              disabled={isFetching}
              onClick={onLoadMore}
              className="mt-2 h-10 w-full cursor-pointer rounded-full font-sans text-sm text-secondary/75 transition-colors hover:bg-secondary/5 disabled:opacity-50"
            >
              {isFetching
                ? "Cargando…"
                : `Ver más (${total - profiles.length} restantes)`}
            </button>
          )}
        </div>
      )}

      {registering && (
        <HairAssessmentDialog
          key={registering.clientId}
          open
          clientName={registering.name}
          context={registering.nextReservation?.treatment}
          initialLength={registering.hairProfile.hairLength}
          initialColor={registering.hairProfile.hairColor}
          onOpenChange={(open) => !open && setRegistering(null)}
          onSave={(data) => onRegister(registering.clientId, data)}
        />
      )}
    </section>
  );
}
