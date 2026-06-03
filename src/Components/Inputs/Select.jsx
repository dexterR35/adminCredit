import { forwardRef } from "react";
import PropTypes from "prop-types";
import { inputClassName } from "./inputStyles";
import { sanitizeText } from "../../utils/sanitize";

const Select = forwardRef(function Select(
  { className = "", error = false, options = [], placeholder, children, onChange, ...props },
  ref
) {
  const handleChange = (event) => {
    const sanitized = sanitizeText(event.target.value, { maxLength: 200, trim: true });
    if (sanitized !== event.target.value) {
      onChange?.({
        ...event,
        target: { ...event.target, value: sanitized, name: event.target.name },
      });
      return;
    }
    onChange?.(event);
  };

  return (
    <select
      ref={ref}
      className={inputClassName({ error, disabled: props.disabled, className })}
      onChange={handleChange}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {children}
    </select>
  );
});

Select.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Select;
