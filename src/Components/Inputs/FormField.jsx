import PropTypes from "prop-types";
import { FormField as UiFormField } from "../uiCheck";

const FormField = ({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className = "",
}) => (
  <UiFormField
    label={label}
    htmlFor={htmlFor}
    required={required}
    error={error}
    hint={hint}
    className={className}
  >
    {children}
  </UiFormField>
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

export default FormField;
