import React, { useEffect, useState } from "react";
import { getAllConsultants } from "../../services/Hooks";
import FormInput from "../../Components/Form/FormInput";

const FormUser = () => {
    const [consultants, setConsultants] = useState([]);
    const [formValues, setFormValues] = useState({
        consultant: "",
        todayDate: new Date().toLocaleDateString('ro-RO'),
        source: "",
        firstName: "",
        lastName: "",
        userCNP: "",
        phone: "",
        email: "",
        materialStatus: "",
        partnerFirstName: "",
        partnerLastName: "",
        partnerMotherName: "",
        partnerCNP: "",
        partnerNegativeStatus: "",
        partnerJobContract: "",
        userStatus: "New",
        userAddress: "",
        userStudies: "",
        userCreditValue: "",
        userRefinance: "",
        userProfession: "",
        userNameOfEmployer: "",
        userJobContract: "",
        userDateLastJob: "",
        userNetSalary: "",
        userNetSalaryBank: "",
        userJobScenario: "",
        userVouchers: "",
        userContactPersonOne: "",
        userContactPersonTwo: "",
        employerFieldActivity: "",
    });

    useEffect(() => {
        const fetchConsultantsData = async () => {
            try {
                const data = await getAllConsultants();
                setConsultants(data);
            } catch (error) {
                console.error("Error fetching consultant data:", error);
            }
        };

        fetchConsultantsData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            [name]: value,
        }));
    };

    const fields = [
        {
            name: "consultant",
            label: "Consultant",
            as: "select",
            value: formValues.consultant,
            onChange: handleChange,
            options: [
                { value: '', label: 'Select Consultant' },
                ...consultants.map(consultant => ({ value: consultant.id, label: consultant.username })),
            ],
        },
        {
            name: "todayDate",
            label: "Today's Date",
            as: "input",
            value: formValues.todayDate,
            disabled: true,
        },
        {
            name: "source",
            label: "Source",
            as: "input",
            value: formValues.source,
            onChange: handleChange,
        },
        {
            name: "firstName",
            label: "First Name",
            as: "input",
            value: formValues.firstName,
            onChange: handleChange,
        },
        {
            name: "lastName",
            label: "Last Name",
            as: "input",
            value: formValues.lastName,
            onChange: handleChange,
        },
        {
            name: "userCNP",
            label: "Client CNP",
            as: "input",
            value: formValues.userCNP,
            onChange: handleChange,
        },
        {
            name: "phone",
            label: "Phone",
            as: "input",
            value: formValues.phone,
            onChange: handleChange,
        },
        {
            name: "email",
            label: "Email",
            as: "input",
            value: formValues.email,
            onChange: handleChange,
        },
        {
            name: "materialStatus",
            label: "Material Status",
            as: "select",
            value: formValues.materialStatus,
            onChange: handleChange,
            options: [
                { value: "", label: "Select Material" },
                { value: "married", label: "Married" },
                { value: "divorced", label: "Divorced" },
                { value: "single", label: "Single" },
            ],
        },
        {
            name: "partnerFirstName",
            label: "Partner First Name",
            as: "input",
            value: formValues.partnerFirstName,
            onChange: handleChange,
        },
        {
            name: "partnerLastName",
            label: "Partner Last Name",
            as: "input",
            value: formValues.partnerLastName,
            onChange: handleChange,
        },
        {
            name: "partnerMotherName",
            label: "Partner Mother Name",
            as: "input",
            value: formValues.partnerMotherName,
            onChange: handleChange,
        },
        {
            name: "partnerCNP",
            label: "Partner CNP",
            as: "input",
            value: formValues.partnerCNP,
            onChange: handleChange,
        },
        {
            name: "partnerNegativeStatus",
            label: "Partner Negative Status",
            as: "input",
            value: formValues.partnerNegativeStatus,
            onChange: handleChange,
        },
        {
            name: "partnerJobContract",
            label: "Partner Job Contract",
            as: "input",
            value: formValues.partnerJobContract,
            onChange: handleChange,
        },
        {
            name: "userStatus",
            label: "User Status",
            as: "input",
            value: formValues.userStatus,
            disabled: true,
        },
        {
            name: "userAddress",
            label: "Address",
            as: "input",
            value: formValues.userAddress,
            onChange: handleChange,
        },
        {
            name: "userStudies",
            label: "Education",
            as: "input",
            value: formValues.userStudies,
            onChange: handleChange,
        },
        {
            name: "userCreditValue",
            label: "Credit Value",
            as: "input",
            value: formValues.userCreditValue,
            onChange: handleChange,
        },
        {
            name: "userRefinance",
            label: "Refinance",
            as: "input",
            value: formValues.userRefinance,
            onChange: handleChange,
        },
        {
            name: "userProfession",
            label: "Profession",
            as: "input",
            value: formValues.userProfession,
            onChange: handleChange,
        },
        {
            name: "userNameOfEmployer",
            label: "Employer Name",
            as: "input",
            value: formValues.userNameOfEmployer,
            onChange: handleChange,
        },
        {
            name: "userJobContract",
            label: "Job Contract",
            as: "input",
            value: formValues.userJobContract,
            onChange: handleChange,
        },
        {
            name: "userDateLastJob",
            label: "Last Job Date",
            as: "date",
            value: formValues.userDateLastJob,
            onChange: handleChange,
        },
        {
            name: "userNetSalary",
            label: "Net Salary",
            as: "input",
            value: formValues.userNetSalary,
            onChange: handleChange,
        },
        {
            name: "userNetSalaryBank",
            label: "Salary Bank",
            as: "input",
            value: formValues.userNetSalaryBank,
            onChange: handleChange,
        },
        {
            name: "userJobScenario",
            label: "Job Scenario",
            as: "input",
            value: formValues.userJobScenario,
            onChange: handleChange,
        },
        {
            name: "userVouchers",
            label: "Vouchers",
            as: "input",
            value: formValues.userVouchers,
            onChange: handleChange,
        },
        {
            name: "employerFieldActivity",
            label: "Employer Field Activity",
            as: "input",
            value: formValues.employerFieldActivity,
            onChange: handleChange,
        },
        {
            name: "userContactPersonOne",
            label: "Contact Person 1",
            as: "input",
            value: formValues.userContactPersonOne,
            onChange: handleChange,
        },
        {
            name: "userContactPersonTwo",
            label: "Contact Person 2",
            as: "input",
            value: formValues.userContactPersonTwo,
            onChange: handleChange,
        },

    ];

    const onSubmit = (values) => {
        console.log(values);
    };

    return (
        <div>
            <FormInput
                initialValues={formValues}
                onSubmit={onSubmit}
                fields={fields}
                customClass="grid grid-cols-4 gap-2"
            />
        </div>
    );
};

export default FormUser;
