import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "../utils/timing";

const haveDependenciesChanged = (previous = [], next = []) =>
  previous.length !== next.length ||
  previous.some((value, index) => !Object.is(value, next[index]));

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
  const dependencies = Array.isArray(deps) ? deps : [];
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedRef = useRef(null);
  const configRef = useRef({ delayMs, dependencies });

  if (!debouncedRef.current) {
    debouncedRef.current = debounce((...args) => {
      callbackRef.current(...args);
    }, delayMs);
  }

  useEffect(() => {
    if (
      configRef.current.delayMs !== delayMs ||
      haveDependenciesChanged(configRef.current.dependencies, dependencies)
    ) {
      debouncedRef.current.cancel();
      debouncedRef.current = debounce((...args) => {
        callbackRef.current(...args);
      }, delayMs);
      configRef.current = { delayMs, dependencies };
    }
  });

  useEffect(
    () => () => {
      debouncedRef.current?.cancel();
    },
    []
  );

  return useMemo(() => {
    const debouncedCallback = (...args) => debouncedRef.current(...args);
    debouncedCallback.cancel = () => debouncedRef.current?.cancel();
    return debouncedCallback;
  }, []);
};
