import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  HiOutlineCalendarDays,
  HiOutlineCurrencyEuro,
  HiOutlinePencilSquare,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { Button } from "../Buttons";
import { Badge } from "../Badge";
import DetailField from "../Modal/DetailField";
import { DeleteConfirmModal } from "../Modal";
import { SelectField } from "../Inputs";
import { PhoneDataBadge } from "../Table/tableBadges";
import {
  assignFisaReportToUser,
  fetchFisaReportById,
  updateFisaReportData,
  updateFisaReportStatus,
} from "../../services/fisaReports";
import { getAllUsers } from "../../services/consultants";
import { saveFollowUpFromDraft } from "../../services/clientFollowUps";
import { isInProgressClientStatus, normalizeFisaStatus } from "../../services/fisaReportStatus";
import { useClientRemindersContext } from "../../context/ClientRemindersContext";
import {
  createEmptyFollowUpDraft,
  hasFollowUpDraftContent,
} from "../../utils/followUpDates";
import { useAuth } from "../../context/AuthContext";
import {
  DetailModalShell,
  DetailModalFooter,
  DetailSection,
  DetailStatusSelect,
  DetailAttachmentsSection,
  DetailFollowUpSection,
  useDetailRefresh,
  useDetailEditMode,
  useDetailDelete,
} from "./detailModal";
import {
  deleteFisaReportAttachment,
  fetchFisaReportAttachments,
  uploadFisaReportAttachment,
} from "../../services/fisaReportAttachments";
import { validateClientAttachmentFile } from "../../utils/fileUpload";
import { mergeFisaReportDocuments } from "../../utils/fisaReportDocuments";
import FisaReportPreviewModal from "../../Pages/Raports/FisaReportPreviewModal";
import {
  buildFisaReportFields,
  buildValidationSchemaForSteps,
  prepareRaportPayload,
  STEPS,
} from "../../Pages/Raports/fisaReportFormConfig";
import { buildFieldTypeMap } from "../../utils/sanitize";

const formatCreditValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (Number.isFinite(amount)) {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return String(value);
};

const FisaReportDetailModal = ({
  report,
  isOpen,
  onClose,
  onDelete,
  onReportUpdated,
}) => {
  const { user, isAdmin } = useAuth();
  const { refresh: refreshReminders } = useClientRemindersContext();
  const { isEditing, startEdit, cancelEdit } = useDetailEditMode(isOpen);
  const [statusValue, setStatusValue] = useState("In Progress");
  const [saving, setSaving] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [followUpDraft, setFollowUpDraft] = useState(createEmptyFollowUpDraft);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { row, setDisplayRow } = useDetailRefresh({
    isOpen,
    item: report,
    fetchById: fetchFisaReportById,
    errorMessage: "Could not refresh report details.",
  });

  useEffect(() => {
    if (!isOpen || !row?.user_status) return;
    setStatusValue(normalizeFisaStatus(row.user_status));
    setSelectedUserId(row.user_id || "");
  }, [isOpen, row?.id, row?.user_status, row?.user_id]);

  useEffect(() => {
    if (!isOpen || !isAdmin) return undefined;

    let cancelled = false;

    const loadUsers = async () => {
      try {
        const rows = await getAllUsers();
        if (!cancelled) setUsers(rows);
      } catch (error) {
        console.error("Error loading users for fisa assignment:", error);
        if (!cancelled) toast.error("Could not load users.");
      }
    };

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [isOpen, isAdmin]);

  useEffect(() => {
    if (!isOpen || !row?.id) {
      setAttachments([]);
      return undefined;
    }

    let cancelled = false;

    const loadAttachments = async () => {
      setAttachmentsLoading(true);
      try {
        const rows = await fetchFisaReportAttachments(row.id);
        if (!cancelled) setAttachments(rows);
      } catch (error) {
        console.error("Error loading fisa report attachments:", error);
        if (!cancelled) {
          setAttachments([]);
          toast.error(error.message || "Could not load documents.");
        }
      } finally {
        if (!cancelled) setAttachmentsLoading(false);
      }
    };

    loadAttachments();
    return () => {
      cancelled = true;
    };
  }, [isOpen, row?.id]);

  const {
    confirmDelete,
    setConfirmDelete,
    deleting,
    handleDeleteConfirm,
  } = useDetailDelete({
    onDelete,
    onClose,
    onAfterDelete: cancelEdit,
    errorMessage: "Could not delete report.",
  });

  const previewFields = useMemo(() => buildFisaReportFields(users), [users]);
  const previewFieldTypeMap = useMemo(
    () => buildFieldTypeMap(previewFields),
    [previewFields]
  );
  const previewValidationSchema = useMemo(
    () => buildValidationSchemaForSteps(previewFields, STEPS),
    [previewFields]
  );

  if (!isOpen || !report) return null;

  const form = row.form_data || {};
  const title = row.client_full_name || form.clientFullName || "Client record";
  const displayStatus = normalizeFisaStatus(row.user_status);
  const activeStatus = isEditing ? statusValue : displayStatus;
  const showFollowUps = isInProgressClientStatus(activeStatus);
  const canEdit = isAdmin || row.user_id === user?.id;
  const canDelete = canEdit && Boolean(onDelete);
  const canAssign = isAdmin;
  const assignedUser = users.find((item) => item.id === row.user_id);

  const handleStartEdit = () => {
    setStatusValue(displayStatus);
    setSelectedUserId(row.user_id || "");
    setFollowUpDraft(createEmptyFollowUpDraft());
    startEdit();
  };

  const handleCancelEdit = () => {
    setStatusValue(displayStatus);
    setSelectedUserId(row.user_id || "");
    setFollowUpDraft(createEmptyFollowUpDraft());
    cancelEdit();
  };

  const handleAssign = async () => {
    if (!row?.id || !selectedUserId || selectedUserId === row.user_id) return;

    setAssignLoading(true);
    try {
      const updated = await assignFisaReportToUser(row.id, selectedUserId);
      setDisplayRow(updated);
      setSelectedUserId(updated.user_id || "");
      onReportUpdated?.(updated);
      refreshReminders({ silent: true });
      toast.success("Report assigned successfully.");
    } catch (error) {
      toast.error(error.message || "Could not assign report.");
    } finally {
      setAssignLoading(false);
    }
  };

  const buildPreviewValues = () => ({
    ...form,
    user: row.user_id || form.user || "",
    userName:
      form.userName
      || assignedUser?.username
      || assignedUser?.email?.split("@")[0]
      || "",
    todayDate: row.today_date || form.todayDate || "",
    clientFullName: row.client_full_name || form.clientFullName || "",
    clientCNP: row.client_cnp || form.clientCNP || "",
    phone: row.phone || form.phone || "",
    email: row.email || form.email || "",
    userStatus: displayStatus,
  });

  const handlePreviewSave = async (values) => {
    const preparedData = prepareRaportPayload(values);
    const updated = await updateFisaReportData(row.id, preparedData, { isAdmin });
    setDisplayRow(updated);
    setStatusValue(normalizeFisaStatus(updated.user_status));
    onReportUpdated?.(updated);
    return updated.form_data || preparedData;
  };

  const handleAttachmentUpload = async (file) => {
    if (!row?.id || !canEdit || !isEditing) return;

    try {
      await validateClientAttachmentFile(file);
    } catch (error) {
      toast.error(error.message || "Invalid file.");
      return;
    }

    setAttachmentUploading(true);
    try {
      const uploaded = await uploadFisaReportAttachment(row.id, file);
      setAttachments((prev) => [uploaded, ...prev]);
      toast.success("Document uploaded.");
    } catch (error) {
      console.error("Error uploading fisa report attachment:", error);
      toast.error(error.message || "Could not upload document.");
    } finally {
      setAttachmentUploading(false);
    }
  };

  const handleAttachmentRemove = async (attachment) => {
    if (!canEdit || !isEditing) return;

    setAttachmentUploading(true);
    try {
      await deleteFisaReportAttachment(attachment);
      setAttachments((prev) => prev.filter((item) => item.id !== attachment.id));
      toast.success("Document removed.");
    } catch (error) {
      console.error("Error deleting fisa report attachment:", error);
      toast.error(error.message || "Could not remove document.");
    } finally {
      setAttachmentUploading(false);
    }
  };

  const handleSave = async () => {
    if (!canEdit) return;

    const nextStatus = normalizeFisaStatus(statusValue);
    const statusChanged = nextStatus !== displayStatus;
    const shouldSaveReminder =
      isInProgressClientStatus(nextStatus)
      && hasFollowUpDraftContent(followUpDraft);

    if (!statusChanged && !shouldSaveReminder) {
      cancelEdit();
      return;
    }

    setSaving(true);
    try {
      if (statusChanged) {
        const updated = await updateFisaReportStatus(row.id, nextStatus);
        setDisplayRow(updated);
        setStatusValue(normalizeFisaStatus(updated.user_status));
        onReportUpdated?.(updated);
      }

      if (shouldSaveReminder) {
        await saveFollowUpFromDraft({
          fisaReportId: row.id,
          draft: followUpDraft,
        });
        setFollowUpDraft(createEmptyFollowUpDraft());
        refreshReminders({ silent: true });
      }

      cancelEdit();
      toast.success("Changes saved.");
    } catch (error) {
      toast.error(error.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const documents = mergeFisaReportDocuments(row, attachments);
  const clientName = row.client_full_name || form.clientFullName || "—";
  const clientCnp = row.client_cnp || form.clientCNP;
  const clientPhone = row.phone || form.phone;
  const clientEmail = row.email || form.email;
  const reportDate = row.today_date || form.todayDate || "—";
  const consultantName = form.userName || "—";
  const creditRequested = formatCreditValue(form.requestedCreditValue);

  return (
    <>
      <DetailModalShell
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={
          isEditing
            ? "Update status, report fields, documents, or reminders."
            : "Client overview, report details, and available actions."
        }
        status={displayStatus}
        showStatus
        isEditing={isEditing}
        canDelete={canDelete}
        onDelete={() => setConfirmDelete(true)}
        footer={
          <DetailModalFooter
            isEditing={isEditing}
            canEdit={canEdit}
            canSave={canEdit}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
            onSave={handleSave}
            saving={saving}
            onClose={onClose}
          />
        }
      >
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Client
              </p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{clientName}</h3>
              {clientCnp ? (
                <p className="mt-1 text-sm text-gray-600">CNP {clientCnp}</p>
              ) : null}
            </div>

            {!isEditing && assignedUser ? (
              <div className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-gray-700 lg:max-w-xs">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Assigned consultant
                </p>
                <p className="mt-1 font-medium text-gray-900">{assignedUser.username}</p>
                <p className="truncate text-xs text-gray-500">{assignedUser.email}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {clientPhone ? (
              <PhoneDataBadge phone={clientPhone} />
            ) : (
              <Badge variant="default" size="sm">No phone</Badge>
            )}
            {clientEmail ? (
              <a
                href={`mailto:${clientEmail}`}
                className="inline-flex max-w-full items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="truncate">{clientEmail}</span>
              </a>
            ) : (
              <Badge variant="default" size="sm">No email</Badge>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-amber-900/70">
              Edit mode
            </p>
            <p className="mt-1 text-sm text-amber-950/80">
              Change the outcome, open the full report form, or manage documents and reminders below.
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <DetailStatusSelect
                name="fisa_report_status"
                value={statusValue}
                onChange={(event) => setStatusValue(event.target.value)}
                disabled={saving}
              />
              <Button
                variant="info"
                text="Edit report fields"
                type="button"
                disabled={saving}
                icon={<HiOutlinePencilSquare className="h-4 w-4" aria-hidden />}
                onClick={() => setPreviewOpen(true)}
                className="w-full lg:w-auto"
              />
            </div>
          </div>
        )}

        <DetailSection
          title="Report summary"
          description="Key details from the saved fisa report."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField label="Consultant">
              <span className="inline-flex items-center gap-2">
                <HiOutlineUserCircle className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                {consultantName}
              </span>
            </DetailField>
            <DetailField label="Report date">
              <span className="inline-flex items-center gap-2">
                <HiOutlineCalendarDays className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                {reportDate}
              </span>
            </DetailField>
            <DetailField label="Credit requested">
              <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                <HiOutlineCurrencyEuro className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                {creditRequested}
              </span>
            </DetailField>
            <DetailField label="Created">{row.created_at_label || "—"}</DetailField>
          </div>
        </DetailSection>

        {canAssign && isEditing && (
          <DetailSection
            title="Assignment"
            description="Transfer this client record to another consultant."
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <SelectField
                label="Consultant"
                name="fisa_user_assign"
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                options={users.map((item) => ({
                  value: item.id,
                  label: `${item.username} (${item.email})`,
                }))}
                placeholder="Select consultant"
                className="min-w-0 flex-1"
              />
              <Button
                variant="primary"
                text="Assign"
                onClick={handleAssign}
                disabled={
                  !selectedUserId
                  || selectedUserId === row.user_id
                  || assignLoading
                  || saving
                }
                loading={assignLoading}
                loadingText="Assigning..."
                type="button"
                className="w-full sm:w-auto sm:shrink-0"
              />
            </div>
          </DetailSection>
        )}

        <DetailAttachmentsSection
          attachments={documents}
          isEditing={isEditing && canEdit}
          disabled={saving || attachmentsLoading}
          uploading={attachmentUploading}
          onUpload={canEdit ? handleAttachmentUpload : undefined}
          onRemove={canEdit ? handleAttachmentRemove : undefined}
        />

        {showFollowUps && (
          <DetailFollowUpSection
            fisaReportId={row.id}
            clientName={title}
            isEditing={isEditing}
            disabled={saving}
            draft={followUpDraft}
            onDraftChange={setFollowUpDraft}
            onRemindersChanged={() => refreshReminders({ silent: true })}
          />
        )}
      </DetailModalShell>

      <DeleteConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleDeleteConfirm(row.id)}
        loading={deleting}
        subject={title}
        recordLabel="client record"
      />

      <FisaReportPreviewModal
        isOpen={previewOpen}
        title="Preview fisa report"
        description="Review and correct all report fields before saving."
        values={buildPreviewValues()}
        fields={previewFields}
        fieldTypeMap={previewFieldTypeMap}
        validationSchema={previewValidationSchema}
        onSave={handlePreviewSave}
        onClose={() => setPreviewOpen(false)}
        alreadyPersisted
      />
    </>
  );
};

FisaReportDetailModal.propTypes = {
  report: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onReportUpdated: PropTypes.func,
};

export default FisaReportDetailModal;
