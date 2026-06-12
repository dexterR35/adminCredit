import { useEffect, useMemo, useRef } from "react";
import { throttle } from "../utils/timing";

const haveDependenciesChanged = (previous = [], next = []) =>
  previous.length !== next.length ||
  previous.some((value, index) => !Object.is(value, next[index]));

/**
 * Returns a stable throttled callback. Cleans up pending calls on unmount.
 */
export const useThrottledCallback = (callback, limitMs = 500, deps = []) => {
  const dependencies = Array.isArray(deps) ? deps : [];
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const throttledRef = useRef(null);
  const configRef = useRef({ limitMs, dependencies });

  if (!throttledRef.current) {
    throttledRef.current = throttle((...args) => {
      callbackRef.current(...args);
    }, limitMs);
  }

  useEffect(() => {
    if (
      configRef.current.limitMs !== limitMs ||
      haveDependenciesChanged(configRef.current.dependencies, dependencies)
    ) {
      throttledRef.current.cancel();
      throttledRef.current = throttle((...args) => {
        callbackRef.current(...args);
      }, limitMs);
      configRef.current = { limitMs, dependencies };
    }
  });

  useEffect(
    () => () => {
      throttledRef.current?.cancel();
    },
    []
  );

  return useMemo(() => {
    const throttledCallback = (...args) => throttledRef.current(...args);
    throttledCallback.cancel = () => throttledRef.current?.cancel();
    return throttledCallback;
  }, []);
};
