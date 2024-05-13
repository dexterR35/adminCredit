import React from "react";
import { Formik, Form, Field } from "formik";
import { CustomButton } from "../Buttons/Buttons";

const FormInput = ({
  initialValues,
  onSubmit,
  fields,
  customClass,
  submitButtonText,
}) => {
  return (
    <div className="mx-auto">
      <div className="max-w-7xl">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className={`${customClass}`}>
              {fields.map((field, index) => (
                <div key={index} className={`flex field_${index} ${
                  field.details ? "flex-row" : ""}`}>
                  <div className="w-full">
                    <label
                      htmlFor={field.name}
                      className="mb-1 text-md font-medium flex items-center"
                    >
                      {field.label}
                    </label>
                    {field.as === "input" && (
                      <Field
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder || ""}
                        className={`p-2 border rounded-md w-full focus:outline-none focus:border-blue-500 ${
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
                        className={`p-2 border rounded-md ${
                          field.selectClassName || ""
                        } focus:outline-none focus:border-blue-500`}
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
                        className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                  {field.details && (
                    <div className="flex flex-col items-center justify-end w-full">
                      <label
                        htmlFor={field.details.name}
                        className="mb-1 text-md font-medium"
                      >
                        {field.details.label}
                      </label>

                      <Field
                        id={field.details.name}
                        name={field.details.name}
                        type={field.details.type || "text"}
                        placeholder={field.details.placeholder || ""}
                        as={field.details.as || "input"}
                        rows={field.details.rows || 2}
                        className="p-2 border rounded-md w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="col-span-full">
                <CustomButton
                  disabled={isSubmitting}
                  additionalClasses="p-2 w-52"
                  text={isSubmitting ? "Saving..." : submitButtonText}
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
