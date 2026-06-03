import * as Yup from "yup";
import { FISA_STATUS_SUBMIT_OPTIONS } from "../../services/fisaReportStatus";
import {
  buildFieldSchema,
  buildValidationSchemaFromFields,
} from "../../utils/formValidation";

export const INITIAL_VALUES = {
  user: "",
  userName: "",
  userInfo: "",
  todayDate: new Date().toLocaleDateString("en-GB"),
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
  userStatus: "Pending",
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
    description: "Verify all information and set the client outcome before submitting",
    fieldNames: ["userStatus"],
  },
];

export const USER_STEP_ID = "user";

export const getStepsForRole = (isAdmin) =>
  isAdmin ? STEPS : STEPS.filter((step) => step.id !== USER_STEP_ID);

export const buildInitialValues = (authUser, isAdmin) => {
  const todayDate = new Date().toLocaleDateString("en-GB");

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
    label: "Date",
    as: "input",
    disabled: true,
    required: true,
  },
  {
    name: "source",
    label: "Client source",
    as: "select",
    required: true,
    options: [
      { value: "", label: "Select source" },
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
    label: "Client full name",
    as: "input",
    required: true,
    placeholder: "John Doe",
  },
  {
    name: "clientCNP",
    label: "Client ID number (CNP)",
    as: "input",
    required: true,
    placeholder: "5060210420135",
    type: "text",
  },
  {
    name: "phone",
    label: "Phone number (subscription or prepaid)",
    as: "input",
    required: true,
    placeholder: "0759848404",
  },
  {
    name: "email",
    label: "Email address",
    as: "input",
    type: "email",
    placeholder: "client@example.com",
  },
  {
    name: "maritalStatus",
    label: "Marital status",
    as: "select",
    required: true,
    options: [
      { value: "", label: "Select status" },
      { value: "necsat", label: "Unmarried" },
      { value: "casatorit", label: "Married" },
      { value: "divortat", label: "Divorced" },
      { value: "singur", label: "Single" },
    ],
    selectClassName: "w-full",
  },
  {
    name: "partnerFullName",
    label: "Spouse full name",
    as: "input",
    placeholder: "Full name",
  },
  {
    name: "partnerCNP",
    label: "Spouse ID number (CNP)",
    as: "input",
    placeholder: "CNP",
  },
  {
    name: "partnerRatesDelays",
    label: "Spouse has loans / payment delays",
    as: "select",
    options: [
      { value: "", label: "Select" },
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    selectClassName: "w-full",
  },
  {
    name: "partnerRatesValue",
    label: "Loan / delay amount",
    as: "input",
    placeholder: "Amount",
  },
  {
    name: "partnerHasJobContract",
    label: "Spouse employed with work contract",
    as: "select",
    options: [
      { value: "", label: "Select" },
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    selectClassName: "w-full",
  },
  {
    name: "residenceSituation",
    label: "Housing situation",
    as: "select",
    options: [
      { value: "", label: "Select" },
      { value: "parintii", label: "With parents" },
      { value: "proprietar", label: "Homeowner" },
      { value: "chirias", label: "Renting" },
      { value: "other", label: "Other" },
    ],
    selectClassName: "w-full",
  },
  {
    name: "education",
    label: "Education level",
    as: "input",
    placeholder: "High school",
  },
  {
    name: "motherMaidenName",
    label: "Mother's maiden name",
    as: "input",
    placeholder: "Maiden name",
  },
  {
    name: "requestedCreditValue",
    label: "Requested credit amount",
    as: "input",
    type: "number",
    required: true,
    integer: true,
    min: 0,
    placeholder: "60000",
  },
  {
    name: "wantsRefinancing",
    label: "Client wants to refinance current loans?",
    as: "select",
    options: [
      { value: "", label: "Select" },
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    selectClassName: "w-full",
  },
  {
    name: "refinancingDetails",
    label: "Refinancing details",
    as: "textarea",
    rows: 2,
    placeholder: "Details",
  },
  {
    name: "pastProblems",
    label: "Past credit issues",
    as: "textarea",
    rows: 2,
    placeholder: "Describe any past issues",
  },
  {
    name: "profession",
    label: "Job title / profession (skilled or unskilled)",
    as: "input",
    placeholder: "Security guard",
  },
  {
    name: "employerName",
    label: "Employer name",
    as: "input",
    placeholder: "Company name",
  },
  {
    name: "employerCUI",
    label: "Employer tax ID (CUI)",
    as: "input",
    placeholder: "CUI number",
  },
  {
    name: "employerEmployees",
    label: "Number of employees",
    as: "input",
    type: "number",
    placeholder: "Number of employees",
  },
  {
    name: "workHours",
    label: "Working hours",
    as: "input",
    placeholder: "8H / 4H",
  },
  {
    name: "contractType",
    label: "Employment contract (fixed / permanent)",
    as: "select",
    options: [
      { value: "", label: "Select" },
      { value: "determinat", label: "Fixed-term" },
      { value: "nedeterminat", label: "Permanent" },
    ],
    selectClassName: "w-full",
  },
  {
    name: "employmentStartDate",
    label: "Employment start date (current job)",
    as: "date",
    placeholder: "Start date",
  },
  {
    name: "netSalary",
    label: "Net salary (3-month average)",
    as: "input",
    placeholder: "3267",
  },
  {
    name: "salaryBank",
    label: "Salary bank",
    as: "input",
    placeholder: "Bank name",
  },
  {
    name: "salaryContinuity",
    label: "Salary continuity in the last year",
    as: "select",
    options: [
      { value: "", label: "Select" },
      { value: "fara-intrerupere", label: "No break longer than 1 month" },
      { value: "cu-intrerupere", label: "With a break" },
    ],
    selectClassName: "w-full",
  },
  {
    name: "mealVouchers",
    label: "Meal vouchers",
    as: "input",
    placeholder: "Included in salary",
  },
  {
    name: "commissions",
    label: "Commissions",
    as: "input",
    placeholder: "Commissions",
  },
  {
    name: "bonuses",
    label: "Bonuses / allowances",
    as: "input",
    placeholder: "Bonus details",
  },
  {
    name: "employerAddress",
    label: "Employer address",
    as: "input",
    placeholder: "Employer address",
  },
  {
    name: "employerFoundedDate",
    label: "Employer founding date",
    as: "date",
  },
  {
    name: "employerActivity",
    label: "Employer business activity",
    as: "input",
    placeholder: "Business sector",
  },
  {
    name: "totalWorkExperience",
    label: "Total work experience",
    as: "input",
    placeholder: "10 months",
  },
  {
    name: "employersLast24Months",
    label: "Employers in the last 24 months",
    as: "input",
    type: "number",
    placeholder: "Number of employers",
  },
  {
    name: "userStatus",
    label: "Client outcome",
    as: "select",
    required: true,
    options: FISA_STATUS_SUBMIT_OPTIONS,
    selectClassName: "w-full",
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
