import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../utils/timing";

/**
 * Debounce a value — useful for search inputs where the UI updates immediately
 * but downstream effects (filtering, API calls) wait for typing to pause.
 */
export const useDebouncedValue = (value, delayMs = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
};

/**
 * Returns a stable debounced callback. Cleans up pending calls on unmount.
 */
export const useDebouncedCallback = (callback, delayMs = 300, deps = []) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedRef = useRef(null);

  if (!debouncedRef.current) {
    debouncedRef.current = debounce((...args) => {
      callbackRef.current(...args);
    }, delayMs);
  }

  useEffect(() => {
    debouncedRef.current.cancel();
    debouncedRef.current = debounce((...args) => {
      callbackRef.current(...args);
    }, delayMs);
  }, [delayMs, ...deps]);

  useEffect(
    () => () => {
      debouncedRef.current?.cancel();
    },
    []
  );

  return useCallback(
    Object.assign((...args) => debouncedRef.current(...args), {
      cancel: () => debouncedRef.current?.cancel(),
    }),
    []
  );
};
