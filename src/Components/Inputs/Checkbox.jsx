import PropTypes from "prop-types";
import { CHECKBOX_BASE } from "./inputStyles";

const Checkbox = ({
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  className = "",
  ...props
}) => {
  const fieldId = id || name;

  return (
    <label
      htmlFor={fieldId}
      className={`inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-700 ${disabled ? "cursor-not-allowed opacity-70" : ""} ${className}`}
    >
      <input
        id={fieldId}
        type="checkbox"
        name={name}
        checked={Boolean(checked)}
        onChange={onChange}
        disabled={disabled}
        className={CHECKBOX_BASE}
        {...props}
      />
      {label && <span className="select-none">{label}</span>}
    </label>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Checkbox;
