import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import DetailField from "../Modal/DetailField";
import { DeleteConfirmModal } from "../Modal";
import { PhoneDataBadge } from "../Table/tableBadges";
import { fetchFisaReportById, updateFisaReportStatus } from "../../services/fisaReports";
import { normalizeFisaStatus } from "../../services/fisaReportStatus";
import { useAuth } from "../../context/AuthContext";
import {
  DetailModalShell,
  DetailModalFooter,
  DetailStatusSelect,
  DetailDocumentsSection,
  useDetailRefresh,
  useDetailEditMode,
  useDetailDelete,
} from "./detailModal";

const FisaReportDetailModal = ({
  report,
  isOpen,
  onClose,
  onDelete,
  onReportUpdated,
}) => {
  const { user, isAdmin } = useAuth();
  const { isEditing, startEdit, cancelEdit } = useDetailEditMode(isOpen);
  const [statusValue, setStatusValue] = useState("Pending");
  const [saving, setSaving] = useState(false);

  const { row, setDisplayRow } = useDetailRefresh({
    isOpen,
    item: report,
    fetchById: fetchFisaReportById,
    errorMessage: "Could not refresh report details.",
  });

  useEffect(() => {
    if (!isOpen || !row?.user_status) return;
    setStatusValue(normalizeFisaStatus(row.user_status));
  }, [isOpen, row?.id, row?.user_status]);

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

  if (!isOpen || !report) return null;

  const form = row.form_data || {};
  const title = row.client_full_name || form.clientFullName || "Client record";
  const displayStatus = normalizeFisaStatus(row.user_status);
  const canEdit = isAdmin || row.user_id === user?.id;
  const canDelete = canEdit && Boolean(onDelete);

  const handleStartEdit = () => {
    setStatusValue(displayStatus);
    startEdit();
  };

  const handleCancelEdit = () => {
    setStatusValue(displayStatus);
    cancelEdit();
  };

  const handleSave = async () => {
    if (!canEdit) return;

    const nextStatus = normalizeFisaStatus(statusValue);
    if (nextStatus === displayStatus) {
      cancelEdit();
      return;
    }

    setSaving(true);
    try {
      const updated = await updateFisaReportStatus(row.id, nextStatus);
      setDisplayRow(updated);
      setStatusValue(normalizeFisaStatus(updated.user_status));
      onReportUpdated?.(updated);
      cancelEdit();
      toast.success("Status updated.");
    } catch (error) {
      toast.error(error.message || "Could not update status.");
    } finally {
      setSaving(false);
    }
  };

  const documents = [
    {
      key: "photo",
      url: row.photo_url || form.photoUrl,
      viewLabel: "View photo",
      missingLabel: "No photo",
      preset: "photo",
    },
    {
      key: "pdf",
      url: row.pdf_url || form.pdfUrl,
      viewLabel: "View PDF",
      missingLabel: "No PDF",
      preset: "pdf",
    },
  ];

  return (
    <>
      <DetailModalShell
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description="Client record — review details and actions below."
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
        {isEditing && (
          <DetailStatusSelect
            name="fisa_report_status"
            value={statusValue}
            onChange={(event) => setStatusValue(event.target.value)}
            disabled={saving}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Consultant">{form.userName || "—"}</DetailField>
          <DetailField label="Report date">{row.today_date || form.todayDate}</DetailField>
          <DetailField label="Client">{row.client_full_name || form.clientFullName}</DetailField>
          <DetailField label="CNP">{row.client_cnp || form.clientCNP}</DetailField>
          <DetailField label="Phone">
            <PhoneDataBadge phone={row.phone || form.phone} />
          </DetailField>
          <DetailField label="Email">{row.email || form.email}</DetailField>
          <DetailField label="Credit requested">{form.requestedCreditValue ?? "—"}</DetailField>
          <DetailField label="Created">{row.created_at_label}</DetailField>
        </div>

        <DetailDocumentsSection items={documents} />
      </DetailModalShell>

      <DeleteConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleDeleteConfirm(row.id)}
        loading={deleting}
        subject={title}
        recordLabel="client record"
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
