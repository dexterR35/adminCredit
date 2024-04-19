import { Formik, Form, Field } from 'formik';
// import { useCreate } from './hooks/useCreate'; // asigură-te că importi hook-ul corespunzător

const FormUser = () => {
    //   const addData = useCreate();
    return (
        <div className="max-w-4xl mx-0 p-5">
            <Formik
                initialValues={{
                    name: '',
                    deadline: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    country: '',
                    zip: '',
                    description: '',
                    project: ''
                }}
                onSubmit={(values, { setSubmitting }) => {
                    addData(values);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="form-layout ">
                        <div className='form-group'>
                            <label htmlFor="name" >Name</label>
                            <Field id="name" name="name" placeholder="Jane Doe" />
                        </div>
                        {/* Repeat for each additional field */}
                        <div className='form-group'>
                            <label htmlFor="email" >Email</label>
                            <Field id="email" name="email" type="email" placeholder="you@example.com" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone" >test</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone" >casuta1</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone" >casuta2</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone" >casuta3</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone" >casuta4</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone" >casuta5</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="phone" >casuta5</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className='form-group '>
                            <label htmlFor="deadline">Deadline set</label>
                            <Field id="deadline" name="deadline" type="date" />
                        </div>

                        <div className="col-span-2 form-group">
                            <label htmlFor="description" >Description</label>
                            <Field as="textarea" id="description" name="description" rows="3" />
                        </div>

                        <div className="form-group col-span-full">
                            <button type="submit" disabled={isSubmitting} className='form-button'>
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormUser