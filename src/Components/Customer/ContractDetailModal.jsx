import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Modal, ConfirmModal } from "../Modal";
import DetailField from "../Modal/DetailField";
import { Button } from "../Buttons";
import { Badge } from "../Badge";
import { LinkDataBadge } from "../Table/tableBadges";
import { LINK_BADGE_PRESETS } from "../Badge/badgeStyles";
import { fetchContractById } from "../../services/contracts";
import { openTelLink } from "../../utils/phone";

const contractFullName = (row) =>
  [row?.first_name, row?.last_name].filter(Boolean).join(" ").trim();

const ContractDetailModal = ({
  contract,
  isOpen,
  onClose,
  isAdmin = false,
  onDelete,
}) => {
  const [displayContract, setDisplayContract] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen || !contract?.id) return undefined;

    setDisplayContract(contract);

    let cancelled = false;

    const refresh = async () => {
      try {
        const row = await fetchContractById(contract.id);
        if (cancelled || !row) return;
        setDisplayContract(row);
      } catch (error) {
        console.error("Error loading contract:", error);
        toast.error("Could not refresh contract details.");
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, [contract, isOpen]);

  if (!isOpen || !contract) return null;

  const row = displayContract || contract;
  const fullName = contractFullName(row) || "Contract details";

  const handleContact = () => {
    openTelLink(row.phone);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(row.id);
      setConfirmDelete(false);
      onClose();
    } catch (error) {
      toast.error(error.message || "Could not delete contract.");
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
        title={fullName}
        description="Contract submission — review details and actions below."
        size="2xl"
        footer={footer}
        closeOnOverlay={false}
        closeOnEscape={false}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {row.phone && (
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
            <DetailField label="First name">{row.first_name}</DetailField>
            <DetailField label="Last name">{row.last_name}</DetailField>
            <DetailField label="Phone">{row.phone}</DetailField>
            <DetailField label="Email">{row.email}</DetailField>
            <DetailField label="Created">{row.created_at_label}</DetailField>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Documents
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkDataBadge
                url={row.photo_url}
                viewLabel="View photo"
                missingLabel="No photo"
                {...LINK_BADGE_PRESETS.photo}
              />
              <LinkDataBadge
                url={row.pdf_url}
                viewLabel="View PDF"
                missingLabel="No PDF"
                {...LINK_BADGE_PRESETS.pdf}
              />
              <LinkDataBadge
                url={row.signature_url}
                viewLabel="View signature"
                missingLabel="No signature"
                {...LINK_BADGE_PRESETS.signature}
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
            Delete contract for <strong>{fullName}</strong>? This cannot be undone.
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

ContractDetailModal.propTypes = {
  contract: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default ContractDetailModal;
