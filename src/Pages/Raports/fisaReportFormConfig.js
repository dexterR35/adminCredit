import * as Yup from "yup";
import {
  buildFieldSchema,
  buildValidationSchemaFromFields,
} from "../../utils/formValidation";

export const INITIAL_VALUES = {
  user: "",
  userName: "",
  userInfo: "",
  todayDate: new Date().toLocaleDateString("ro-RO"),
  source: "",
  clientFullName: "",
  clientCNP: "",
  phone: "",
  email: "",
  maritalStatus: "",
  partnerFullName: "",
  partnerCNP: "",
  partnerRatesDelays: "",
  partnerRatesValue: "",
  partnerHasJobContract: "",
  residenceSituation: "",
  education: "",
  motherMaidenName: "",
  requestedCreditValue: "",
  wantsRefinancing: "",
  refinancingDetails: "",
  pastProblems: "",
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
  userStatus: "New",
};

export const STEPS = [
  {
    id: "user",
    title: "Consultant",
    description: "Select the consultant and report date",
    fieldNames: ["user", "userInfo", "todayDate"],
  },
  {
    id: "client",
    title: "Client",
    description: "Basic client information and contact details",
    fieldNames: ["source", "clientFullName", "clientCNP", "phone", "email"],
  },
  {
    id: "family",
    title: "Family",
    description: "Marital status and partner information",
    fieldNames: [
      "maritalStatus",
      "partnerFullName",
      "partnerCNP",
      "partnerRatesDelays",
      "partnerRatesValue",
      "partnerHasJobContract",
    ],
  },
  {
    id: "personal",
    title: "Personal",
    description: "Residence, education, and background",
    fieldNames: ["residenceSituation", "education", "motherMaidenName"],
  },
  {
    id: "credit",
    title: "Credit",
    description: "Requested credit amount and refinancing details",
    fieldNames: ["requestedCreditValue", "wantsRefinancing", "refinancingDetails", "pastProblems"],
  },
  {
    id: "employment",
    title: "Employment",
    description: "Job, salary, and employer information",
    fieldNames: [
      "profession",
      "employerName",
      "employerCUI",
      "employerEmployees",
      "workHours",
      "contractType",
      "employmentStartDate",
      "netSalary",
      "salaryBank",
      "salaryContinuity",
      "mealVouchers",
      "commissions",
      "bonuses",
      "employerAddress",
      "employerFoundedDate",
      "employerActivity",
      "totalWorkExperience",
      "employersLast24Months",
    ],
  },
  {
    id: "review",
    title: "Review",
    description: "Verify all information before submitting",
    fieldNames: [],
  },
];

export const USER_STEP_ID = "user";

export const getStepsForRole = (isAdmin) =>
  isAdmin ? STEPS : STEPS.filter((step) => step.id !== USER_STEP_ID);

export const buildInitialValues = (authUser, isAdmin) => {
  const todayDate = new Date().toLocaleDateString("ro-RO");

  if (isAdmin) {
    return { ...INITIAL_VALUES, todayDate };
  }

  return {
    ...INITIAL_VALUES,
    todayDate,
    user: authUser?.id || "",
    userName: authUser?.username || authUser?.email?.split("@")[0] || "",
  };
};

export const buildValidationSchemaForSteps = (allFields, steps) => {
  const fieldNames = new Set(steps.flatMap((step) => step.fieldNames));
  fieldNames.add("userStatus");

  if (!steps.some((step) => step.id === USER_STEP_ID)) {
    fieldNames.add("user");
    fieldNames.add("userName");
    fieldNames.add("todayDate");
  }

  const fields = allFields.filter((field) => fieldNames.has(field.name));
  return buildValidationSchemaFromFields(fields);
};

export const buildFisaReportFields = (users = []) => [
  {
    name: "user",
    label: "Consultant",
    as: "select",
    required: true,
    options: [
      { value: "", label: "Select Consultant" },
      ...users.map((user) => ({
        value: user.id,
        label: user.username,
      })),
    ],
    selectClassName: "w-full",
  },
  {
    name: "userInfo",
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
  {
    name: "requestedCreditValue",
    label: "Valoare credit solicitat",
    as: "input",
    type: "number",
    required: true,
    integer: true,
    min: 0,
    placeholder: "60000",
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
  {
    name: "userStatus",
    label: "Status",
    as: "input",
    disabled: true,
    inputClass: "bg-gray-100 cursor-not-allowed",
  },
];

export const getFieldsForStep = (stepIndex, allFields, steps = STEPS) => {
  const fieldNames = steps[stepIndex]?.fieldNames ?? [];
  return allFields.filter((field) => fieldNames.includes(field.name));
};

export const getReviewSections = (allFields, steps = STEPS) =>
  steps
    .map((step, stepIndex) => ({ step, stepIndex }))
    .filter(({ step }) => step.fieldNames.length > 0)
    .map(({ step, stepIndex }) => ({
      ...step,
      fields: getFieldsForStep(stepIndex, allFields, steps),
    }));

export const prepareRaportPayload = (values) => ({
  ...values,
  userName: values.userName || null,
  userInfo: values.userInfo || null,
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
});
