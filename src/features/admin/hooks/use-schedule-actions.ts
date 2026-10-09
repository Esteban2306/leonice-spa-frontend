import { useMemo } from "react";

import { HttpError } from "@/src/lib/api/http-error";
import { formatBogotaTime } from "@/src/lib/date/bogota";

import { ADMIN_ACTION_MESSAGES } from "../feedback/action-messages";
import { toastError, toastSuccess } from "../feedback/admin-toast";
import {
  useCreateScheduleException,
  useDeleteScheduleException,
  useUpdateBaseSchedule,
} from "./use-schedule";

import type {
  ScheduleChangeResult,
  UpdateBaseScheduleRequest,
} from "../types/schedule.types";

export interface ScheduleExceptionInput {
  date: string;
  categoryId?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface ScheduleActions {
  block: (input: ScheduleExceptionInput) => Promise<boolean>;
  openExtraHours: (input: ScheduleExceptionInput) => Promise<boolean>;
  removeException: (exceptionId: string) => Promise<boolean>;
  updateBaseSchedule: (data: UpdateBaseScheduleRequest) => Promise<boolean>;
  isSaving: boolean;
}

interface ConflictDetails {
  reservations?: Array<{
    clientName?: string;
    treatment?: string;
    scheduledStart?: string;
  }>;
}

const MAX_LISTED_CONFLICTS = 3;

function describeConflicts(error: unknown): string | null {
  if (
    !(error instanceof HttpError) ||
    error.code !== "SCHEDULE_CHANGE_HAS_RESERVATIONS"
  ) {
    return null;
  }

  const listed = (
    (error.details as ConflictDetails | undefined)?.reservations ?? []
  )
    .slice(0, MAX_LISTED_CONFLICTS)
    .map((r) =>
      [
        r.clientName,
        r.treatment,
        r.scheduledStart && formatBogotaTime(r.scheduledStart),
      ]
        .filter(Boolean)
        .join(" · "),
    );

  return listed.length > 0 ? `${error.message} ${listed.join(" | ")}` : null;
}

function describeExtendedDeadlines(
  result: Pick<ScheduleChangeResult, "depositDeadlinesExtended">,
): string | undefined {
  const count = result.depositDeadlinesExtended.length;
  if (count === 0) return undefined;
  return `Se extendió el plazo de depósito de ${count} ${count === 1 ? "reserva" : "reservas"}.`;
}

async function runScheduleAction(
  action:
    | "blockSchedule"
    | "openSchedule"
    | "removeScheduleException"
    | "updateBaseSchedule",
  execute: () => Promise<
    Pick<ScheduleChangeResult, "depositDeadlinesExtended">
  >,
): Promise<boolean> {
  const messages = ADMIN_ACTION_MESSAGES[action];

  try {
    const result = await execute();
    toastSuccess(messages.success, describeExtendedDeadlines(result));
    return true;
  } catch (error) {
    const conflicts = describeConflicts(error);
    toastError(messages.error, conflicts ? new Error(conflicts) : error);
    return false;
  }
}

export function useScheduleActions(): ScheduleActions {
  const create = useCreateScheduleException();
  const remove = useDeleteScheduleException();
  const updateBase = useUpdateBaseSchedule();
  const { mutateAsync: createAsync } = create;
  const { mutateAsync: removeAsync } = remove;
  const { mutateAsync: updateBaseAsync } = updateBase;

  const actions = useMemo(
    () => ({
      block: (input: ScheduleExceptionInput) =>
        runScheduleAction("blockSchedule", () =>
          createAsync({ ...input, type: "BLOCK" }),
        ),
      openExtraHours: (input: ScheduleExceptionInput) =>
        runScheduleAction("openSchedule", () =>
          createAsync({ ...input, type: "OPEN" }),
        ),
      removeException: (exceptionId: string) =>
        runScheduleAction("removeScheduleException", () =>
          removeAsync(exceptionId),
        ),
      updateBaseSchedule: (data: UpdateBaseScheduleRequest) =>
        runScheduleAction("updateBaseSchedule", () => updateBaseAsync(data)),
    }),
    [createAsync, removeAsync, updateBaseAsync],
  );

  return {
    ...actions,
    isSaving: create.isPending || remove.isPending || updateBase.isPending,
  };
}
