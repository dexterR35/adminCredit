import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Button } from "../Buttons";
import { Badge, yesNoBadgeVariant } from "../Badge";
import {
  InputField,
  SelectField,
  optionsFromEntries,
} from "../Inputs";
import {
  fetchWebClientById,
  REFERRAL_LABELS,
  updateWebClientStatus,
} from "../../services/customers";
import { normalizeFisaStatus } from "../../services/fisaReportStatus";
import { sanitizeFormValues } from "../../utils/sanitize";
import DetailField from "../Modal/DetailField";
import { DeleteConfirmModal } from "../Modal";
import { PhoneDataBadge } from "../Table/tableBadges";
import {
  DetailModalShell,
  DetailModalFooter,
  DetailStatusSelect,
  useDetailRefresh,
  useDetailEditMode,
  useDetailDelete,
} from "./detailModal";

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
  users = [],
  updateCustomer,
  onDelete,
  onAssign,
  onClientUpdated,
  assignLoading = false,
}) => {
  const { isEditing, startEdit, cancelEdit } = useDetailEditMode(isOpen);
  const [editValues, setEditValues] = useState(emptyFormValues);
  const [saving, setSaving] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [statusValue, setStatusValue] = useState("Pending");
  const canEditFields = Boolean(updateCustomer);
  const canDelete = isAdmin && Boolean(onDelete);
  const canAssign = isAdmin && Boolean(onAssign);
  const canOpenEditMode = canEditFields || canAssign;
  const fieldsDisabled = !isEditing || !canEditFields;

  const { row, setDisplayRow } = useDetailRefresh({
    isOpen,
    item: client,
    fetchById: fetchWebClientById,
    errorMessage: "Could not refresh client details.",
  });

  useEffect(() => {
    if (!isOpen || !row?.id) return;
    setSelectedUserId(row.assigned_user_id || "");
    if (!isEditing) {
      setStatusValue(normalizeFisaStatus(row.status));
    }
  }, [isOpen, row?.id, row?.assigned_user_id, row?.status, isEditing]);

  const {
    confirmDelete,
    setConfirmDelete,
    deleting,
    handleDeleteConfirm,
  } = useDetailDelete({
    onDelete,
    onClose,
    onAfterDelete: cancelEdit,
    errorMessage: "Could not delete client.",
  });

  if (!isOpen || !client) return null;

  const fieldValues = isEditing ? editValues : valuesFromRow(row);
  const assignedUser = users.find((user) => user.id === row.assigned_user_id);
  const displayStatus = normalizeFisaStatus(row.status);
  const title = fieldValues.full_name || row.full_name || "Client details";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStartEdit = () => {
    setEditValues(valuesFromRow(row));
    setStatusValue(displayStatus);
    setSelectedUserId(row.assigned_user_id || "");
    startEdit();
  };

  const handleCancelEdit = () => {
    setEditValues(valuesFromRow(row));
    setStatusValue(displayStatus);
    setSelectedUserId(row.assigned_user_id || "");
    cancelEdit();
  };

  const handleAssign = async () => {
    if (!selectedUserId || !onAssign) return;
    await onAssign(row, selectedUserId);
    setDisplayRow((prev) =>
      prev ? { ...prev, assigned_user_id: selectedUserId } : prev
    );
  };

  const handleSave = async () => {
    if (!isEditing || !row.id) return;

    setSaving(true);
    try {
      if (canEditFields) {
        const sanitized = sanitizeFormValues(editValues, {
          full_name: "text",
          phone: "phone",
          email: "email",
          referral_source: "text",
          employment_start_date: "date",
        });
        await updateCustomer(row.id, sanitized);
      }

      const nextStatus = normalizeFisaStatus(statusValue);
      if (nextStatus !== displayStatus) {
        await updateWebClientStatus(row.id, nextStatus);
      }

      const refreshed = await fetchWebClientById(row.id);
      if (refreshed) {
        setDisplayRow(refreshed);
        setEditValues(valuesFromRow(refreshed));
        setStatusValue(normalizeFisaStatus(refreshed.status));
        setSelectedUserId(refreshed.assigned_user_id || "");
        onClientUpdated?.(refreshed);
      }
      cancelEdit();
      toast.success("Changes saved.");
    } catch (error) {
      console.error("Error updating web client:", error);
      toast.error(error.message || "Could not save client.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DetailModalShell
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description="Web form submission — review details and actions below."
        status={displayStatus}
        showStatus
        isEditing={isEditing}
        canDelete={canDelete}
        onDelete={() => setConfirmDelete(true)}
        footer={
          <DetailModalFooter
            isEditing={isEditing}
            canEdit={canOpenEditMode}
            canSave={canOpenEditMode}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSave={handleSave}
            saving={saving}
            onClose={onClose}
            leading={
              canAssign && isEditing ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <SelectField
                    label="Assign to user"
                    name="user_assign"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    options={users.map((user) => ({
                      value: user.id,
                      label: `${user.username} (${user.email})`,
                    }))}
                    placeholder="Select user"
                    className="min-w-0 flex-1"
                  />
                  <Button
                    variant="primary"
                    text="Assign"
                    onClick={handleAssign}
                    disabled={!selectedUserId || assignLoading || saving}
                    loading={assignLoading}
                    loadingText="Assigning..."
                    type="button"
                    className="w-full sm:w-auto sm:shrink-0"
                  />
                </div>
              ) : null
            }
          />
        }
      >
        {isEditing && (
          <DetailStatusSelect
            name="client_status"
            value={statusValue}
            onChange={(event) => setStatusValue(event.target.value)}
            disabled={saving}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InputField
            label="Name"
            name="full_name"
            value={fieldValues.full_name}
            onChange={handleChange}
            disabled={fieldsDisabled}
            required={isEditing}
          />
          {isEditing ? (
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              value={fieldValues.phone}
              onChange={handleChange}
              disabled={fieldsDisabled}
            />
          ) : (
            <DetailField label="Phone">
              <PhoneDataBadge phone={fieldValues.phone || row.phone} />
            </DetailField>
          )}
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
            isEditing={isEditing && canEditFields}
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
            isEditing={isEditing && canEditFields}
            onToggle={() =>
              setEditValues((prev) => ({
                ...prev,
                has_negative_bc_report: !prev.has_negative_bc_report,
              }))
            }
          />
        </div>

        {assignedUser && !isEditing && (
          <DetailField label="Assigned to">
            {assignedUser.username} ({assignedUser.email})
          </DetailField>
        )}

      </DetailModalShell>

      <DeleteConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleDeleteConfirm(row.id)}
        loading={deleting}
        subject={row.full_name}
      />
    </>
  );
};

ClientDetailModal.propTypes = {
  client: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.object),
  updateCustomer: PropTypes.func,
  onDelete: PropTypes.func,
  onAssign: PropTypes.func,
  onClientUpdated: PropTypes.func,
  assignLoading: PropTypes.bool,
};

export default ClientDetailModal;
