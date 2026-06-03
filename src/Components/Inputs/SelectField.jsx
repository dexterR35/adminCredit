import PropTypes from "prop-types";
import FormField from "./FormField";
import Select from "./Select";

const SelectField = ({
  label,
  id,
  name,
  required = false,
  error,
  hint,
  options = [],
  placeholder = "Select an option",
  className = "",
  fieldClassName = "",
  ...selectProps
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
      <Select
        id={fieldId}
        name={name}
        required={required}
        error={error}
        options={options}
        placeholder={placeholder}
        className={className}
        {...selectProps}
      />
    </FormField>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  fieldClassName: PropTypes.string,
};

export default SelectField;
