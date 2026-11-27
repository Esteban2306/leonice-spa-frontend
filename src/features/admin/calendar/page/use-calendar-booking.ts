"use client";

import { useMemo, useState } from "react";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useBookingActions } from "@/src/features/admin/hooks/use-booking-actions";
import {
  useAvailabilityCalendar,
  useReservation,
} from "@/src/features/admin/hooks/use-reservations";
import type { AvailabilityDay } from "@/src/features/admin/types/reservations.types";

import { indexAvailability } from "../lib/booking";
import { fromDateKey } from "../lib/calendar-dates";
import type {
  BookingService,
  BookingSetup,
  CalendarReservation,
} from "../types/calendar.types";

const MINUTE_MS = 60_000;

interface UseCalendarBookingParams {
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
  rescheduleReservationId,
  range,
  selectedKey,
  reservations,
  onFocusDate,
  onFinished,
}: UseCalendarBookingParams) {
  const [booking, setBooking] = useState<BookingSetup | null>(null);
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [hasStartedFromUrl, setHasStartedFromUrl] = useState(false);

  const rescheduleQuery = useReservation(rescheduleReservationId);
  const bookingActions = useBookingActions();

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
          purpose: "RESCHEDULE",
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
    });
    setSlotIso(null);
  };

  const finishAt = (iso: string, reservationId: string | null) => {
    const date = fromDateKey(getBogotaDayKey(new Date(iso)));
    exit();
    if (date) onFinished(date, reservationId);
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

  return {
    booking,
    slotIso,
    availabilityByDate,
    selectedDay,
    isAvailabilityLoading:
      availabilityQuery.isLoading || availabilityQuery.isPlaceholderData,
    isSubmitting: bookingActions.isSubmitting,
    startReschedule,
    selectSlot: setSlotIso,
    clearSlot: () => setSlotIso(null),
    exit,
    reschedule,
  };
}

export type CalendarBooking = ReturnType<typeof useCalendarBooking>;
