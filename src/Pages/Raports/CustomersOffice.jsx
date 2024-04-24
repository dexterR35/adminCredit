import { Formik, Form, Field } from 'formik';
// import { useCreate } from './hooks/useCreate';

const FormUser = () => {
    // const addData = useCreate(); // re-enable the hook

    const initialValues = {
        name: '',
        email: '',
        consultant: '',
        phone: '',
        status: '',
        deadline: '',
        salaryAmount: '',
        hireDate: '',
        continuity: '',
        linkBC: '',
        lastNegativeReport: '',
        approvedAmount: '',
        commission: '',
        contractNumber: '',
        source: '',
        additionalInfo: '',
    };

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1>User Information Form</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                    // addData(values); // submit the form
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="form-layout">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Field id="name" name="name" placeholder="Jane Doe" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field id="email" name="email" type="email" placeholder="you@example.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="consultant">Consultant</label>
                            <Field id="consultant" name="consultant" placeholder="Consultant's name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <Field id="phone" name="phone" placeholder="123-456-7890" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <Field id="status" name="status" placeholder="Project status" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="deadline">Deadline</label>
                            <Field id="deadline" name="deadline" type="date" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="salaryAmount">Salary Amount</label>
                            <Field id="salaryAmount" name="salaryAmount" placeholder="Amount in USD" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hireDate">Hire Date</label>
                            <Field id="hireDate" name="hireDate" type="date" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="continuity">Continuity</label>
                            <Field id="continuity" name="continuity" placeholder="Continuity status" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="linkBC">Link BC/SR</label>
                            <Field id="linkBC" name="linkBC" placeholder="Link to BC/SR" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastNegativeReport">Last Negative Report</label>
                            <Field id="lastNegativeReport" name="lastNegativeReport" placeholder="Report details" />
                        </div>
                        <div class="form-group">
                            <label htmlFor="approvedAmount">Approved Amount</label>
                            <Field id="approvedAmount" name="approvedAmount" placeholder="Amount approved" />
                        </div>
                        <div class="form-group">
                            <label htmlFor="commission">Commission</label>
                            <Field id="commission" name="commission" placeholder="Commission rate" />
                        </div>
                        <div class="form-group">
                            <label htmlFor="contractNumber">Contract Number</label>
                            <Field id="contractNumber" name="contractNumber" placeholder="Contract Number" />
                        </div>
                        <div class="form-group">
                            <label htmlFor="source">Source</label>
                            <Field id="source" name="source" placeholder="Source of data" />
                        </div>
                        <div class="form-group col-span-2">
                            <label htmlFor="additionalInfo">Additional Information</label>
                            <Field as="textarea" id="additionalInfo" name="additionalInfo" rows="3" />
                        </div>

                        <div className="form-group col-span-full">
                            <button type="submit" disabled={isSubmitting} className="form-button">
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormUser;
