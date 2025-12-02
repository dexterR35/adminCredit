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
      // Skip disabled fields from validation
      if (field.disabled) {
        schema[field.name] = Yup.string();
        return schema;
      }

      // Determine validator type based on field type and as prop
      let validator;
      
      if (field.as === "date") {
        validator = Yup.date().nullable();
      } else if (field.type === "number" || field.as === "number") {
        validator = Yup.number().nullable();
      } else if (field.type === "email") {
        validator = Yup.string().email("Invalid email address");
      } else if (field.as === "textarea") {
        validator = Yup.string();
      } else {
        validator = Yup.string();
      }

      // Apply required validation
      if (field.required) {
        if (field.as === "date") {
          validator = validator.required("This field is required");
        } else if (field.type === "number" || field.as === "number") {
          validator = validator.required("This field is required").typeError("Must be a number");
        } else {
          validator = validator.required("This field is required");
        }
      } else {
        // Optional fields can be empty
        validator = validator.nullable();
      }

      // Add CNP validation (Romanian ID - 13 digits)
      if (field.name.includes("CNP") || field.name.includes("cnp")) {
        validator = validator.matches(/^\d{13}$/, "CNP must be exactly 13 digits");
      }

      // Add phone validation
      if (field.name.includes("phone") || field.name.includes("Phone")) {
        validator = validator.matches(/^[\d\s\/\-+()]+$/, "Invalid phone number format");
      }

      schema[field.name] = validator;
      
      // Handle details field if present
      if (field.details) {
        let detailsValidator = Yup.string();
        if (field.details.required) {
          detailsValidator = detailsValidator.required("This field is required");
        } else {
          detailsValidator = detailsValidator.nullable();
        }
        schema[field.details.name] = detailsValidator;
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
                      className="text-sm font-medium text-slate-300 flex items-center w-full mb-1"
                    >
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {field.as === "input" && (
                      <Field
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder || ""}
                        className={`text-sm px-4 py-2.5 border border-slate-700/50 rounded-lg w-full bg-slate-800/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
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
                        className={`w-full text-sm px-4 py-2.5 border border-slate-700/50 rounded-lg bg-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          field.selectClassName || ""
                        } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={field.disabled || false}
                      >
                        {field.options && field.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value} className="bg-slate-800 text-slate-100">
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
                        className={`text-sm px-4 py-2.5 border border-slate-700/50 rounded-lg w-full bg-slate-800/50 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
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
                        className={`text-sm px-4 py-2.5 border border-slate-700/50 rounded-lg w-full bg-slate-800/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none ${
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
                        className="text-sm font-medium text-slate-300 capitalize mb-1"
                      >
                        {field.details.label}
                        {field.details.required && <span className="text-red-400 ml-1">*</span>}
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
                        className="px-4 py-2.5 text-sm border border-slate-700/50 rounded-lg w-full bg-slate-800/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
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

