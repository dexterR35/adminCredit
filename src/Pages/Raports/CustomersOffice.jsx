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
        {
            name: 'consultant',
            label: 'consultant',
            as: 'select',
            options: [
                { value: '', label: 'Select Consultant' },
                { value: 'jophn', label: 'joe' },
                { value: 'inactive', label: 'Inactive' },
            ],
        },
        {
            name: 'name',
            label: 'Name',
            as: 'input',
        },
        {
            name: 'name',
            label: 'Last Name',
            as: 'input',
        },
        {
            name: 'email',
            label: 'Email',
            as: 'input',
        },

        {
            name: 'phone',
            label: 'Phone',
            as: 'input',
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
        },
        {
            name: 'deadline',
            label: 'Deadline',
            as: 'date',
        },
    ];


    return (
        <div>
            <FormInput initialValues={initialValues} onSubmit={onSubmit} fields={fields} />
        </div>
    );
};

export default FormUser;
