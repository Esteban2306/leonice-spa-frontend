"use client";

import { useSyncExternalStore } from "react";

const MINUTE_MS = 60_000;

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
    }, MINUTE_MS);
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

export function useMinuteClock(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
