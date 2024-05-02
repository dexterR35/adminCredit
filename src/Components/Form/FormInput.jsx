import React from 'react';
import { Formik, Form, Field } from 'formik';
import { CustomButton } from '../Buttons/Buttons';

const FormUser = ({ initialValues, onSubmit, fields }) => {
    const handleSubmit = async (values, { setSubmitting }) => {
        // Call the onSubmit function passed as prop to handle form submission
        await onSubmit(values);
        setSubmitting(false);
    };

    return (
        <div className="mx-auto p-5">
            <h1 className="text-3xl font-bold mb-5">Create Client</h1>
            <div className='max-w-5xl'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit} // Pass handleSubmit to Formik
                >
                    {({ isSubmitting }) => (
                        <Form className="grid grid-cols-3 gap-4">
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
                                    isSaving={isSubmitting}
                                    size="md"
                                    additionalClasses="p-2 w-52"
                                    text="Submit"
                                    type="submit"
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default FormUser;
