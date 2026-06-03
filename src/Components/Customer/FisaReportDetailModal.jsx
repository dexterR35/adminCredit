import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Modal, ConfirmModal } from "../Modal";
import DetailField from "../Modal/DetailField";
import { Button } from "../Buttons";
import { Badge, statusBadgeVariant } from "../Badge";
import { LinkDataBadge } from "../Table/tableBadges";
import { LINK_BADGE_PRESETS } from "../Badge/badgeStyles";
import { fetchFisaReportById } from "../../services/fisaReports";
import { openTelLink } from "../../utils/phone";

const FisaReportDetailModal = ({
  report,
  isOpen,
  onClose,
  isAdmin = false,
  onDelete,
}) => {
  const [displayReport, setDisplayReport] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen || !report?.id) return undefined;

    setDisplayReport(report);

    let cancelled = false;

    const refresh = async () => {
      try {
        const row = await fetchFisaReportById(report.id);
        if (cancelled || !row) return;
        setDisplayReport(row);
      } catch (error) {
        console.error("Error loading fisa report:", error);
        toast.error("Could not refresh report details.");
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, [report, isOpen]);

  if (!isOpen || !report) return null;

  const row = displayReport || report;
  const form = row.form_data || {};
  const title = row.client_full_name || form.clientFullName || "Fisa report";

  const handleContact = () => {
    openTelLink(row.phone || form.phone);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(row.id);
      setConfirmDelete(false);
      onClose();
    } catch (error) {
      toast.error(error.message || "Could not delete report.");
    } finally {
      setDeleting(false);
    }
  };

  const footer = (
    <div className="flex flex-wrap justify-end gap-2">
      <Button variant="secondary" text="Close" type="button" onClick={onClose} />
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description="Fisa client report — review details and actions below."
        size="2xl"
        footer={footer}
        closeOnOverlay={false}
        closeOnEscape={false}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {row.user_status && (
              <Badge variant={statusBadgeVariant(row.user_status)} size="sm">
                {row.user_status}
              </Badge>
            )}
            {(row.phone || form.phone) && (
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
            {isAdmin && onDelete && (
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Consultant">{form.userName || "—"}</DetailField>
            <DetailField label="Report date">{row.today_date || form.todayDate}</DetailField>
            <DetailField label="Client">{row.client_full_name || form.clientFullName}</DetailField>
            <DetailField label="CNP">{row.client_cnp || form.clientCNP}</DetailField>
            <DetailField label="Phone">{row.phone || form.phone}</DetailField>
            <DetailField label="Email">{row.email || form.email}</DetailField>
            <DetailField label="Credit requested">
              {form.requestedCreditValue ?? "—"}
            </DetailField>
            <DetailField label="Created">{row.created_at_label}</DetailField>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Documents
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkDataBadge
                url={row.photo_url || form.photoUrl}
                viewLabel="View photo"
                missingLabel="No photo"
                {...LINK_BADGE_PRESETS.photo}
              />
              <LinkDataBadge
                url={row.pdf_url || form.pdfUrl}
                viewLabel="View PDF"
                missingLabel="No PDF"
                {...LINK_BADGE_PRESETS.pdf}
              />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure?"
        message={
          <>
            Delete fisa report for <strong>{title}</strong>? This cannot be undone.
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

FisaReportDetailModal.propTypes = {
  report: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default FisaReportDetailModal;
