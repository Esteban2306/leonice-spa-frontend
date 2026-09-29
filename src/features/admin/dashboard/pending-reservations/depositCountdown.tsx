"use client";

import { Timer } from "lucide-react";
import { useSyncExternalStore } from "react";

const URGENT_THRESHOLD_MS = 30 * 60 * 1000;

let currentNow = Date.now();
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    currentNow = Date.now();
    timer = setInterval(() => {
      currentNow = Date.now();
      listeners.forEach((notify) => notify());
    }, 1000);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  return currentNow;
}

function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function formatRemaining(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
}

interface DepositCountdownProps {
  expiresAt: string | null;
}

export function DepositCountdown({ expiresAt }: DepositCountdownProps) {
  const now = useNow();

  if (!expiresAt) return null;

  const remainingMs = new Date(expiresAt).getTime() - now;
  const isExpired = remainingMs <= 0;
  const isUrgent = !isExpired && remainingMs <= URGENT_THRESHOLD_MS;

  const tone = isExpired
    ? "bg-red-100 text-red-800"
    : isUrgent
      ? "bg-amber-100 text-amber-800"
      : "bg-quaternary/30 text-secondary";

  return (
    <span
      role="timer"
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-medium ${tone}`}
    >
      <Timer className="size-3.5" strokeWidth={1.8} />
      {isExpired ? "Vencida" : `Vence en ${formatRemaining(remainingMs)}`}
    </span>
  );
}
