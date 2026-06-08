/** App-wide date/time locale */
export const APP_DATE_LOCALE = "en-GB";

const toValidDate = (value) => {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** e.g. 8 Jun 2026 */
export const formatRoDate = (value = new Date()) => {
  const date = toValidDate(value);
  if (!date) return String(value);

  return date.toLocaleDateString(APP_DATE_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/** e.g. 14:30 */
export const formatRoTime = (value = new Date()) => {
  const date = toValidDate(value);
  if (!date) return String(value);

  return date.toLocaleTimeString(APP_DATE_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/** e.g. 8 Jun 2026, 14:30 */
export const formatRoDateTime = (value) => {
  const date = toValidDate(value);
  if (!date) return String(value ?? "—");

  return date.toLocaleString(APP_DATE_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/** Today's date label */
export const formatRoToday = () => formatRoDate(new Date());

/** Shared date formatting for tables and detail views */
export const FormatTimestamp = (value) => {
  if (!value) return formatRoDateTime(new Date());

  const date = toValidDate(value);
  if (!date) return String(value);

  return date.toLocaleString(APP_DATE_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
