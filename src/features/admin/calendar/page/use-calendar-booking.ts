"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useBookingActions } from "@/src/features/admin/hooks/use-booking-actions";
import { useClient, useClients } from "@/src/features/admin/hooks/use-clients";
import {
  useAvailabilityCalendar,
  useReservation,
} from "@/src/features/admin/hooks/use-reservations";
import { useTreatments } from "@/src/features/admin/hooks/use-treatments";
import type { AvailabilityDay } from "@/src/features/admin/types/reservations.types";

import type { BookingClientSearch } from "../components/booking/booking-client-form";
import type { NewClientValues } from "../components/booking/booking-client-form";
import { indexAvailability } from "../lib/booking";
import { fromDateKey } from "../lib/calendar-dates";
import type {
  BookingClient,
  BookingService,
  BookingSetup,
  CalendarReservation,
} from "../types/calendar.types";

const MINUTE_MS = 60_000;
const CLIENT_SEARCH_MIN_LENGTH = 2;

interface UseCalendarBookingParams {
  initialSetupOpen: boolean;
  presetClientId: string | null;
  rescheduleReservationId: string | null;
  range: { from: string; to: string };
  selectedKey: string;
  reservations: readonly CalendarReservation[];
  onFocusDate: (date: Date) => void;
  onFinished: (date: Date, reservationId: string | null) => void;
}

function serviceFromReservation(
  reservation: CalendarReservation,
): BookingService {
  return {
    treatmentId: reservation.treatmentId,
    name: reservation.treatmentName,
    categoryName: reservation.categoryName,
    durationMinutes: reservation.durationMinutes,
  };
}

export function useCalendarBooking({
  initialSetupOpen,
  presetClientId,
  rescheduleReservationId,
  range,
  selectedKey,
  reservations,
  onFocusDate,
  onFinished,
}: UseCalendarBookingParams) {
  const [booking, setBooking] = useState<BookingSetup | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(initialSetupOpen);
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [clientQuery, setClientQuery] = useState("");
  const [hasStartedFromUrl, setHasStartedFromUrl] = useState(false);

  const deferredQuery = useDeferredValue(clientQuery.trim());
  const treatmentsQuery = useTreatments();
  const presetClientQuery = useClient(presetClientId ?? "");
  const rescheduleQuery = useReservation(rescheduleReservationId);
  const clientsQuery = useClients(
    { q: deferredQuery, pageSize: 5 },
    {
      enabled:
        booking?.mode === "create" &&
        deferredQuery.length >= CLIENT_SEARCH_MIN_LENGTH,
    },
  );
  const bookingActions = useBookingActions();

  const presetClient: BookingClient | null = presetClientQuery.data
    ? {
        id: presetClientQuery.data.id,
        name: presetClientQuery.data.name,
        phone: presetClientQuery.data.phone,
      }
    : null;

  const pendingReschedule = rescheduleQuery.data;
  if (pendingReschedule && !hasStartedFromUrl) {
    setHasStartedFromUrl(true);
    const start = new Date(pendingReschedule.scheduledStart);
    const durationMinutes = Math.round(
      (new Date(pendingReschedule.scheduledEnd).getTime() - start.getTime()) /
        MINUTE_MS,
    );
    setBooking({
      mode: "reschedule",
      services: [
        {
          treatmentId: pendingReschedule.treatment.id,
          name: pendingReschedule.treatment.name,
          categoryName: "",
          durationMinutes,
        },
      ],
      reservation: {
        id: pendingReschedule.id,
        clientName: pendingReschedule.client.name,
        scheduledStart: pendingReschedule.scheduledStart,
      },
      client: null,
    });
    const date = fromDateKey(getBogotaDayKey(start));
    if (date) onFocusDate(date);
  }

  const availabilityQuery = useAvailabilityCalendar(
    booking
      ? {
          treatmentIds: booking.services.map((s) => s.treatmentId).join(","),
          from: range.from,
          to: range.to,
          purpose: booking.mode === "reschedule" ? "RESCHEDULE" : "CREATE",
        }
      : null,
  );

  const availabilityByDate = useMemo(
    () => indexAvailability(availabilityQuery.data?.days ?? []),
    [availabilityQuery.data],
  );
  const selectedDay: AvailabilityDay | null =
    availabilityByDate[selectedKey] ?? null;

  const exit = () => {
    setBooking(null);
    setSlotIso(null);
    setClientQuery("");
  };

  const startCreate = (services: BookingService[]) => {
    setBooking({
      mode: "create",
      services,
      reservation: null,
      client: presetClient,
    });
    setIsSetupOpen(false);
    setSlotIso(null);
  };

  const startReschedule = (reservationId: string) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) return;
    setBooking({
      mode: "reschedule",
      services: [serviceFromReservation(reservation)],
      reservation: {
        id: reservation.id,
        clientName: reservation.clientName,
        scheduledStart: reservation.startsAt,
      },
      client: null,
    });
    setSlotIso(null);
  };

  const finishAt = (iso: string, reservationId: string | null) => {
    const date = fromDateKey(getBogotaDayKey(new Date(iso)));
    exit();
    if (date) onFinished(date, reservationId);
  };

  const create = async (
    client: BookingClient | null,
    values: NewClientValues,
  ) => {
    if (!booking || !slotIso) return;
    const created = await bookingActions.create({
      treatmentIds: booking.services.map((s) => s.treatmentId),
      scheduledStart: slotIso,
      client: client
        ? { phone: client.phone }
        : {
            phone: values.phone,
            name: values.name.trim(),
            birthDate: values.birthDate,
          },
    });
    if (created) {
      const first = created.reservations[0];
      finishAt(first?.scheduledStart ?? slotIso, first?.id ?? null);
    }
  };

  const reschedule = async (notifyClient: boolean) => {
    if (!booking?.reservation || !slotIso) return;
    const ok = await bookingActions.reschedule({
      reservationId: booking.reservation.id,
      newScheduledStart: slotIso,
      notifyClient,
    });
    if (ok) finishAt(slotIso, booking.reservation.id);
  };

  const clientSearch: BookingClientSearch = {
    query: clientQuery,
    results: clientsQuery.data?.data ?? [],
    isSearching: clientsQuery.isFetching,
    onQueryChange: setClientQuery,
  };

  return {
    booking,
    isSetupOpen,
    slotIso,
    availabilityByDate,
    selectedDay,
    isAvailabilityLoading:
      availabilityQuery.isLoading || availabilityQuery.isPlaceholderData,
    treatments: treatmentsQuery.data ?? [],
    isCatalogLoading: treatmentsQuery.isLoading,
    presetClient,
    clientSearch,
    isSubmitting: bookingActions.isSubmitting,
    openSetup: () => setIsSetupOpen(true),
    closeSetup: () => setIsSetupOpen(false),
    startCreate,
    startReschedule,
    selectSlot: setSlotIso,
    clearSlot: () => setSlotIso(null),
    exit,
    create,
    reschedule,
  };
}

export type CalendarBooking = ReturnType<typeof useCalendarBooking>;
