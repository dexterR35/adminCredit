import { forwardRef } from "react";
import PropTypes from "prop-types";
import { inputClassName } from "./inputStyles";
import { createSanitizedHandlers } from "./inputSanitize";
import { inferSanitizeType } from "../../utils/sanitize";

const Input = forwardRef(function Input(
  {
    className = "",
    error = false,
    type = "text",
    name,
    sanitizeType,
    onChange,
    onBlur,
    ...props
  },
  ref
) {
  const resolvedType = sanitizeType || inferSanitizeType(name, type);
  const handlers = createSanitizedHandlers({
    type: resolvedType,
    onChange,
    onBlur,
  });

  return (
    <input
      ref={ref}
      type={type}
      name={name}
      className={inputClassName({ error, disabled: props.disabled, className })}
      {...props}
      {...handlers}
    />
  );
});

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  type: PropTypes.string,
  name: PropTypes.string,
  sanitizeType: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Input;
