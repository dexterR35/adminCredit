import React, { useEffect, useState } from 'react';
import { getAllConsultants } from '../../services/Hooks';
import FormInput from '../../Components/Form/FormInput';

const FormUser = () => {
    const [consultants, setConsultants] = useState([]);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        consultant: '',
        phone: '',
        status: '',
        deadline: ''
    });

    useEffect(() => {
        // Fetch all consultant data when the component mounts
        fetchConsultantsData();
    }, []);

    const fetchConsultantsData = () => {
        getAllConsultants()
            .then(data => {
                setConsultants(data);
            })
            .catch(error => {
                console.error('Error fetching consultant data:', error);
            });
    };

    const handleConsultantChange = (event) => {
        const consultantId = event.target.value;
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            consultant: consultantId,
        }));
    };

    const fields = [
        {
            name: 'consultant',
            label: 'Consultant',
            as: 'select',
            options: [
                { value: '', label: 'Select Consultant' },
                ...consultants.map(consultant => ({ value: consultant.id, label: consultant.username })),
            ],
            onChange: handleConsultantChange
        },
        {
            name: 'name',
            label: 'Name',
            as: 'input',
            value: formValues.name,
        },
        {
            name: 'email',
            label: 'Email',
            as: 'input',
            value: formValues.email,
        },
        {
            name: 'phone',
            label: 'Phone',
            as: 'input',
            value: formValues.phone,
        },
        {
            name: 'status',
            label: 'Status',
            as: 'select',
            options: [
                { value: '', label: 'Select Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
            ],
            value: formValues.status,
        },
        {
            name: 'deadline',
            label: 'Deadline',
            as: 'date',
            value: formValues.deadline,
        },
    ];

    const onSubmit = (values) => {
        console.log(values);
    };

    return (
        <div>
            <FormInput initialValues={formValues} onSubmit={onSubmit} fields={fields} customClass="grid grid-cols-3 gap-4" />
        </div>
    );
};

export default FormUser;
