"use client";

import { useMemo, useState } from "react";
import type {
  CalendarReservation,
  CalendarViewMode,
} from "../types/calendar.types";
import { CalendarView } from "./calendar-view";

const MOCK_RESERVATIONS: CalendarReservation[] = [
  {
    id: "reservation-1",
    clientName: "María González",
    treatmentName: "Reparación capilar",
    professionalName: "Valentina R.",
    start: "09:00",
    end: "10:30",
    status: "CONFIRMADA",
    phone: "+57 310 442 8890",
    category: "Tratamiento capilar",
    price: 180000,
  },
  {
    id: "reservation-2",
    clientName: "Camila Torres",
    treatmentName: "Hidratación profunda",
    professionalName: "Adriana Ruiz",
    start: "11:30",
    end: "12:30",
    status: "CONFIRMADA",
    phone: "+57 300 222 1122",
    category: "Tratamiento capilar",
    price: 150000,
  },
  {
    id: "reservation-3",
    clientName: "Sofía Herrera",
    treatmentName: "Spa coreano ritual",
    professionalName: "Valentina R.",
    start: "15:00",
    end: "16:30",
    status: "AGENDADA",
    phone: "+57 315 555 2211",
    category: "Spa",
    price: 220000,
  },
  {
    id: "reservation-4",
    clientName: "Luciana Pardo",
    treatmentName: "Brillo + corte bordado",
    professionalName: "Adriana Ruiz",
    start: "17:00",
    end: "17:45",
    status: "CONFIRMADA",
    phone: "+57 320 888 4422",
    category: "Tratamiento capilar",
    price: 120000,
  },
  {
    id: "reservation-5",
    clientName: "María González",
    treatmentName: "Hidratación capilar",
    professionalName: "Valentina R.",
    start: "09:00",
    end: "10:00",
    status: "CONFIRMADA",
    phone: "+57 310 442 8890",
    category: "Tratamiento capilar",
    price: 130000,
  },
  {
    id: "reservation-6",
    clientName: "Camila Torres",
    treatmentName: "Coloración",
    professionalName: "Adriana Ruiz",
    start: "14:00",
    end: "15:30",
    status: "CONFIRMADA",
    phone: "+57 300 222 1122",
    category: "Color",
    price: 200000,
  },
];

function createDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function CalendarContainer() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 13));

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 9, 1));

  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const [activeFilters, setActiveFilters] = useState<string[]>([
    "Reparación capilar",
    "Confirmadas",
  ]);

  const selectedDayReservations = useMemo(() => {
    const selectedKey = createDateKey(selectedDate);

    return MOCK_RESERVATIONS.filter((reservation) => {
      const reservationDate = new Date(`2026-10-13T${reservation.start}:00`);

      return createDateKey(reservationDate) === selectedKey;
    });
  }, [selectedDate]);

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
  }

  function handleToday() {
    const today = new Date();

    setSelectedDate(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function handlePreviousMonth() {
    setCurrentMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  }

  function handleNextMonth() {
    setCurrentMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  }

  function handleToggleFilter(filter: string) {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    );
  }

  function handleClearFilters() {
    setActiveFilters([]);
  }

  return (
    <CalendarView
      currentMonth={currentMonth}
      selectedDate={selectedDate}
      viewMode={viewMode}
      reservations={MOCK_RESERVATIONS}
      selectedDayReservations={selectedDayReservations}
      activeFilters={activeFilters}
      onSelectDate={handleSelectDate}
      onToday={handleToday}
      onPreviousMonth={handlePreviousMonth}
      onNextMonth={handleNextMonth}
      onMonthChange={setCurrentMonth}
      onViewModeChange={setViewMode}
      onToggleFilter={handleToggleFilter}
      onClearFilters={handleClearFilters}
    />
  );
}
