import React from "react";
import { Formik, Form, Field } from "formik";
import { CustomButton } from "../Buttons/Buttons";

const FormInput = ({
  initialValues,
  onSubmit,
  fields,
  formCustomClass,
  submitButtonText,
  buttonCustomClass
}) => {
  return (
    <div className="mx-auto">
      <div className="max-w-7xl">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form className={`${formCustomClass}`}>
              {fields.map((field, index) => (
                <div key={index} className={`flex w-full rounded-md field_${index} my-[3px] border border-gray-300 p-2 ${
                  field.details ? "gap-4" : "_s"}`}>
                  <div className="w-full flex flex-row gap-2 items-center justify-center">
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
                        className={`text-sm p-2 border rounded-md ${
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
                  </div>
                  {field.details && (
                    <div className="flex flex-row items-center justify-center w-full">
                      <label
                        htmlFor={field.details.name}
                        className="text-sm capitalize w-32"
                      >
                        {field.details.label}
                      </label>

                      <Field
                        id={field.details.name}
                        name={field.details.name}
                        type={field.details.type || "text"}
                        placeholder={field.details.placeholder || "default"}
                        as={field.details.as || "input"}
                        rows={field.details.rows || 1}
                        className="p-2 text-sm border rounded-md w-full focus:outline-none focus:border-green-500 resize-none"
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
