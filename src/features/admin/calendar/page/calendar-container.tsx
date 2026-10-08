"use client";

import { useMemo, useState } from "react";

import { MOCK_RESERVATIONS } from "../data/calendar.mock";
import {
  addDays,
  addMonths,
  formatPeriodLabel,
  toDateKey,
} from "../lib/calendar-dates";
import { AVAILABLE_FILTERS, matchesFilters } from "../lib/calendar-filters";
import type {
  CalendarReservation,
  CalendarViewMode,
} from "../types/calendar.types";
import { CalendarView } from "./calendar-view";

const NO_RESERVATIONS: readonly CalendarReservation[] = [];

const pending = (): void => undefined;

export function CalendarContainer() {
  const [today, setToday] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [cursor, setCursor] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const reservationsByDate = useMemo(() => {
    const byDate: Record<string, CalendarReservation[]> = {};

    const visible = MOCK_RESERVATIONS.filter((reservation) =>
      matchesFilters(reservation, activeFilterIds),
    ).sort((a, b) => a.start.localeCompare(b.start));

    for (const reservation of visible) {
      const bucket = byDate[reservation.dateKey];

      if (bucket) {
        bucket.push(reservation);
      } else {
        byDate[reservation.dateKey] = [reservation];
      }
    }

    return byDate;
  }, [activeFilterIds]);

  const selectedDayReservations =
    reservationsByDate[toDateKey(selectedDate)] ?? NO_RESERVATIONS;

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setSelectedReservationId(null);

    if (viewMode === "month" && date.getMonth() !== cursor.getMonth()) {
      setCursor(date);
    }
  }

  function handleToday() {
    const now = new Date();

    setToday(now);
    setSelectedDate(now);
    setCursor(now);
    setSelectedReservationId(null);
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
  }

  function handleToggleFilter(filterId: string) {
    setActiveFilterIds((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId],
    );
    setSelectedReservationId(null);
  }

  function handleClearFilters() {
    setActiveFilterIds([]);
    setSelectedReservationId(null);
  }

  return (
    <CalendarView
      viewMode={viewMode}
      cursor={cursor}
      today={today}
      selectedDate={selectedDate}
      periodLabel={formatPeriodLabel(cursor, viewMode)}
      availableFilters={AVAILABLE_FILTERS}
      activeFilterIds={activeFilterIds}
      reservationsByDate={reservationsByDate}
      selectedDayReservations={selectedDayReservations}
      selectedReservationId={selectedReservationId}
      onCreateReservation={pending}
      onSelectDate={handleSelectDate}
      onSelectReservation={setSelectedReservationId}
      onToday={handleToday}
      onPrevious={() => handleStep(-1)}
      onNext={() => handleStep(1)}
      onViewModeChange={handleViewModeChange}
      onToggleFilter={handleToggleFilter}
      onClearFilters={handleClearFilters}
      onBlockDay={pending}
      onBlockHours={pending}
      onEditSchedule={pending}
      onViewClient={pending}
      onReschedule={pending}
      onCancel={pending}
    />
  );
}
