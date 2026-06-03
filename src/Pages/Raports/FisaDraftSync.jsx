import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { hasFisaDraftData, saveFisaDraft, clearFisaDraft } from "./fisaReportDraft";
import { useDebouncedCallback } from "../../hooks/useDebounce";

const DRAFT_SAVE_DELAY_MS = 250;

const FisaDraftSync = ({
  userId,
  isAdmin,
  baseline,
  currentStep,
  maxStepReached,
  onDirtyChange,
}) => {
  const { values } = useFormikContext();

  const isDirty = useMemo(
    () => hasFisaDraftData(values, baseline),
    [values, baseline]
  );

  const saveDraft = useDebouncedCallback(
    (draftUserId, draft) => {
      saveFisaDraft(draftUserId, draft);
    },
    DRAFT_SAVE_DELAY_MS,
    []
  );

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!userId) return undefined;

    if (!isDirty) {
      saveDraft.cancel();
      clearFisaDraft(userId);
      return undefined;
    }

    saveDraft(userId, {
      values,
      currentStep,
      maxStepReached,
      isAdmin,
    });
  }, [userId, isAdmin, values, currentStep, maxStepReached, isDirty, saveDraft]);

  return null;
};

FisaDraftSync.propTypes = {
  userId: PropTypes.string,
  isAdmin: PropTypes.bool,
  baseline: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  maxStepReached: PropTypes.number.isRequired,
  onDirtyChange: PropTypes.func.isRequired,
};

export default FisaDraftSync;
