import { INITIAL_VALUES } from "./fisaReportFormConfig";

const DRAFT_PREFIX = "fisa_report_draft_";
const DRAFT_IGNORE = new Set(["userStatus", "todayDate"]);

const normalize = (value) =>
  value === null || value === undefined ? "" : String(value).trim();

export const getFisaDraftStorageKey = (userId) => `${DRAFT_PREFIX}${userId}`;

/** True when the user has entered data beyond the empty baseline. */
export const hasFisaDraftData = (values, baseline) => {
  if (!values || !baseline) return false;

  return Object.keys(INITIAL_VALUES).some((key) => {
    if (DRAFT_IGNORE.has(key)) return false;
    return normalize(values[key]) !== normalize(baseline[key]);
  });
};

const getDraftStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return window.sessionStorage;
  }
};

export const loadFisaDraft = (userId) => {
  if (!userId) return null;

  try {
    const storage = getDraftStorage();
    const key = getFisaDraftStorageKey(userId);
    let raw = storage.getItem(key);

    // Migrate older session-only drafts.
    if (!raw) {
      raw = window.sessionStorage.getItem(key);
      if (raw) {
        storage.setItem(key, raw);
        window.sessionStorage.removeItem(key);
      }
    }

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.userId !== userId) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const saveFisaDraft = (userId, { values, currentStep, maxStepReached, isAdmin }) => {
  if (!userId || !values) return;

  try {
    getDraftStorage().setItem(
      getFisaDraftStorageKey(userId),
      JSON.stringify({
        userId,
        isAdmin: Boolean(isAdmin),
        values,
        currentStep,
        maxStepReached,
        savedAt: Date.now(),
      })
    );
  } catch (error) {
    console.warn("Could not save fisa report draft:", error);
  }
};

export const clearFisaDraft = (userId) => {
  if (!userId) return;
  const key = getFisaDraftStorageKey(userId);
  getDraftStorage().removeItem(key);
  window.sessionStorage.removeItem(key);
};
