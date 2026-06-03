import PropTypes from "prop-types";
import FormField from "./FormField";
import Input from "./Input";

const InputField = ({
  label,
  id,
  name,
  required = false,
  error,
  hint,
  className = "",
  fieldClassName = "",
  ...inputProps
}) => {
  const fieldId = id || name;

  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      required={required}
      error={error}
      hint={hint}
      className={fieldClassName}
    >
      <Input id={fieldId} name={name} required={required} error={error} className={className} {...inputProps} />
    </FormField>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  className: PropTypes.string,
  fieldClassName: PropTypes.string,
};

export default InputField;
