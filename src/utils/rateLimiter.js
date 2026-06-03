/**
 * In-memory sliding-window rate limiter for client-side action guards
 * (login attempts, form submits, etc.). Not a substitute for server-side limits.
 */
export const createRateLimiter = ({
  maxAttempts = 5,
  windowMs = 60_000,
  keyPrefix = "default",
} = {}) => {
  const buckets = new Map();

  const bucketKey = (key) => `${keyPrefix}:${key}`;

  const prune = (timestamps, now) =>
    timestamps.filter((ts) => now - ts < windowMs);

  const check = (key = "global") => {
    const now = Date.now();
    const timestamps = prune(buckets.get(bucketKey(key)) ?? [], now);
    const remaining = Math.max(0, maxAttempts - timestamps.length);
    const oldest = timestamps[0];
    const retryAfterMs =
      remaining > 0 || oldest == null ? 0 : windowMs - (now - oldest);

    return {
      allowed: remaining > 0,
      remaining,
      retryAfterMs,
      retryAfterSec: Math.ceil(retryAfterMs / 1000),
    };
  };

  const record = (key = "global") => {
    const now = Date.now();
    const id = bucketKey(key);
    const timestamps = prune(buckets.get(id) ?? [], now);
    timestamps.push(now);
    buckets.set(id, timestamps);
    return check(key);
  };

  const reset = (key = "global") => {
    buckets.delete(bucketKey(key));
  };

  const assertAllowed = (key = "global", message) => {
    const status = check(key);
    if (!status.allowed) {
      const err = new Error(
        message ||
          `Too many attempts. Try again in ${status.retryAfterSec} second(s).`
      );
      err.code = "rate_limited";
      err.retryAfterMs = status.retryAfterMs;
      throw err;
    }
    return status;
  };

  return { check, record, reset, assertAllowed };
};

/** Login: 5 failed attempts per 15 minutes per email. */
export const loginRateLimiter = createRateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  keyPrefix: "login",
});

/** Mutations (create report, etc.): 10 per minute per user. */
export const mutationRateLimiter = createRateLimiter({
  maxAttempts: 10,
  windowMs: 60_000,
  keyPrefix: "mutation",
});
