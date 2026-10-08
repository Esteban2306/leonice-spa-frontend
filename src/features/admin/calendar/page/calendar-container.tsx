"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import { useCalendarRange } from "@/src/features/admin/hooks/use-calendar";
import { useCategories } from "@/src/features/admin/hooks/use-categories";
import { useReservation } from "@/src/features/admin/hooks/use-reservations";
import { useReservationActions } from "@/src/features/admin/hooks/use-reservation-actions";
import {
  useScheduleDay,
  useScheduleExceptions,
} from "@/src/features/admin/hooks/use-schedule";
import { useScheduleActions } from "@/src/features/admin/hooks/use-schedule-actions";

import {
  addDays,
  addMonths,
  formatPeriodLabel,
  fromDateKey,
  getBusinessToday,
  getVisibleRange,
  toDateKey,
} from "../lib/calendar-dates";
import { buildCalendarFilters, matchesFilters } from "../lib/calendar-filters";
import { summarizeScheduleByDay } from "../lib/schedule-summary";
import type {
  CalendarReservation,
  CalendarViewMode,
} from "../types/calendar.types";
import type { ScheduleDialogMode } from "../components/schedule/schedule-exception-dialog";
import { CalendarView } from "./calendar-view";
import { useCalendarBooking } from "./use-calendar-booking";

const NO_RESERVATIONS: readonly CalendarReservation[] = [];

function parseViewMode(raw: string | null): CalendarViewMode {
  return raw === "week" ? "week" : "month";
}

export function CalendarContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [focusReservationId] = useState(() =>
    searchParams.get("reservationId"),
  );
  const initialDate =
    fromDateKey(searchParams.get("date") ?? "") ?? getBusinessToday();

  const [today, setToday] = useState(() => getBusinessToday());
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [cursor, setCursor] = useState(initialDate);
  const [viewMode, setViewMode] = useState<CalendarViewMode>(() =>
    parseViewMode(searchParams.get("view")),
  );
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(focusReservationId);
  const [hasFocused, setHasFocused] = useState(false);
  const [scheduleDialog, setScheduleDialog] =
    useState<ScheduleDialogMode | null>(null);
  const [bookingParams] = useState(() => ({
    initialSetupOpen: searchParams.get("new") === "true",
    presetClientId: searchParams.get("clientId"),
    rescheduleReservationId: searchParams.get("reschedule"),
  }));

  const range = getVisibleRange(cursor, viewMode);
  const selectedKey = toDateKey(selectedDate);

  const calendarQuery = useCalendarRange(range);
  const categoriesQuery = useCategories();
  const exceptionsQuery = useScheduleExceptions(range);
  const scheduleDayQuery = useScheduleDay(selectedKey);
  const focusQuery = useReservation(focusReservationId);
  const reservationActions = useReservationActions();
  const scheduleActions = useScheduleActions();

  const syncUrl = useCallback(
    (date: Date, mode: CalendarViewMode, reservationId: string | null) => {
      const params = new URLSearchParams();
      params.set("date", toDateKey(date));
      if (mode !== "month") params.set("view", mode);
      if (reservationId) params.set("reservationId", reservationId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  const nowMs = useMinuteClock();
  const focused = focusQuery.data;
  const focusedDate =
    focused && !hasFocused
      ? fromDateKey(getBogotaDayKey(new Date(focused.scheduledStart)))
      : null;

  if (focused && focusedDate) {
    setHasFocused(true);
    setSelectedDate(focusedDate);
    setCursor(focusedDate);
    setSelectedReservationId(focused.id);
  }

  const booking = useCalendarBooking({
    ...bookingParams,
    range,
    selectedKey,
    reservations: calendarQuery.data ?? NO_RESERVATIONS,
    onFocusDate: (date) => {
      setSelectedDate(date);
      setCursor(date);
      setSelectedReservationId(null);
    },
    onFinished: (date, reservationId) => {
      setSelectedDate(date);
      setCursor(date);
      setSelectedReservationId(reservationId);
      syncUrl(date, viewMode, reservationId);
    },
  });

  const availableFilters = useMemo(
    () => buildCalendarFilters(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  );

  const reservationsByDate = useMemo(() => {
    const byDate: Record<string, CalendarReservation[]> = {};

    for (const reservation of calendarQuery.data ?? []) {
      if (!matchesFilters(reservation, activeFilterIds, searchQuery)) continue;
      (byDate[reservation.dateKey] ??= []).push(reservation);
    }

    return byDate;
  }, [calendarQuery.data, activeFilterIds, searchQuery]);

  const scheduleByDate = useMemo(
    () => summarizeScheduleByDay(exceptionsQuery.data ?? []),
    [exceptionsQuery.data],
  );

  const selectedDayReservations =
    reservationsByDate[selectedKey] ?? NO_RESERVATIONS;

  function selectDate(date: Date, reservationId: string | null = null) {
    setSelectedDate(date);
    setSelectedReservationId(reservationId);
    syncUrl(date, viewMode, reservationId);
  }

  function handleSelectDate(date: Date) {
    if (booking.booking) {
      setSelectedDate(date);
      booking.clearSlot();
    } else {
      selectDate(date);
    }

    if (viewMode === "month" && date.getMonth() !== cursor.getMonth()) {
      setCursor(date);
    }
  }

  function handleSelectReservation(reservationId: string | null) {
    setSelectedReservationId(reservationId);
    syncUrl(selectedDate, viewMode, reservationId);
  }

  function handleToday() {
    const now = getBusinessToday();
    setToday(now);
    setCursor(now);
    selectDate(now);
  }

  function handleStep(direction: 1 | -1) {
    setCursor((current) =>
      viewMode === "month"
        ? addMonths(current, direction)
        : addDays(current, direction * 7),
    );
  }

  function handleViewModeChange(mode: CalendarViewMode) {
    setViewMode(mode);
    setCursor(selectedDate);
    syncUrl(selectedDate, mode, selectedReservationId);
  }

  function handleToggleFilter(filterId: string) {
    setActiveFilterIds((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId],
    );
  }

  function handleClearFilters() {
    setActiveFilterIds([]);
    setSearchQuery("");
  }

  return (
    <CalendarView
      viewMode={viewMode}
      cursor={cursor}
      today={today}
      selectedDate={selectedDate}
      periodLabel={formatPeriodLabel(cursor, viewMode)}
      availableFilters={availableFilters}
      activeFilterIds={activeFilterIds}
      searchQuery={searchQuery}
      reservationsByDate={reservationsByDate}
      scheduleByDate={scheduleByDate}
      isLoading={calendarQuery.isLoading || calendarQuery.isPlaceholderData}
      isError={calendarQuery.isError}
      onRetry={() => void calendarQuery.refetch()}
      selectedDayReservations={selectedDayReservations}
      selectedReservationId={selectedReservationId}
      todayKey={toDateKey(today)}
      nowMs={nowMs}
      scheduleDay={scheduleDayQuery.data ?? null}
      isScheduleDayLoading={scheduleDayQuery.isLoading}
      categories={categoriesQuery.data ?? []}
      scheduleDialog={scheduleDialog}
      reservationActions={reservationActions}
      scheduleActions={scheduleActions}
      onScheduleDialogChange={setScheduleDialog}
      onSelectDate={handleSelectDate}
      onSelectReservation={handleSelectReservation}
      onToday={handleToday}
      onPrevious={() => handleStep(-1)}
      onNext={() => handleStep(1)}
      onViewModeChange={handleViewModeChange}
      onToggleFilter={handleToggleFilter}
      onClearFilters={handleClearFilters}
      onSearchChange={setSearchQuery}
      onViewClient={(clientId) => router.push(`/admin/clients/${clientId}`)}
      booking={booking}
      onReschedule={(reservationId) => {
        booking.startReschedule(reservationId);
        setSelectedReservationId(null);
      }}
    />
  );
}
