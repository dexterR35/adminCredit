import { sanitizePhone } from "./sanitize";

/** Open a sanitized tel: link (blocks injection via phone strings). */
export function openTelLink(phone) {
  const safe = sanitizePhone(String(phone ?? ""));
  if (!safe) return;

  const dial = safe.replace(/\s/g, "");
  if (!dial) return;

  window.open(`tel:${encodeURIComponent(dial)}`);
}
