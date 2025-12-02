import React, { useEffect, useState } from "react";
import { getAllConsultants } from "../../services/Hooks";
import FormInput from "../../Components/Form/FormInput";
import { CustomButton } from "../../Components/Buttons/Buttons";
import { addRaport } from "../../services/Hooks"
const FormUser = () => {
    const [consultants, setConsultants] = useState([]);
    const [formValues, setFormValues] = useState({
        // Consultant & Date
        consultant: "",
        consultantInfo: "",
        todayDate: new Date().toLocaleDateString('ro-RO'),
        
        // Client Source & Basic Info
        source: "",
        clientFullName: "",
        clientCNP: "",
        phone: "",
        email: "",
        
        // Marital Status & Partner Info
        maritalStatus: "",
        partnerFullName: "",
        partnerCNP: "",
        partnerRatesDelays: "",
        partnerRatesValue: "",
        partnerHasJobContract: "",
        
        // Residence & Education
        residenceSituation: "",
        education: "",
        motherMaidenName: "",
        
        // Credit Information
        requestedCreditValue: "",
        wantsRefinancing: "",
        refinancingDetails: "",
        pastProblems: "",
        
        // Employment Information
        profession: "",
        employerName: "",
        employerCUI: "",
        employerEmployees: "",
        workHours: "",
        contractType: "",
        employmentStartDate: "",
        netSalary: "",
        salaryBank: "",
        salaryContinuity: "",
        mealVouchers: "",
        commissions: "",
        bonuses: "",
        employerAddress: "",
        employerFoundedDate: "",
        employerActivity: "",
        totalWorkExperience: "",
        employersLast24Months: "",
        
        // Contact Persons
        contactPerson1Name: "",
        contactPerson1Phone: "",
        contactPerson1Relation: "",
        contactPerson2Name: "",
        contactPerson2Phone: "",
        contactPerson2Relation: "",
        
        // Status
        userStatus: "New",
    });

    useEffect(() => {
        const fetchConsultantsData = async () => {
            try {
                const dataConsultant = await getAllConsultants();
                setConsultants(dataConsultant);
            } catch (error) {
                console.error("Error fetching consultant data:", error);
            }
        };

        fetchConsultantsData();
    }, []);

    // Formik handles form state, no need for handleChange

    const onSubmit = async (values) => {
        try {
            // Prepare data for database - clean up empty strings and format dates
            const preparedData = {
                ...values,
                // Convert empty strings to null for optional fields
                consultantInfo: values.consultantInfo || null,
                email: values.email || null,
                partnerFullName: values.partnerFullName || null,
                partnerCNP: values.partnerCNP || null,
                partnerRatesDelays: values.partnerRatesDelays || null,
                partnerRatesValue: values.partnerRatesValue || null,
                partnerHasJobContract: values.partnerHasJobContract || null,
                residenceSituation: values.residenceSituation || null,
                education: values.education || null,
                motherMaidenName: values.motherMaidenName || null,
                refinancingDetails: values.refinancingDetails || null,
                pastProblems: values.pastProblems || null,
                employerCUI: values.employerCUI || null,
                employerEmployees: values.employerEmployees || null,
                workHours: values.workHours || null,
                mealVouchers: values.mealVouchers || null,
                commissions: values.commissions || null,
                bonuses: values.bonuses || null,
                employerAddress: values.employerAddress || null,
                employerFoundedDate: values.employerFoundedDate || null,
                employerActivity: values.employerActivity || null,
                totalWorkExperience: values.totalWorkExperience || null,
                employersLast24Months: values.employersLast24Months || null,
                contactPerson1Name: values.contactPerson1Name || null,
                contactPerson1Phone: values.contactPerson1Phone || null,
                contactPerson1Relation: values.contactPerson1Relation || null,
                contactPerson2Name: values.contactPerson2Name || null,
                contactPerson2Phone: values.contactPerson2Phone || null,
                contactPerson2Relation: values.contactPerson2Relation || null,
            };
            
            await addRaport(preparedData);
            console.log("Raport added successfully!");
        } catch (error) {
            console.error("Error adding raport:", error);
        }
    };

    const fields = [
        // Section 1: Consultant & Date
        {
            name: "consultant",
            label: "Consultant",
            as: "select",
            options: [
                { value: '', label: 'Select Consultant' },
                ...consultants.map(consultant => ({ value: consultant.id, label: consultant.username })),
            ],
            selectClassName: "w-full",
        },
        {
            name: "consultantInfo",
            label: "Consultant Info (Optional)",
            as: "input",
            placeholder: "Additional consultant information",
        },
        {
            name: "todayDate",
            label: "Dată",
            as: "input",
            disabled: true,
            required: true,
        },
        
        // Section 2: Client Source & Basic Information
        {
            name: "source",
            label: "Sursă Client",
            as: "select",
            required: true,
            options: [
                { value: "", label: "Select Source" },
                { value: "pliant", label: "Pliant" },
                { value: "consultant", label: "Consultant" },
                { value: "facebook", label: "Facebook" },
                { value: "website", label: "Website" },
                { value: "friends", label: "Friends" },
                { value: "other", label: "Other" },
            ],
            selectClassName: "w-full",
        },
        {
            name: "clientFullName",
            label: "Nume și Prenume Client",
            as: "input",
            required: true,
            placeholder: "LINCAN MARIO",
        },
        {
            name: "clientCNP",
            label: "CNP Client",
            as: "input",
            required: true,
            placeholder: "5060210420135",
            type: "text",
        },
        {
            name: "phone",
            label: "Nr. Telefon (Abonament sau Cartelă)",
            as: "input",
            required: true,
            placeholder: "0759848404/ 0759365934",
        },
        {
            name: "email",
            label: "Adresă de e-mail",
            as: "input",
            type: "email",
            placeholder: "lincamario@YAHOO.COM",
        },
        
        // Section 3: Marital Status & Partner Information
        {
            name: "maritalStatus",
            label: "Stare civilă",
            as: "select",
            required: true,
            options: [
                { value: "", label: "Select Status" },
                { value: "necsat", label: "NECSAT" },
                { value: "casatorit", label: "Căsătorit" },
                { value: "divortat", label: "Divorțat" },
                { value: "singur", label: "Singur" },
            ],
            selectClassName: "w-full",
        },
        {
            name: "partnerFullName",
            label: "Nume și Prenume Soț / Soție",
            as: "input",
            placeholder: "Full name",
        },
        {
            name: "partnerCNP",
            label: "CNP Soț / Soție",
            as: "input",
            placeholder: "CNP",
        },
        {
            name: "partnerRatesDelays",
            label: "Soțul / soția au rate / întârzieri",
            as: "select",
            options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Da" },
                { value: "no", label: "Nu" },
            ],
            selectClassName: "w-full",
        },
        {
            name: "partnerRatesValue",
            label: "Valoarea rate / întârzieri",
            as: "input",
            placeholder: "Value",
        },
        {
            name: "partnerHasJobContract",
            label: "Soțul / soția angajat cu Contract de muncă",
            as: "select",
            options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Da" },
                { value: "no", label: "Nu" },
            ],
            selectClassName: "w-full",
        },
        
        // Section 4: Residence & Education
        {
            name: "residenceSituation",
            label: "Situația domiciliului",
            as: "select",
            options: [
                { value: "", label: "Select" },
                { value: "parintii", label: "Părinții" },
                { value: "proprietar", label: "Proprietar" },
                { value: "chirias", label: "Chiriaș" },
                { value: "other", label: "Altul" },
            ],
            selectClassName: "w-full",
        },
        {
            name: "education",
            label: "Studii absolvite",
            as: "input",
            placeholder: "9 CLASE",
        },
        {
            name: "motherMaidenName",
            label: "Numele mamei înainte de căsătorie",
            as: "input",
            placeholder: "BURLAN",
        },
        
        // Section 5: Credit Information
        {
            name: "requestedCreditValue",
            label: "Valoare credit solicitat",
            as: "input",
            required: true,
            placeholder: "MAXIM 60K-80K",
        },
        {
            name: "wantsRefinancing",
            label: "Clientul dorește refinanțarea creditelor actuale?",
            as: "select",
            options: [
                { value: "", label: "Select" },
                { value: "yes", label: "Da" },
                { value: "no", label: "Nu" },
            ],
            selectClassName: "w-full",
        },
        {
            name: "refinancingDetails",
            label: "Detalii refinanțare",
            as: "textarea",
            rows: 2,
            placeholder: "NU, FARA ISTORIC",
        },
        {
            name: "pastProblems",
            label: "Probleme în trecut",
            as: "textarea",
            rows: 2,
            placeholder: "IN TRECUT PROBLEME LA TELKOM",
        },
        
        // Section 6: Employment Information
        {
            name: "profession",
            label: "Funcția / Profesia (Calificat sau Necalificat)",
            as: "input",
            placeholder: "PAZNIC",
        },
        {
            name: "employerName",
            label: "Nume angajator",
            as: "input",
            placeholder: "BGS SECURITY CONTRO SRL",
        },
        {
            name: "employerCUI",
            label: "CUI Angajator",
            as: "input",
            placeholder: "CUI number",
        },
        {
            name: "employerEmployees",
            label: "Nr. angajați",
            as: "input",
            type: "number",
            placeholder: "Number of employees",
        },
        {
            name: "workHours",
            label: "Ore de lucru",
            as: "input",
            placeholder: "8H / 4H",
        },
        {
            name: "contractType",
            label: "Durată contract muncă (determinat / nedeterminat)",
            as: "select",
            options: [
                { value: "", label: "Select" },
                { value: "determinat", label: "Determinat" },
                { value: "nedeterminat", label: "Nedeterminat" },
            ],
            selectClassName: "w-full",
        },
        {
            name: "employmentStartDate",
            label: "Data angajării ultimul loc de muncă",
            as: "date",
            placeholder: "8 OCTOMBRIE 2024",
        },
        {
            name: "netSalary",
            label: "Salariul net (media pe ultimele 3 luni)",
            as: "input",
            placeholder: "3267 NET",
        },
        {
            name: "salaryBank",
            label: "În ce bancă încasează",
            as: "input",
            placeholder: "PE CT PE BCR",
        },
        {
            name: "salaryContinuity",
            label: "Continuitate în ultimul an",
            as: "select",
            options: [
                { value: "", label: "Select" },
                { value: "fara-intrerupere", label: "Fără întrerupere mai mare de 1 lună" },
                { value: "cu-intrerupere", label: "Cu întrerupere" },
            ],
            selectClassName: "w-full",
        },
        {
            name: "mealVouchers",
            label: "Bonuri de masă",
            as: "input",
            placeholder: "INCLUSE IN SALARIU",
        },
        {
            name: "commissions",
            label: "Comisioane",
            as: "input",
            placeholder: "Commissions",
        },
        {
            name: "bonuses",
            label: "Sporuri",
            as: "input",
            placeholder: "PANA LA 4000 NET PE BCR",
        },
        {
            name: "employerAddress",
            label: "Adresă angajator",
            as: "input",
            placeholder: "Employer address",
        },
        {
            name: "employerFoundedDate",
            label: "Data înființării angajator",
            as: "date",
        },
        {
            name: "employerActivity",
            label: "Domeniul de activitate angajator",
            as: "input",
            placeholder: "Activity domain",
        },
        {
            name: "totalWorkExperience",
            label: "Vechime totala in campul muncii",
            as: "input",
            placeholder: "10 LUNI",
        },
        {
            name: "employersLast24Months",
            label: "Număr angajatori în ultimele 24 luni",
            as: "input",
            type: "number",
            placeholder: "Number of employers",
        },
        
        // Section 7: Contact Persons
        {
            name: "contactPerson1Name",
            label: "Persoană de contact #1 (nume)",
            as: "input",
            placeholder: "BURCEOIU MARIA",
        },
        {
            name: "contactPerson1Phone",
            label: "Persoană de contact #1 (telefon)",
            as: "input",
            placeholder: "Phone number",
        },
        {
            name: "contactPerson1Relation",
            label: "Persoană de contact #1 (relația cu solicitantul)",
            as: "input",
            placeholder: "Relationship",
        },
        {
            name: "contactPerson2Name",
            label: "Persoană de contact #2 (nume)",
            as: "input",
            placeholder: "Name",
        },
        {
            name: "contactPerson2Phone",
            label: "Persoană de contact #2 (telefon)",
            as: "input",
            placeholder: "Phone number",
        },
        {
            name: "contactPerson2Relation",
            label: "Persoană de contact #2 (relația cu solicitantul)",
            as: "input",
            placeholder: "Relationship",
        },
        
        // Status
        {
            name: "userStatus",
            label: "Status",
            as: "input",
            disabled: true,
            inputClass: "bg-slate-700/50 cursor-not-allowed",
        },
    ];

    

    return (
        <div className="animate-fade-in">
            {/* Page Title & Subtitle */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">New Report</h1>
                <p className="text-slate-400 text-sm">Create a new client report with complete information</p>
            </div>

            <div className="rounded-xl p-8 border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm shadow-lg">
                {/* Form Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-slate-100">Fisa Client</h2>
                    </div>
                    <p className="text-slate-400 text-sm ml-4">Complete all required fields to create a new client report</p>
                </div>

                {/* Form */}
                <FormInput
                    initialValues={formValues}
                    onSubmit={onSubmit}
                    fields={fields}
                    formCustomClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                    buttonCustomClass="mt-6"
                    submitButtonText="Create Report"
                />        
            </div>
        </div>
    );
};

export default FormUser;
