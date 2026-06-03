import { forwardRef } from "react";
import PropTypes from "prop-types";
import { inputClassName } from "./inputStyles";
import { createSanitizedHandlers } from "./inputSanitize";

const Textarea = forwardRef(function Textarea(
  {
    className = "",
    error = false,
    rows = 3,
    name,
    onChange,
    onBlur,
    ...props
  },
  ref
) {
  const handlers = createSanitizedHandlers({
    type: "textarea",
    onChange,
    onBlur,
  });

  return (
    <textarea
      ref={ref}
      rows={rows}
      name={name}
      className={inputClassName({ error, disabled: props.disabled, className, multiline: true })}
      {...props}
      {...handlers}
    />
  );
});

Textarea.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  rows: PropTypes.number,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Textarea;
