import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../Buttons";
import FormField from "../Inputs/FormField";
import FormikControl from "../Inputs/FormikControl";
import Input from "../Inputs/Input";
import { buildValidationSchemaFromFields } from "../../utils/formValidation";
import { buildFieldTypeMap, sanitizeFormValues } from "../../utils/sanitize";

const useCustomForm = ({ onSubmit, fields, showSuccessToast }) => {
  const validationSchema = buildValidationSchemaFromFields(fields);
  const fieldTypeMap = buildFieldTypeMap(fields);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const sanitizedValues = sanitizeFormValues(values, fieldTypeMap);
      await onSubmit(sanitizedValues);
      if (showSuccessToast) {
        toast.success("Form submitted successfully!");
      }
      resetForm();
    } catch (error) {
      const message = error?.message || "An error occurred. Please try again.";
      toast.error(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { validationSchema, handleSubmit };
};

const FormInput = ({
  initialValues,
  onSubmit,
  fields,
  formCustomClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full",
  submitButtonText = "Submit",
  buttonCustomClass = "",
  showSubmitButton = true,
  showSuccessToast = true,
  onSubmitSuccess,
  onSubmitError,
}) => {
  const { validationSchema, handleSubmit } = useCustomForm({
    onSubmit,
    fields,
    showSuccessToast,
  });

  const handleFormSubmit = async (values, formikHelpers) => {
    try {
      await handleSubmit(values, formikHelpers);
      onSubmitSuccess?.(values);
    } catch (error) {
      onSubmitError?.(error);
    }
  };

  return (
    <div className="mx-auto">
      <div className="max-w-7xl">
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className={formCustomClass}>
              {fields.map((field, index) => (
                <div
                  key={field.name || index}
                  className={`flex w-full rounded-md field_${index} my-[3px] ${field.details ? "gap-4" : "_s"}`}
                >
                  <FormField
                    label={field.label}
                    htmlFor={field.name}
                    required={field.required}
                    error={touched[field.name] && errors[field.name]}
                    className="w-full"
                  >
                    <Field name={field.name}>
                      {({ field: formikField, form }) => (
                        <FormikControl field={formikField} form={form} config={field} />
                      )}
                    </Field>
                  </FormField>

                  {field.details && (
                    <FormField
                      label={field.details.label}
                      htmlFor={field.details.name}
                      required={field.details.required}
                      error={touched[field.details.name] && errors[field.details.name]}
                      className="w-full capitalize"
                    >
                      <Field name={field.details.name}>
                        {({ field: formikField, form }) => (
                          <Input
                            id={field.details.name}
                            name={formikField.name}
                            value={formikField.value ?? ""}
                            onChange={formikField.onChange}
                            onBlur={formikField.onBlur}
                            type={field.details.type || "text"}
                            placeholder={field.details.placeholder || ""}
                            error={form.touched[field.details.name] && form.errors[field.details.name]}
                          />
                        )}
                      </Field>
                    </FormField>
                  )}
                </div>
              ))}

              {showSubmitButton && (
                <div className="col-span-full w-full">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    loadingText="Wait..."
                    text={submitButtonText}
                    className={`w-52 ${buttonCustomClass}`}
                  />
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const formFieldShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  required: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  details: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.node,
    required: PropTypes.bool,
    type: PropTypes.string,
    placeholder: PropTypes.string,
  }),
});

FormInput.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(formFieldShape).isRequired,
  formCustomClass: PropTypes.string,
  submitButtonText: PropTypes.string,
  buttonCustomClass: PropTypes.string,
  showSubmitButton: PropTypes.bool,
  showSuccessToast: PropTypes.bool,
  onSubmitSuccess: PropTypes.func,
  onSubmitError: PropTypes.func,
};

export default FormInput;
