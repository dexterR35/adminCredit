import { forwardRef } from "react";
import PropTypes from "prop-types";
import { cx } from "./utils";

export const fieldClassName = ({ className = "" } = {}) => cx("input-wrap", className);

export const inputClassName = ({
  error = false,
  disabled = false,
  className = "",
  multiline = false,
} = {}) =>
  cx(
    "input",
    error && "input--error",
    disabled && "input--disabled",
    multiline && "input--textarea",
    className
  );

export const FormField = ({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className = "",
}) => (
  <div className={fieldClassName({ className })}>
    {label && (
      <label htmlFor={htmlFor} className="input-label">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
    )}
    {children}
    {error && <p className="input-error">{error}</p>}
    {hint && !error && <p className="input-hint">{hint}</p>}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const Input = forwardRef(function Input(
  {
    className = "",
    error = false,
    disabled = false,
    as: Component = "input",
    label,
    hint,
    id,
    name,
    required = false,
    ...props
  },
  ref
) {
  const multiline = Component === "textarea";
  const control = (
    <Component
      ref={ref}
      id={id || name}
      name={name}
      disabled={disabled}
      required={required}
      className={inputClassName({ error, disabled, className, multiline })}
      {...props}
    />
  );

  if (!label && !hint && !error) return control;

  return (
    <FormField
      label={label}
      htmlFor={id || name}
      required={required}
      error={error}
      hint={hint}
    >
      {control}
    </FormField>
  );
});

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  as: PropTypes.elementType,
  label: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
};

export const Select = forwardRef(function Select(
  {
    className = "",
    error = false,
    disabled = false,
    options = [],
    placeholder,
    children,
    label,
    hint,
    id,
    name,
    required = false,
    ...props
  },
  ref
) {
  const control = (
    <select
      ref={ref}
      id={id || name}
      name={name}
      disabled={disabled}
      required={required}
      className={inputClassName({ error, disabled, className })}
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

  if (!label && !hint && !error) return control;

  return (
    <FormField
      label={label}
      htmlFor={id || name}
      required={required}
      error={error}
      hint={hint}
    >
      {control}
    </FormField>
  );
});

Select.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  hint: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
};

export const Checkbox = ({
  label,
  id,
  name,
  checked,
  onChange,
  disabled = false,
  className = "",
  ...props
}) => (
  <label className={cx("checkbox-wrap", disabled && "checkbox-wrap--disabled", className)}>
    <input
      id={id || name}
      type="checkbox"
      name={name}
      checked={Boolean(checked)}
      onChange={onChange}
      disabled={disabled}
      className="checkbox-input"
      {...props}
    />
    {label && <span>{label}</span>}
  </label>
);

Checkbox.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
