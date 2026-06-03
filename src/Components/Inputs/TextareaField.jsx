import PropTypes from "prop-types";
import FormField from "./FormField";
import Textarea from "./Textarea";

const TextareaField = ({
  label,
  id,
  name,
  required = false,
  error,
  hint,
  rows = 3,
  className = "",
  fieldClassName = "",
  ...textareaProps
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
      <Textarea
        id={fieldId}
        name={name}
        required={required}
        error={error}
        rows={rows}
        className={className}
        {...textareaProps}
      />
    </FormField>
  );
};

TextareaField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  hint: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
  fieldClassName: PropTypes.string,
};

export default TextareaField;
