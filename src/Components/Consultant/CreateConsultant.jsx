import React from 'react';

import { AddConsultant } from '../../services/Hooks'; // Import the addConsultant function
import FormInput from '../Form/FormInput'
const CreateConsultant = () => {
    const initialValues = {
        email: '', password: '', username: ''
    };
    const onSubmit = async (values) => {
        try {
            await AddConsultant(values.email, values.password, values.username);
            console.log('Consultant added successfully!');
        } catch (error) {
            console.error("Error adding consultant:", error);
        } finally {
            // setSubmitting(false);
        }
    };

    const fields = [
        { name: 'email', label: 'Email', as: 'input' },
        { name: 'password', label: 'Password', as: 'input', type: 'password' },
        { name: 'username', label: 'Username', as: 'input' }
    ];

    return (
        <div>
            <FormInput initialValues={initialValues} onSubmit={onSubmit} fields={fields} />
        </div>
    );
};

export default CreateConsultant;
