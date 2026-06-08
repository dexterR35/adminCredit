import { sanitizePhone } from "./sanitize";

/** Romanian mobile: 10 digits starting with 07 (e.g. 0765965155) */
export const ROMANIAN_MOBILE_PHONE_PATTERN = /^07\d{8}$/;

export const ROMANIAN_MOBILE_PHONE_MESSAGE =
  "Phone must be 10 digits starting with 07 (e.g. 0765965155)";

export const ROMANIAN_MOBILE_PHONE_PLACEHOLDER = "0765965155";

/** Strip to digits only. */
export function normalizeRomanianMobilePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function isValidRomanianMobilePhone(value) {
  return ROMANIAN_MOBILE_PHONE_PATTERN.test(normalizeRomanianMobilePhone(value));
}

export function validateRomanianMobilePhone(value, { required = true } = {}) {
  const digits = normalizeRomanianMobilePhone(value);

  if (!digits) {
    return required
      ? { valid: false, value: "", error: "Phone is required" }
      : { valid: true, value: "", error: null };
  }

  if (!ROMANIAN_MOBILE_PHONE_PATTERN.test(digits)) {
    return { valid: false, value: digits, error: ROMANIAN_MOBILE_PHONE_MESSAGE };
  }

  return { valid: true, value: digits, error: null };
}

/** Normalize and validate; throws on invalid. */
export function assertRomanianMobilePhone(value, { required = true } = {}) {
  const result = validateRomanianMobilePhone(value, { required });
  if (!result.valid) {
    throw new Error(result.error);
  }
  return result.value;
}

/** Open a sanitized tel: link (blocks injection via phone strings). */
export function openTelLink(phone) {
  const safe = sanitizePhone(String(phone ?? ""));
  if (!safe) return;

  const dial = safe.replace(/\s/g, "");
  if (!dial) return;

  window.location.href = `tel:${encodeURIComponent(dial)}`;
}
