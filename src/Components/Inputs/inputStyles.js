export const INPUT_BASE = "dash-input";
export const INPUT_ERROR = "border-red-300 focus:border-red-500 focus:ring-red-100";
export const INPUT_DISABLED = "cursor-not-allowed opacity-50 bg-gray-50";
export const CHECKBOX_BASE = "dash-checkbox";

export const inputClassName = ({
  error = false,
  disabled = false,
  className = "",
  multiline = false,
} = {}) =>
  [
    INPUT_BASE,
    multiline ? "h-auto resize-none" : "",
    error ? INPUT_ERROR : "",
    disabled ? INPUT_DISABLED : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

export const optionsFromEntries = (entries) =>
  Object.entries(entries).map(([value, label]) => ({ value, label }));
