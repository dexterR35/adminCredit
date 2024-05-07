import React from 'react';
import { Formik, Form, Field } from 'formik';
import { CustomButton } from '../Buttons/Buttons';

const FormInput = ({ initialValues, onSubmit, fields, customClass }) => {

    return (
        <div className="mx-auto p-5">
            <div className='max-w-5xl'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit} // Pass handleSubmit to Formik
                >
                    {({ isSubmitting }) => (
                        <Form className={`${customClass}`}>
                            {fields.map((field, index) => (
                                <div key={index} className="flex flex-col">
                                    <label htmlFor={field.name} className="mb-1 text-lg font-medium">{field.label}</label>
                                    {field.as === 'textarea' && (
                                        <Field
                                            id={field.name}
                                            name={field.name}
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder || ''}
                                            as={field.as || 'input'}
                                            rows={field.rows || 2}
                                            className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        />
                                    )}
                                    {field.as === 'input' && (
                                        <Field
                                            id={field.name}
                                            name={field.name}
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder || ''}
                                            className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        />
                                    )}
                                    {field.as === 'select' && (
                                        <Field
                                            as="select"
                                            id={field.name}
                                            name={field.name}
                                            className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        >
                                            {field.options.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option.value}>{option.label}</option>
                                            ))}
                                        </Field>
                                    )}
                                    {field.as === 'date' && (
                                        <Field
                                            id={field.name}
                                            name={field.name}
                                            type="date"
                                            placeholder={field.placeholder || ''}
                                            className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="col-span-full">
                                <CustomButton
                                    disabled={isSubmitting}
                                    additionalClasses="p-2 w-52"
                                    text={isSubmitting ? "Saving..." : "Submit"} // Show "Saving..." text when isSubmitting is true
                                    type="submit"
                                    buttonType='submit'
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
