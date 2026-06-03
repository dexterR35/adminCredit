import { useCallback, useEffect, useRef } from "react";
import { throttle } from "../utils/timing";

/**
 * Returns a stable throttled callback. Cleans up pending calls on unmount.
 */
export const useThrottledCallback = (callback, limitMs = 500, deps = []) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const throttledRef = useRef(null);

  if (!throttledRef.current) {
    throttledRef.current = throttle((...args) => {
      callbackRef.current(...args);
    }, limitMs);
  }

  useEffect(() => {
    throttledRef.current.cancel();
    throttledRef.current = throttle((...args) => {
      callbackRef.current(...args);
    }, limitMs);
  }, [limitMs, ...deps]);

  useEffect(
    () => () => {
      throttledRef.current?.cancel();
    },
    []
  );

  return useCallback((...args) => throttledRef.current(...args), []);
};
