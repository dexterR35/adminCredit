import React, { useEffect, useState } from "react";
import { getAllConsultants } from "../../services/Hooks";
import FormInput from "../../Components/Form/FormInput";
import { selectClasses } from "@mui/material";

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

        phoneDetails: "",
        materialStatusDetails:"",
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
            name: "todayDate",
            label: "Today's Date",
            as: "input",
            value: formValues.todayDate,
            disabled: true,
        
        },
              
        {
            name: "source",
            label: "Source",
            as: "select",
            value: formValues.source,
            onChange: handleChange,
            options: [
                { value: "", label: "Select Source" },
                { value: "pliant", label: "Pliant" },
                { value: "consultant", label: "Consultant" },
                { value: "facebook", label: "Facebook" },
                { value: "website", label: "Website" },
                { value: "friends", label: "Friends" },
                
            ],
            selectClassName: " w-full",
        },
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
            selectClassName: "w-full",
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
            selectClassName: "w-full",
            details: {
                name: "Material",
                label: "Additional Information",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "partnerNegativeStatus",
            label: "Partner Negative Status",
            as: "input",
            value: formValues.partnerNegativeStatus,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "partnerJobContract",
            label: "Partner Job Contract",
            as: "input",
            value: formValues.partnerJobContract,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
    
        {
            name: "userAddress",
            label: "Address",
            as: "input",
            value: formValues.userAddress,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userStudies",
            label: "Education",
            as: "input",
            value: formValues.userStudies,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userCreditValue",
            label: "Credit Value",
            as: "input",
            value: formValues.userCreditValue,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userRefinance",
            label: "Refinance",
            as: "input",
            value: formValues.userRefinance,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userProfession",
            label: "Profession",
            as: "input",
            value: formValues.userProfession,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userNameOfEmployer",
            label: "Employer Name",
            as: "input",
            value: formValues.userNameOfEmployer,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userJobContract",
            label: "Job Contract",
            as: "input",
            value: formValues.userJobContract,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status",
                details:"fasfa"
            },
             inputClass:"bg-red-400"
        },
        {
            name: "userDateLastJob",
            label: "Last Job Date",
            as: "date",
            value: formValues.userDateLastJob,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            },
           
        },
        {
            name: "userNetSalary",
            label: "Net Salary",
            as: "input",
            value: formValues.userNetSalary,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userNetSalaryBank",
            label: "Salary Bank",
            as: "input",
            value: formValues.userNetSalaryBank,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userJobScenario",
            label: "Job Scenario",
            as: "input",
            value: formValues.userJobScenario,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userVouchers",
            label: "Vouchers",
            as: "input",
            value: formValues.userVouchers,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "employerFieldActivity",
            label: "Employer Field Activity",
            as: "input",
            value: formValues.employerFieldActivity,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userContactPersonOne",
            label: "Contact Person 1",
            as: "input",
            value: formValues.userContactPersonOne,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userContactPersonTwo",
            label: "Contact Person 2",
            as: "input",
            value: formValues.userContactPersonTwo,
            onChange: handleChange,
            details: {
                name: "Material",
                label: "",
                as: "textarea",
                value: formValues.materialStatusDetails,
                onChange: handleChange,
                placeholder:"Info Material Status"
            }
        },
        {
            name: "userStatus",
            label: "User Status",
            as: "input",
            value: formValues.userStatus,
            disabled: true,
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
                customClass="grid grid-cols-4 gap-2 w-full max-w-5xl mx-auto"
            />
        </div>
    );
};

export default FormUser;
