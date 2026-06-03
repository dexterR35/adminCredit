import React, { useState } from 'react';
import { AddConsultant } from '../../services/Hooks';
import FormInput from '../Form/FormInput';
import { useTrackLoading } from '../LoadingProgress';


const CreateConsultant = ({ onSuccess }) => {
    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        role: 'consultant' // Default role value
    };

    const [errors, setErrors] = useState({}); // State for validation errors
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    useTrackLoading(isLoading);

    const onSubmit = async (values) => {
        setIsLoading(true); // Set loading state
        setErrors({}); // Clear any previous errors

        try {
            // Basic validation
            if (!values.email || !values.password || !values.confirmPassword || !values.username) {
                throw new Error("Please fill in all required fields");
            }

            if (values.password !== values.confirmPassword) {
                throw new Error("Passwords do not match");
            }
            // Pass the password directly to the AddConsultant function
            await AddConsultant(values.email, values.password, values.username);
            onSuccess?.();
        } catch (error) {
            console.error("Error adding consultant:", error);
            setErrors((prev) => ({ ...prev, general: error.message }));
            throw error;
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };



    const fields = [
        {
            name: 'email',
            label: 'Email',
            as: 'input',
            type: 'email', // Input type for email
            error: errors.email, // Show email error
        },
        {
            name: 'password',
            label: 'Password',
            as: 'input',
            type: 'password',
            error: errors.password, // Show password error
        },
        {
            name: 'confirmPassword',
            label: 'Confirm Password',
            as: 'input',
            type: 'password',
            error: errors.confirmPassword, // Show confirm password error
        },
        {
            name: 'username',
            label: 'Username',
            as: 'input',
            error: errors.username, // Show username error
        },
        {
            name: 'role',
            label: 'Role',
            as: 'input',
            disabled: true,
            value: 'consultant',
        },
    ];

    return (
        <div>
            {errors.general && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errors.general}</p>}
            <FormInput
                initialValues={initialValues}
                onSubmit={onSubmit}
                fields={fields}
                submitButtonText="salveaza"
                showSuccessToast={false}
            />
        </div>
    );
};

export default CreateConsultant;