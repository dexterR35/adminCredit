/** Shared date formatting for tables and detail views */
export const FormatTimestamp = (value) => {
  if (!value) return new Date().toLocaleString("en-GB");

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour12: true,
  });
};
