import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Modal, ConfirmModal } from "../Modal";
import { Button } from "../Buttons";
import { Badge, statusBadgeVariant, yesNoBadgeVariant } from "../Badge";
import {
  InputField,
  SelectField,
  optionsFromEntries,
} from "../Inputs";
import {
  fetchWebClientById,
  REFERRAL_LABELS,
} from "../../services/customers";
import { sanitizeFormValues } from "../../utils/sanitize";
import { openTelLink } from "../../utils/phone";
import DetailField from "../Modal/DetailField";

const referralOptions = optionsFromEntries(REFERRAL_LABELS);

const YesNoFlag = ({ label, value, isEditing, onToggle }) => (
  <div className="inline-flex items-center gap-2">
    <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
    {isEditing ? (
      <Badge
        as="button"
        type="button"
        variant={yesNoBadgeVariant(value)}
        size="sm"
        interactive
        onClick={onToggle}
      >
        {value ? "Yes" : "No"}
      </Badge>
    ) : (
      <Badge variant={yesNoBadgeVariant(value)} size="sm">
        {value ? "Yes" : "No"}
      </Badge>
    )}
  </div>
);

YesNoFlag.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
  onToggle: PropTypes.func,
};

const emptyFormValues = {
  full_name: "",
  phone: "",
  email: "",
  employment_start_date: "",
  referral_source: "",
  has_banking_history: false,
  has_negative_bc_report: false,
};

const valuesFromRow = (row) => ({
  full_name: row.full_name || "",
  phone: row.phone || "",
  email: row.email || "",
  employment_start_date: row.employment_start_date || "",
  referral_source: row.referral_source || "",
  has_banking_history: row.has_banking_history === true,
  has_negative_bc_report: row.has_negative_bc_report === true,
});

const ClientDetailModal = ({
  client,
  isOpen,
  onClose,
  isAdmin = false,
  consultants = [],
  updateCustomer,
  onDelete,
  onAssign,
  onClientUpdated,
  assignLoading = false,
}) => {
  const [displayClient, setDisplayClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(emptyFormValues);
  const [saving, setSaving] = useState(false);
  const [selectedConsultantId, setSelectedConsultantId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canEdit = Boolean(updateCustomer);
  const fieldsDisabled = !isEditing || !canEdit;

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      return;
    }

    if (!client?.id) return;

    setDisplayClient(client);
    setSelectedConsultantId(client.assigned_user_id || "");
    setIsEditing(false);

    let cancelled = false;

    const refresh = async () => {
      try {
        const row = await fetchWebClientById(client.id);
        if (cancelled || !row) return;
        setDisplayClient(row);
        setSelectedConsultantId(row.assigned_user_id || "");
      } catch (error) {
        console.error("Error loading web client:", error);
        toast.error("Could not refresh client details.");
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  const row = displayClient || client;
  const fieldValues = isEditing ? editValues : valuesFromRow(row);
  const assignedConsultant = consultants.find((c) => c.id === row.assigned_user_id);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStartEdit = () => {
    setEditValues(valuesFromRow(row));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditValues(valuesFromRow(row));
    setIsEditing(false);
  };

  const handleContact = () => {
    openTelLink(fieldValues.phone || row.phone);
  };

  const handleAssign = async () => {
    if (!selectedConsultantId || !onAssign) return;
    await onAssign(row, selectedConsultantId);
    setDisplayClient((prev) =>
      prev ? { ...prev, assigned_user_id: selectedConsultantId } : prev
    );
  };

  const handleSave = async () => {
    if (!isEditing || !row.id || !updateCustomer) return;

    setSaving(true);
    try {
      const sanitized = sanitizeFormValues(editValues, {
        full_name: "text",
        phone: "phone",
        email: "email",
        referral_source: "text",
        employment_start_date: "date",
      });

      await updateCustomer(row.id, sanitized);
      const refreshed = await fetchWebClientById(row.id);
      if (refreshed) {
        setDisplayClient(refreshed);
        setEditValues(valuesFromRow(refreshed));
        onClientUpdated?.(refreshed);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating web client:", error);
      toast.error(error.message || "Could not save client.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(row.id);
      setConfirmDelete(false);
      onClose();
    } catch (error) {
      toast.error(error.message || "Could not delete client.");
    } finally {
      setDeleting(false);
    }
  };

  const footer = (
    <div className="flex flex-wrap justify-end gap-2">
      {isEditing && canEdit ? (
        <>
          <Button
            variant="secondary"
            text="Cancel"
            type="button"
            onClick={handleCancelEdit}
            disabled={saving}
          />
          <Button
            variant="primary"
            text="Save"
            type="button"
            onClick={handleSave}
            loading={saving}
            loadingText="Saving..."
          />
        </>
      ) : (
        <Button variant="secondary" text="Close" type="button" onClick={onClose} />
      )}
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={fieldValues.full_name || row.full_name || "Client details"}
        description="Web form submission — review details and actions below."
        size="2xl"
        footer={footer}
        closeOnOverlay={false}
        closeOnEscape={false}
      >
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {row.status && (
                <Badge variant={statusBadgeVariant(row.status)} size="sm">
                  {row.status}
                </Badge>
              )}
              {!isEditing && (fieldValues.phone || row.phone) && (
                <Badge
                  as="button"
                  type="button"
                  variant="info"
                  size="sm"
                  interactive
                  onClick={handleContact}
                >
                  Contact
                </Badge>
              )}
              {canEdit && !isEditing && (
                <Badge
                  as="button"
                  type="button"
                  variant="edit"
                  size="sm"
                  interactive
                  onClick={handleStartEdit}
                >
                  Edit
                </Badge>
              )}
              {isAdmin && onDelete && !isEditing && (
                <Badge
                  as="button"
                  type="button"
                  variant="danger"
                  size="sm"
                  interactive
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </Badge>
              )}
              {isEditing && (
                <span className="text-xs font-medium text-primary-600">
                  Editing — click Save when done
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InputField
                label="Name"
                name="full_name"
                value={fieldValues.full_name}
                onChange={handleChange}
                disabled={fieldsDisabled}
                required={isEditing}
              />
              <InputField
                label="Phone"
                name="phone"
                type="tel"
                value={fieldValues.phone}
                onChange={handleChange}
                disabled={fieldsDisabled}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={fieldValues.email}
                onChange={handleChange}
                disabled={fieldsDisabled}
              />
              <SelectField
                label="Source"
                name="referral_source"
                value={fieldValues.referral_source}
                onChange={handleChange}
                options={referralOptions}
                placeholder="Select source"
                disabled={fieldsDisabled}
              />
              <DetailField label="Path">{row.path_label}</DetailField>
              <DetailField label="Outcome">{row.outcome_label}</DetailField>
              <InputField
                label="Employment date"
                name="employment_start_date"
                type="date"
                value={fieldValues.employment_start_date}
                onChange={handleChange}
                disabled={fieldsDisabled}
              />
              <DetailField label="Banks">{row.banks}</DetailField>
              <DetailField label="IFN">{row.ifn}</DetailField>
              <DetailField label="Others">{row.others}</DetailField>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <YesNoFlag
                label="Bank history"
                value={fieldValues.has_banking_history}
                isEditing={isEditing && canEdit}
                onToggle={() =>
                  setEditValues((prev) => ({
                    ...prev,
                    has_banking_history: !prev.has_banking_history,
                  }))
                }
              />
              <YesNoFlag
                label="Negative BC"
                value={fieldValues.has_negative_bc_report}
                isEditing={isEditing && canEdit}
                onToggle={() =>
                  setEditValues((prev) => ({
                    ...prev,
                    has_negative_bc_report: !prev.has_negative_bc_report,
                  }))
                }
              />
            </div>

            {assignedConsultant && !isEditing && (
              <DetailField label="Assigned to">
                {assignedConsultant.username} ({assignedConsultant.email})
              </DetailField>
            )}

            {isAdmin && onAssign && !isEditing && (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  Assign to consultant
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <SelectField
                    label="Consultant"
                    name="consultant_assign"
                    value={selectedConsultantId}
                    onChange={(e) => setSelectedConsultantId(e.target.value)}
                    options={consultants.map((c) => ({
                      value: c.id,
                      label: `${c.username} (${c.email})`,
                    }))}
                    placeholder="Select consultant"
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    text="Assign"
                    onClick={handleAssign}
                    disabled={!selectedConsultantId || assignLoading}
                    loading={assignLoading}
                    loadingText="Assigning..."
                    type="button"
                    className="sm:shrink-0"
                  />
                </div>
              </div>
            )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure?"
        message={
          <>
            Delete <strong>{row.full_name}</strong>? This cannot be undone.
          </>
        }
        confirmText="Yes"
        cancelText="No"
        confirmButtonType="delete"
        loading={deleting}
      />
    </>
  );
};

ClientDetailModal.propTypes = {
  client: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  consultants: PropTypes.arrayOf(PropTypes.object),
  updateCustomer: PropTypes.func,
  onDelete: PropTypes.func,
  onAssign: PropTypes.func,
  onClientUpdated: PropTypes.func,
  assignLoading: PropTypes.bool,
};

export default ClientDetailModal;
