import { APP_DATE_LOCALE } from "./date";
import { toLocalDateInputValue } from "./followUpDates";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const getReminderDateKey = (followUpAt) => {
  if (!followUpAt) return "";
  const date = new Date(followUpAt);
  return Number.isNaN(date.getTime()) ? "" : toLocalDateInputValue(date);
};

export const formatCalendarMonthTitle = (year, month) => {
  const date = new Date(year, month, 1);
  const label = date.toLocaleDateString(APP_DATE_LOCALE, {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const buildMonthGrid = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);

  const weeks = [];
  const cursor = new Date(gridStart);

  for (let week = 0; week < 6; week += 1) {
    const days = [];
    for (let day = 0; day < 7; day += 1) {
      days.push({
        date: new Date(cursor),
        dateKey: toLocalDateInputValue(cursor),
        inCurrentMonth: cursor.getMonth() === month,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(days);
  }

  return weeks;
};

export const groupRemindersByDate = (reminders = []) => {
  const map = new Map();
  reminders.forEach((reminder) => {
    const key = getReminderDateKey(reminder.follow_up_at);
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(reminder);
  });

  map.forEach((items) => {
    items.sort((a, b) => a.follow_up_at.localeCompare(b.follow_up_at));
  });

  return map;
};

export { WEEKDAY_LABELS };
