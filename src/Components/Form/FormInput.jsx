import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomButton } from "../Buttons/Buttons";

const useCustomForm = ({ initialValues, onSubmit, fields }) => {
  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape(
    fields.reduce((schema, field) => {
      let validator = Yup.string();
      if (field.required) {
        validator = validator.required("This field is required");
      }
      if (field.type === "email") {
        validator = validator.email("Invalid email address");
      }
      if (field.type === "number") {
        validator = validator.number("Must be a number");
      }
      // Add more validations as needed

      schema[field.name] = validator;
      if (field.details) {
        schema[field.details.name] = validator;
      }
      return schema;
    }, {})
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await onSubmit(values);
      toast.success("Form submitted successfully!");
      resetForm();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
  onSubmitSuccess,
  onSubmitError,
}) => {
  const { validationSchema, handleSubmit } = useCustomForm({
    initialValues,
    onSubmit,
    fields
  });

  const handleFormSubmit = async (values, formikHelpers) => {
    try {
      await handleSubmit(values, formikHelpers);
      if (onSubmitSuccess) {
        onSubmitSuccess(values);
      }
    } catch (error) {
      if (onSubmitError) {
        onSubmitError(error);
      }
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
          {({ isSubmitting }) => (
            <Form className={formCustomClass}>
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={`flex w-full rounded-md field_${index} my-[3px] ${
                    field.details ? "gap-4" : "_s"
                  }`}
                >
                  <div className="w-full flex flex-col gap-2 items-start justify-start">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-300 flex items-center w-full mb-1"
                    >
                      {field.label}
                    </label>
                    {field.as === "input" && (
                      <Field
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder || ""}
                        className={`text-sm px-4 py-2.5 border border-gray-600 rounded-lg w-full bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          field.inputClass || ""
                        } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={field.disabled || false}
                      />
                    )}
                    {field.as === "select" && (
                      <Field
                        as="select"
                        id={field.name}
                        name={field.name}
                        className={`w-full text-sm px-4 py-2.5 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          field.selectClassName || ""
                        } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={field.disabled || false}
                      >
                        {field.options && field.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value} className="bg-gray-900">
                            {option.label}
                          </option>
                        ))}
                      </Field>
                    )}
                    {field.as === "date" && (
                      <Field
                        id={field.name}
                        name={field.name}
                        type="date"
                        placeholder={field.placeholder || ""}
                        className={`text-sm px-4 py-2.5 border border-gray-600 rounded-lg w-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          field.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={field.disabled || false}
                      />
                    )}
                    {field.as === "textarea" && (
                      <Field
                        as="textarea"
                        id={field.name}
                        name={field.name}
                        rows={field.rows || 3}
                        placeholder={field.placeholder || ""}
                        className={`text-sm px-4 py-2.5 border border-gray-600 rounded-lg w-full bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none ${
                          field.inputClass || ""
                        } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={field.disabled || false}
                      />
                    )}
                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="text-red-400 text-xs mt-1"
                    />
                  </div>
                  {field.details && (
                    <div className="flex flex-col items-start justify-start w-full gap-2">
                      <label
                        htmlFor={field.details.name}
                        className="text-sm font-medium text-gray-300 capitalize mb-1"
                      >
                        {field.details.label}
                      </label>

                      <Field
                        id={field.details.name}
                        name={field.details.name}
                        type={field.details.type || "text"}
                        placeholder={
                          field.details.placeholder || "default"
                        }
                        as={field.details.as || "input"}
                        rows={field.details.rows || 1}
                        className="px-4 py-2.5 text-sm border border-gray-600 rounded-lg w-full bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                      />
                      <ErrorMessage
                        name={field.details.name}
                        component="div"
                        className="text-red-400 text-xs mt-1"
                      />
                    </div>
                  )}
                </div>
              ))}
              {showSubmitButton && (
                <div className="col-span-full w-full">
                  <CustomButton
                    disabled={isSubmitting}
                    additionalClasses={`p-2 w-52 ${buttonCustomClass}`}
                    text={isSubmitting ? "Wait..." : submitButtonText}
                    type="submit"
                    buttonType="submit"
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

export default FormInput;

