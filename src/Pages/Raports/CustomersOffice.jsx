import { Formik, Form, Field } from 'formik';
// import { useCreate } from './hooks/useCreate';
import FormInput from '../../Components/Form/FormInput'
const FormUser = () => {
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

    const onSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };

    const fields = [
        { name: 'consultant', label: 'Consultant', placeholder: "Consultant's name" },
        { name: 'name', label: 'Full Name', placeholder: 'Jane Doe' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
        { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },

    ];

    return (
        <div>
            <FormInput initialValues={initialValues} onSubmit={onSubmit} fields={fields} />
        </div>
    );
};

export default FormUser;
