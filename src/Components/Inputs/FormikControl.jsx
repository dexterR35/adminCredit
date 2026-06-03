import PropTypes from "prop-types";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

/**
 * Renders the correct control for a Formik field config.
 * Used by FormInput and any custom Formik forms.
 */
const FormikControl = ({ field, form, config }) => {
  const { name, value, onChange, onBlur } = field;
  const touched = form.touched[name];
  const formError = form.errors[name];
  const error = touched && formError ? formError : undefined;
  const disabled = config.disabled || false;

  const commonProps = {
    id: name,
    name,
    value: value ?? "",
    onChange,
    onBlur,
    disabled,
    error,
    placeholder: config.placeholder || "",
    className: config.inputClass || config.selectClassName || "",
  };

  switch (config.as) {
    case "select":
      return (
        <Select
          {...commonProps}
          options={config.options || []}
          placeholder={config.placeholder || "Select an option"}
        />
      );
    case "textarea":
      return <Textarea {...commonProps} rows={config.rows || 3} />;
    case "date":
      return <Input {...commonProps} type="date" />;
    case "number":
      return <Input {...commonProps} type="number" />;
    case "input":
    default:
      return <Input {...commonProps} type={config.type || "text"} />;
  }
};

FormikControl.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

export default FormikControl;
