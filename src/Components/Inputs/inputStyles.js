import { inputClassName as uiInputClassName } from "../uiCheck";

export const INPUT_BASE = "input";
export const INPUT_ERROR = "input--error";
export const INPUT_DISABLED = "input--disabled";
export const CHECKBOX_BASE = "checkbox-input";

export const inputClassName = ({
  error = false,
  disabled = false,
  className = "",
  multiline = false,
} = {}) =>
  uiInputClassName({ error, disabled, className, multiline });

export const optionsFromEntries = (entries) =>
  Object.entries(entries).map(([value, label]) => ({ value, label }));
