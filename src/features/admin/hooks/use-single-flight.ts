import { useCallback, useRef } from "react";

export function createSingleFlight() {
  const inFlight = new Map<string, Promise<unknown>>();

  return function run<T>(key: string, execute: () => Promise<T>): Promise<T> {
    const pending = inFlight.get(key);
    if (pending) return pending as Promise<T>;

    const promise = execute().finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
    return promise;
  };
}

export function useSingleFlight() {
  const runner = useRef<ReturnType<typeof createSingleFlight> | null>(null);

  return useCallback(<T>(key: string, execute: () => Promise<T>) => {
    runner.current ??= createSingleFlight();
    return runner.current(key, execute);
  }, []);
}
