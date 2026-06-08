/** Date/time helpers for client follow-up reminders */

import {
  APP_DATE_LOCALE,
  formatRoDate,
  formatRoDateTime,
  formatRoToday,
} from "./date";

const toDateTime = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatFollowUpDateTime = formatRoDateTime;

export const formatTodayLabel = formatRoToday;

/** Local YYYY-MM-DD for date inputs (avoids UTC off-by-one). */
export const toLocalDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Today's date (local) — earliest allowed reminder date. */
export const getTodayFollowUpDate = () => toLocalDateInputValue(new Date());

export const isFollowUpDateAllowed = (dateValue) => {
  if (!dateValue) return false;
  return dateValue >= getTodayFollowUpDate();
};

export const createEmptyFollowUpDraft = () => ({
  date: "",
  time: "",
  note: "",
});

/** Build edit draft from a saved follow_up_at value. */
export const followUpAtToDraft = (followUpAt, note = "") => {
  const date = toDateTime(followUpAt);
  if (!date) return createEmptyFollowUpDraft();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return {
    date: toLocalDateInputValue(date),
    time: `${hours}:${minutes}`,
    note: note || "",
  };
};

export const hasFollowUpDraftContent = (draft) =>
  Boolean(draft?.date?.trim() && draft?.time?.trim());

export const combineDateAndTime = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return null;
  const combined = new Date(`${dateValue}T${timeValue}:00`);
  return Number.isNaN(combined.getTime()) ? null : combined.toISOString();
};

export const isFollowUpInFuture = (followUpAt) => {
  const date = toDateTime(followUpAt);
  if (!date) return false;
  return date.getTime() > Date.now();
};

export const validateFollowUpDraft = (draft) => {
  if (!hasFollowUpDraftContent(draft)) {
    return { shouldSave: false };
  }

  if (!isFollowUpDateAllowed(draft.date)) {
    return {
      shouldSave: true,
      valid: false,
      error: "Date must be today or later.",
    };
  }

  const followUpAt = combineDateAndTime(draft.date, draft.time);
  if (!followUpAt) {
    return {
      shouldSave: true,
      valid: false,
      error: "Invalid date or time.",
    };
  }

  if (!isFollowUpInFuture(followUpAt)) {
    return {
      shouldSave: true,
      valid: false,
      error: "Reminder must be scheduled in the future.",
    };
  }

  return { shouldSave: true, valid: true, followUpAt };
};

/** Default time: 30 minutes from now (local). */
export const getDefaultFollowUpTime = () => {
  const next = new Date();
  next.setMinutes(next.getMinutes() + 30);
  const hours = String(next.getHours()).padStart(2, "0");
  const minutes = String(next.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const isFollowUpDue = (followUpAt) => {
  const date = toDateTime(followUpAt);
  if (!date) return false;
  return date.getTime() <= Date.now();
};

/** @deprecated use getTodayFollowUpDate */
export const getMinFollowUpDate = getTodayFollowUpDate;

export { APP_DATE_LOCALE, formatRoDate };
