import { INITIAL_VALUES } from "./fisaReportFormConfig";

const DRAFT_PREFIX = "fisa_report_draft_";
const DRAFT_IGNORE = new Set(["userStatus", "todayDate"]);
const DRAFT_TTL_MS = 12 * 60 * 60 * 1000;

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

const getSessionDraftStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const getLegacyDraftStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const removeDraft = (userId) => {
  if (!userId) return;
  const key = getFisaDraftStorageKey(userId);
  getSessionDraftStorage()?.removeItem(key);
  getLegacyDraftStorage()?.removeItem(key);
};

export const loadFisaDraft = (userId) => {
  if (!userId) return null;

  try {
    const storage = getSessionDraftStorage();
    if (!storage) return null;

    const key = getFisaDraftStorageKey(userId);
    let raw = storage.getItem(key);

    // Migrate older persistent drafts, then remove the localStorage copy.
    if (!raw) {
      const legacyStorage = getLegacyDraftStorage();
      raw = legacyStorage?.getItem(key);
      if (raw) {
        storage.setItem(key, raw);
        legacyStorage?.removeItem(key);
      }
    }

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.userId !== userId) return null;
    if (Number.isFinite(parsed.savedAt) && Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      removeDraft(userId);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const saveFisaDraft = (userId, { values, currentStep, maxStepReached, isAdmin }) => {
  if (!userId || !values) return;

  try {
    const storage = getSessionDraftStorage();
    if (!storage) return;

    storage.setItem(
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
  removeDraft(userId);
};
