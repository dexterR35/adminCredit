import { sanitizeByInputType } from "../../utils/sanitize";

export function createSanitizedHandlers({
  type = "text",
  onChange,
  onBlur,
}) {
  const applyChange = (event, trim = false) => {
    const sanitized = sanitizeByInputType(event.target.value, type, { trim });

    if (sanitized !== event.target.value) {
      onChange?.({
        ...event,
        target: { ...event.target, value: sanitized, name: event.target.name },
      });
      return;
    }

    onChange?.(event);
  };

  return {
    onChange: (event) => applyChange(event, false),
    onBlur: (event) => {
      applyChange(event, true);
      onBlur?.(event);
    },
  };
}
