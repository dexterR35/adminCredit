import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { hasFisaDraftData, saveFisaDraft, clearFisaDraft } from "./fisaReportDraft";

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

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!userId) return undefined;

    if (!isDirty) {
      clearFisaDraft(userId);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      saveFisaDraft(userId, {
        values,
        currentStep,
        maxStepReached,
        isAdmin,
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [userId, isAdmin, values, currentStep, maxStepReached, isDirty]);

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
