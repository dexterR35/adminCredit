/**
 * Returns a debounced function that delays invoking `fn` until after `delayMs`
 * have elapsed since the last call.
 */
export const debounce = (fn, delayMs) => {
  let timerId = null;

  const debounced = (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, delayMs);
  };

  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };

  debounced.flush = (...args) => {
    clearTimeout(timerId);
    timerId = null;
    fn(...args);
  };

  return debounced;
};

/**
 * Returns a throttled function that invokes `fn` at most once per `limitMs`.
 */
export const throttle = (fn, limitMs) => {
  let lastRun = 0;
  let timerId = null;
  let pendingArgs = null;

  const invoke = () => {
    lastRun = Date.now();
    timerId = null;
    const args = pendingArgs;
    pendingArgs = null;
    fn(...args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const remaining = limitMs - (now - lastRun);
    pendingArgs = args;

    if (remaining <= 0) {
      clearTimeout(timerId);
      invoke();
      return;
    }

    if (!timerId) {
      timerId = setTimeout(invoke, remaining);
    }
  };

  throttled.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
    pendingArgs = null;
  };

  return throttled;
};
