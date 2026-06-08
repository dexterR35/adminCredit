import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import { useBlocker, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsers, addRaport } from "../../services/Hooks";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../Components/Buttons";
import FormField from "../../Components/Inputs/FormField";
import FormikControl from "../../Components/Inputs/FormikControl";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import { formatRoDate } from "../../utils/date";
import { buildFieldTypeMap, sanitizeFormValues } from "../../utils/sanitize";
import FisaReportStepper from "./FisaReportStepper";
import FisaConsultantBanner from "./FisaConsultantBanner";
import FisaDraftSync from "./FisaDraftSync";
import { clearFisaDraft, loadFisaDraft } from "./fisaReportDraft";
import {
  buildFisaReportFields,
  buildInitialValues,
  buildValidationSchemaForSteps,
  getFieldsForStep,
  getReviewSections,
  getStepsForRole,
  prepareRaportPayload,
} from "./fisaReportFormConfig";
import { mutationRateLimiter } from "../../utils/rateLimiter";
import { useThrottledCallback } from "../../hooks/useThrottle";

const formatReviewValue = (field, value, allFields, values) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (field.as === "select") {
    const option = field.options?.find((item) => String(item.value) === String(value));
    return option?.label || value;
  }

  if (field.name === "user") {
    if (values.userName) return values.userName;
    const userField = allFields.find((item) => item.name === "user");
    const option = userField?.options?.find((item) => String(item.value) === String(value));
    return option?.label || value;
  }

  return value;
};

const ReviewSummary = ({ values, allFields, steps, showConsultantMeta }) => {
  const sections = getReviewSections(allFields, steps);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-success-border bg-success-bg px-4 py-3">
        <p className="text-sm font-medium text-success-dark">
          Review your entries before creating the report. Use the stepper above to edit any section.
        </p>
      </div>

      {showConsultantMeta && (
        <FisaConsultantBanner userName={values.userName} date={values.todayDate} />
      )}

      {sections.map((section) => (
        <section
          key={section.id}
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50"
        >
          <header className="border-b border-gray-200 bg-white px-4 py-3">
            <h3 className="text-sm font-display font-semibold text-gray-900">{section.title}</h3>
            <p className="text-xs text-gray-500">{section.description}</p>
          </header>
          <dl className="grid grid-cols-1 gap-px bg-gray-200">
            {section.fields.map((field) => (
              <div key={field.name} className="bg-white px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {field.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 wrap-break-word">
                  {formatReviewValue(field, values[field.name], allFields, values)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
};

ReviewSummary.propTypes = {
  values: PropTypes.object.isRequired,
  allFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  showConsultantMeta: PropTypes.bool,
};

const StepFields = ({ fields, touched, errors }) => (
  <div className="mx-auto w-full max-w-lg space-y-3 sm:space-y-4">
    {fields.map((field) => (
      <div key={field.name}>
        <FormField
          label={field.label}
          htmlFor={field.name}
          required={field.required}
          error={touched[field.name] && errors[field.name]}
        >
          <Field name={field.name}>
            {({ field: formikField, form }) => (
              <FormikControl field={formikField} form={form} config={field} />
            )}
          </Field>
        </FormField>
      </div>
    ))}
  </div>
);

StepFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const FormUser = () => {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const formActionsRef = useRef({ resetForm: null });

  const steps = useMemo(() => getStepsForRole(isAdmin), [isAdmin]);
  const baselineValues = useMemo(
    () => buildInitialValues(authUser, isAdmin),
    [authUser, isAdmin]
  );
  const allFields = useMemo(() => buildFisaReportFields(users), [users]);
  const fieldTypeMap = useMemo(() => buildFieldTypeMap(allFields), [allFields]);
  const validationSchema = useMemo(
    () => buildValidationSchemaForSteps(allFields, steps),
    [allFields, steps]
  );
  const currentStepConfig = steps[currentStep];
  const currentStepFields = useMemo(
    () => getFieldsForStep(currentStep, allFields, steps),
    [currentStep, allFields, steps]
  );
  const isReviewStep = currentStepConfig?.id === "review";
  const isLastStep = currentStep === steps.length - 1;
  const showConsultantMeta = !isAdmin;

  const handleDirtyChange = useCallback((dirty) => {
    setHasUnsavedDraft(dirty);
  }, []);

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        hasUnsavedDraft &&
        currentLocation.pathname !== nextLocation.pathname,
      [hasUnsavedDraft]
    )
  );

  useEffect(() => {
    if (authLoading || !authUser?.id) return;

    const baseline = buildInitialValues(authUser, isAdmin);
    const draft = loadFisaDraft(authUser.id);

    if (draft?.values) {
      setCurrentStep(draft.currentStep ?? 0);
      setMaxStepReached(draft.maxStepReached ?? 0);
      setInitialFormValues({
        ...baseline,
        ...draft.values,
        todayDate: baseline.todayDate,
        user: isAdmin ? draft.values.user : baseline.user,
        userName: isAdmin ? draft.values.userName : baseline.userName,
      });
    } else {
      setCurrentStep(0);
      setMaxStepReached(0);
      setInitialFormValues(baseline);
    }
  }, [authLoading, authUser, isAdmin]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowLeaveModal(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!hasUnsavedDraft) return undefined;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedDraft]);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Could not load users.");
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const mergeAuthUserValues = (values) => {
    if (isAdmin) return values;

    return {
      ...values,
      user: authUser?.id || values.user,
      userName: authUser?.username || authUser?.email?.split("@")[0] || values.userName,
      todayDate: formatRoDate(),
    };
  };

  const validateStep = async (values, stepIndex) => {
    const stepFields = getFieldsForStep(stepIndex, allFields, steps);
    if (!stepFields.length) {
      return {};
    }

    const stepSchema = buildValidationSchemaForSteps(allFields, [steps[stepIndex]]);

    try {
      await stepSchema.validate(mergeAuthUserValues(values), { abortEarly: false });
      return {};
    } catch (error) {
      return error.inner.reduce(
        (acc, item) => ({
          ...acc,
          [item.path]: item.message,
        }),
        {}
      );
    }
  };

  const touchStepFields = (stepIndex, setTouched) => {
    const fieldNames = steps[stepIndex]?.fieldNames ?? [];
    setTouched(
      fieldNames.reduce(
        (acc, name) => ({
          ...acc,
          [name]: true,
        }),
        {}
      )
    );
  };

  const handleNext = useThrottledCallback(async (values, setErrors, setTouched) => {
    const errors = await validateStep(values, currentStep);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      touchStepFields(currentStep, setTouched);
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setMaxStepReached((prev) => Math.max(prev, nextStep));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 400, [currentStep, allFields, steps]);

  const handleBack = useThrottledCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 400, []);

  const handleStepClick = useThrottledCallback((stepIndex) => {
    if (stepIndex <= maxStepReached) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 400, [maxStepReached]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      mutationRateLimiter.assertAllowed(
        authUser?.id || "anonymous",
        "You are submitting reports too quickly. Please wait a moment."
      );
      mutationRateLimiter.record(authUser?.id || "anonymous");

      const mergedValues = mergeAuthUserValues(values);
      const sanitizedValues = sanitizeFormValues(mergedValues, fieldTypeMap);
      await validationSchema.validate(sanitizedValues, { abortEarly: false });
      const preparedData = prepareRaportPayload(sanitizedValues);
      await addRaport(preparedData, { isAdmin });
      clearFisaDraft(authUser?.id);
      setHasUnsavedDraft(false);
      resetForm({ values: buildInitialValues(authUser, isAdmin) });
      setCurrentStep(0);
      setMaxStepReached(0);
      navigate("/home");
    } catch (error) {
      if (error.code === "rate_limited") {
        toast.error(error.message);
      } else if (error.inner) {
        toast.error("Please complete all required fields before submitting.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetReportForm = useCallback(() => {
    const baseline = buildInitialValues(authUser, isAdmin);
    clearFisaDraft(authUser?.id);
    setHasUnsavedDraft(false);
    setCurrentStep(0);
    setMaxStepReached(0);
    setInitialFormValues(baseline);
    formActionsRef.current.resetForm?.({ values: baseline });
  }, [authUser, isAdmin]);

  const handleCancelConfirm = () => {
    resetReportForm();
    setShowCancelModal(false);
    navigate("/home");
  };

  const handleCancelClick = () => {
    if (hasUnsavedDraft) {
      setShowCancelModal(true);
      return;
    }
    clearFisaDraft(authUser?.id);
    navigate("/home");
  };

  const handleStayOnPage = () => {
    setShowLeaveModal(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  const handleLeavePage = () => {
    resetReportForm();
    setShowLeaveModal(false);
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  };

  if (authLoading || !initialFormValues) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="report-form-page">
      <div className="report-form-card">
        <div className="report-form-header">
          <h1 className="text-lg font-display font-bold text-gray-900 sm:text-2xl">Client Record</h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete all required fields to create a new client report
          </p>

          {showConsultantMeta && (
            <FisaConsultantBanner
              userName={authUser?.username || authUser?.email?.split("@")[0]}
              date={initialFormValues.todayDate}
            />
          )}
        </div>

        <Formik
          initialValues={initialFormValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setErrors, setTouched, resetForm }) => {
            formActionsRef.current.resetForm = resetForm;

            return (
            <>
              <div className="report-form-body">
                <FisaDraftSync
                  userId={authUser?.id}
                  isAdmin={isAdmin}
                  baseline={baselineValues}
                  currentStep={currentStep}
                  maxStepReached={maxStepReached}
                  onDirtyChange={handleDirtyChange}
                />
                <FisaReportStepper
                  steps={steps}
                  currentStep={currentStep}
                  maxStepReached={maxStepReached}
                  onStepClick={handleStepClick}
                />

                <div className="mt-4 sm:mt-6">
                  {!isReviewStep && (
                    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-3 text-center sm:mb-5 sm:rounded-xl sm:px-4">
                      <h3 className="text-sm font-display font-semibold text-gray-900 sm:text-base">
                        {currentStepConfig?.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">{currentStepConfig?.description}</p>
                    </div>
                  )}

                  {isReviewStep ? (
                    <>
                      <ReviewSummary
                        values={values}
                        allFields={allFields}
                        steps={steps}
                        showConsultantMeta={showConsultantMeta}
                      />
                      <div className="mx-auto mt-4 w-full max-w-lg space-y-2 sm:mt-6">
                        <StepFields
                          fields={currentStepFields}
                          touched={touched}
                          errors={errors}
                        />
                        <p className="text-xs text-gray-500">
                          In Progress while the case is still open. Choose Approved when the client is
                          fully resolved, or Denied when the client cannot be resolved.
                        </p>
                      </div>
                    </>
                  ) : (
                    <StepFields
                      fields={currentStepFields}
                      touched={touched}
                      errors={errors}
                    />
                  )}
                </div>
              </div>

              <Form className="report-form-actions">
                <Button
                  type="button"
                  variant="ghost"
                  text="Cancel"
                  onClick={handleCancelClick}
                  className="w-full md:w-auto"
                />

                <div className="report-form-actions__primary">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      text="Back"
                      onClick={handleBack}
                      className="w-full md:min-w-[110px]"
                    />
                  )}

                  {!isLastStep ? (
                    <Button
                      type="button"
                      variant="primary"
                      text="Continue"
                      onClick={() => handleNext(values, setErrors, setTouched)}
                      className="w-full md:min-w-[130px]"
                    />
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      text="Create Report"
                      loading={isSubmitting}
                      loadingText="Saving..."
                      className="w-full md:min-w-[150px]"
                    />
                  )}
                </div>
              </Form>

              <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelConfirm}
                title="Discard report?"
                message="All entered data will be lost. This action cannot be undone."
                confirmText="Yes, discard"
                cancelText="No, keep editing"
                confirmButtonType="delete"
              />

              <ConfirmModal
                isOpen={showLeaveModal}
                onClose={handleStayOnPage}
                onConfirm={handleLeavePage}
                title="Leave Client Record?"
                message="You have unsaved changes. Leaving will discard this report and clear your progress."
                confirmText="Yes, leave"
                cancelText="No, stay"
                confirmButtonType="primary"
              />
            </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default FormUser;
