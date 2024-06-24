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
  formCustomClass,
  submitButtonText,
  buttonCustomClass
}) => {
  const { validationSchema, handleSubmit } = useCustomForm({
    initialValues,
    onSubmit,
    fields
  });

  return (
    <div className="mx-auto">
      <div className="max-w-7xl">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form className={`${formCustomClass}`}>
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
                      className="text-sm flex items-center w-1/2"
                    >
                      {field.label}
                    </label>
                    {field.as === "input" && (
                      <Field
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder || ""}
                        className={`text-sm p-2 border rounded-md w-full focus:outline-none focus:border-green-500 ${
                          field.inputClass || ""
                        }`}
                        disabled={field.disabled || false}
                      />
                    )}
                    {field.as === "select" && (
                      <Field
                        as="select"
                        id={field.name}
                        name={field.name}
                        className={`w-full text-sm p-2 border rounded-md ${
                          field.selectClassName || ""
                        } focus:outline-none focus:border-green-500`}
                      >
                        {field.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value}>
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
                        className="text-sm p-2 border rounded-md w-full focus:outline-none focus:border-green-500"
                      />
                    )}
                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {field.details && (
                    <div className="flex flex-col items-start justify-start w-full gap-2">
                      <label
                        htmlFor={field.details.name}
                        className="text-sm capitalize"
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
                        className="p-2 text-sm border rounded-md w-full focus:outline-none focus:border-green-500 resize-none"
                      />
                      <ErrorMessage
                        name={field.details.name}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="col-span-full w-full">
                <CustomButton
                  disabled={isSubmitting}
                  additionalClasses={`p-2 w-52 ${buttonCustomClass}`}
                  text={isSubmitting ? "Wait..." : submitButtonText}
                  type="submit"
                  buttonType="submit"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FormInput;

