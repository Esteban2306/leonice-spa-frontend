import { useEffect, useState } from "react";

export function useDebouncedValue<T>(
  value: T,
  delayMs: number,
  key: string,
): T {
  const [state, setState] = useState({ key, value });

  useEffect(() => {
    if (state.key === key) return;
    const timer = setTimeout(() => setState({ key, value }), delayMs);
    return () => clearTimeout(timer);
  }, [key, value, delayMs, state.key]);

  return state.value;
}
