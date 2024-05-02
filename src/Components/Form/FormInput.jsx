import React from 'react';
import { Formik, Form, Field } from 'formik';

const FormUser = ({ initialValues, onSubmit, fields }) => {
    return (
        <div className="mx-auto p-5">
            <h1 className="text-3xl font-bold mb-5">User Information Form</h1>
            <div className='max-w-5xl'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, { setSubmitting }) => {
                        onSubmit(values);
                        setSubmitting(false);
                    }}
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
                                    {field.as !== 'textarea' && (
                                        <Field
                                            id={field.name}
                                            name={field.name}
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder || ''}
                                            as={field.as || 'input'}
                                            className="p-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="col-span-full">
                                <button type="submit" disabled={isSubmitting} className="py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default FormUser;
