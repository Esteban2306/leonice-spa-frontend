"use client";

import { useEffect, useRef } from "react";

import { formatBogotaDayLabel, formatBogotaTime } from "@/src/lib/date/bogota";

import { useReservations } from "../hooks/use-reservations";
import { toastInfo } from "./admin-toast";
import {
  detectReservationSignals,
  takeSignalSnapshot,
  type ReservationSignal,
  type SignalSnapshot,
} from "./detect-reservation-signals";

const SIGNALS_REFETCH_INTERVAL_MS = 60 * 1000;
const MAX_INDIVIDUAL_TOASTS = 3;

const WATCH_PARAMS = {
  status: "PENDIENTE_DEPOSITO",
  page: 1,
  pageSize: 100,
} as const;

function describe(signal: ReservationSignal): string {
  return `${signal.clientName} · ${signal.treatmentName} · ${formatBogotaDayLabel(
    signal.scheduledStart,
  )} ${formatBogotaTime(signal.scheduledStart)}`;
}

function announce(signals: readonly ReservationSignal[]): void {
  if (signals.length > MAX_INDIVIDUAL_TOASTS) {
    toastInfo(
      "Tienes novedades en reservas",
      `${signals.length} reservas nuevas o con comprobante por revisar.`,
    );
    return;
  }

  for (const signal of signals) {
    toastInfo(
      signal.kind === "NEW_PROOF"
        ? "Llegó un comprobante para revisar"
        : "Nueva reserva esperando depósito",
      describe(signal),
    );
  }
}

export function AdminSignalsWatcher() {
  const { data } = useReservations(WATCH_PARAMS, {
    refetchIntervalMs: SIGNALS_REFETCH_INTERVAL_MS,
  });
  const snapshot = useRef<SignalSnapshot | null>(null);

  useEffect(() => {
    if (!data) return;

    if (snapshot.current) {
      const signals = detectReservationSignals(snapshot.current, data.data);
      if (signals.length > 0) announce(signals);
    }

    snapshot.current = takeSignalSnapshot(data.data);
  }, [data]);

  return null;
}
