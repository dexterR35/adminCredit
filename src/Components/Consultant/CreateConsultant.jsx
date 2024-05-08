import React, { useState } from 'react';
import { AddConsultant } from '../../services/Hooks';
import FormInput from '../Form/FormInput';
import bcrypt from 'bcryptjs';

const CreateConsultant = () => {
    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    };

    const [role, setRole] = useState('');

    const onSubmit = async (values) => {
        try {
            // Check if passwords match
            if (values.password !== values.confirmPassword) {
                throw new Error("Passwords do not match");
            }
            const hashedPassword = await hashPassword(values.password);
            await AddConsultant(values.email, hashedPassword, values.username, role);
            console.log('Consultant added successfully!');
        } catch (error) {
            console.error("Error adding consultant:", error);
        } finally {
            // setSubmitting(false);
        }
    };

    const hashPassword = async (password) => {
        // Generate salt and hash the password
        const saltRounds = 10; // Recommended number of rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    };

    const fields = [
        { name: 'email', label: 'Email', as: 'input' },
        { name: 'password', label: 'Password', as: 'input', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm Password', as: 'input', type: 'password' }, // Confirm password field
        { name: 'username', label: 'Username', as: 'input' },
        {
            name: 'role',
            label: 'Role',
            as: 'select',
            options: [
                { value: 'consultant', label: 'consultant' },
            ],
            onChange: (e) => setRole(e.target.value)
        }
    ];

    return (
        <div>
            <h2 className='text-start mb-0'>Create Consultant</h2>
            <FormInput initialValues={initialValues} onSubmit={onSubmit} fields={fields} customClass="flex flex-col gap-4" />
        </div>
    );
};

export default CreateConsultant;
