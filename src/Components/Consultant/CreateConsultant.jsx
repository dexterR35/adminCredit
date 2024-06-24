import React, { useState } from 'react';
import { AddConsultant } from '../../services/Hooks';
import FormInput from '../Form/FormInput';


const CreateConsultant = () => {
    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        role: 'consultant' // Default role value
    };

    const [errors, setErrors] = useState({}); // State for validation errors
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

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
            await AddConsultant(values.email, values.password, values.username, values.role);
            console.log('Consultant added successfully!');
        } catch (error) {
            console.error("Error adding consultant:", error);
            setErrors({ ...errors, general: error.message }); 
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
            {isLoading && <p>Loading...</p>} {/* Show loading indicator */}
            {errors.general && <p className="error">{errors.general}</p>} {/* Show general error */}
            <FormInput
                initialValues={initialValues}
                onSubmit={onSubmit}
                fields={fields}
                formCustomClass="test"
                submitButtonText="salveaza"
                isLoading={isLoading} // Pass loading state to FormInput
            />
        </div>
    );
};

export default CreateConsultant;