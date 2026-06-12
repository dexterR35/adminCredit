import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Modal } from "../../Components/Modal";
import { Button } from "../../Components/Buttons";
import { InputField, SelectField, TextareaField } from "../../Components/Inputs";
import { sanitizeFormValues } from "../../utils/sanitize";
import { downloadFisaReportFile } from "../../utils/fisaReportDownload";

const isTextareaField = (field) => field.as === "textarea";
const isSelectField = (field) => field.as === "select";

const normalizeFieldValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value;
  return String(value);
};

const valuesMatch = (left, right, fieldNames) =>
  fieldNames.every(
    (name) => normalizeFieldValue(left?.[name]) === normalizeFieldValue(right?.[name])
  );

const PreviewField = ({ field, value, onChange, disabled }) => {
  const commonProps = {
    label: field.label,
    name: field.name,
    value: value ?? "",
    onChange,
    disabled: disabled || field.disabled,
    required: field.required,
  };

  if (isSelectField(field)) {
    return (
      <SelectField
        {...commonProps}
        options={field.options || []}
        placeholder={field.placeholder || "Select"}
      />
    );
  }

  if (isTextareaField(field)) {
    return (
      <TextareaField
        {...commonProps}
        rows={field.rows || 2}
        placeholder={field.placeholder}
      />
    );
  }

  return (
    <InputField
      {...commonProps}
      type={field.type || "text"}
      placeholder={field.placeholder}
    />
  );
};

PreviewField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const FisaReportPreviewModal = ({
  isOpen,
  title = "Preview fisa report",
  description = "Review and correct the report before saving.",
  values,
  fields,
  fieldTypeMap,
  validationSchema,
  onSave,
  onClose,
  alreadyPersisted = false,
  readOnly = false,
}) => {
  const [draft, setDraft] = useState(values || {});
  const [saving, setSaving] = useState(false);
  const [savedValues, setSavedValues] = useState(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      const nextValues = values || {};
      setDraft(nextValues);
      setSavedValues(alreadyPersisted ? nextValues : null);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, values, alreadyPersisted]);

  const editableFields = useMemo(
    () => fields.filter((field) => field.name && field.name !== "user"),
    [fields]
  );

  const editableFieldNames = useMemo(
    () => editableFields.map((field) => field.name),
    [editableFields]
  );

  const isDirty = useMemo(() => {
    if (!savedValues) return true;
    return !valuesMatch(draft, savedValues, editableFieldNames);
  }, [draft, savedValues, editableFieldNames]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDraft((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sanitized = sanitizeFormValues(draft, fieldTypeMap);
      if (validationSchema) {
        await validationSchema.validate(sanitized, { abortEarly: false });
      }
      const saved = await onSave(sanitized);
      setDraft(saved || sanitized);
      setSavedValues(saved || sanitized);
      toast.success("Report saved.");
    } catch (error) {
      if (error.inner) {
        toast.error("Please correct the highlighted report fields.");
      } else {
        toast.error(error.message || "Could not save report.");
      }
    } finally {
      setSaving(false);
    }
  };

  const downloadValues = savedValues || draft;
  const canDownload = Boolean(savedValues) || readOnly;
  const canSave = !readOnly && isDirty && !saving;
  const fieldsDisabled = saving || readOnly;

  const footerHint = readOnly
    ? "View-only — download the saved report if needed."
    : canSave
      ? "Review the report, then save your changes."
      : canDownload
        ? "Saved version is ready to download."
        : "Save before downloading.";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="2xl"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            {footerHint}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              text="Download"
              type="button"
              disabled={!canDownload || saving}
              onClick={() =>
                downloadFisaReportFile({
                  values: downloadValues,
                  fields: editableFields,
                })
              }
            />
            {!readOnly && (
              <Button
                variant="primary"
                text="Save"
                type="button"
                loading={saving}
                loadingText="Saving..."
                disabled={!canSave}
                onClick={handleSave}
              />
            )}
            <Button
              variant="outline"
              text="Close"
              type="button"
              disabled={saving}
              onClick={onClose}
            />
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {editableFields.map((field) => (
          <PreviewField
            key={field.name}
            field={field}
            value={draft[field.name]}
            onChange={handleChange}
            disabled={fieldsDisabled}
          />
        ))}
      </div>
    </Modal>
  );
};

FisaReportPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  values: PropTypes.object,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  fieldTypeMap: PropTypes.object.isRequired,
  validationSchema: PropTypes.object,
  onSave: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  alreadyPersisted: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default FisaReportPreviewModal;
