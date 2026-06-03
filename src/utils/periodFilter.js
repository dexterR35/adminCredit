/** Client-side period filter (matches HomeTable / dashboard stats) */
export const filterRowsByPeriod = (rows, period, dateKey = "created_at") => {
  if (!period || period === "all") return rows;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const cutoff =
    period === "today"
      ? startOfDay
      : period === "week"
        ? startOfWeek
        : period === "month"
          ? startOfMonth
          : null;

  if (!cutoff) return rows;

  return rows.filter((row) => {
    const raw = row[dateKey] ?? row.submitted_at;
    const date = new Date(raw);
    return !Number.isNaN(date.getTime()) && date >= cutoff;
  });
};
