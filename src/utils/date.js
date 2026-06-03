/** Shared date formatting for tables and detail views */
export const FormatTimestamp = (value) => {
  if (!value) return new Date().toLocaleString("ro-RO");

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour12: true,
  });
};
