import PropTypes from "prop-types";
import DetailField from "../Modal/DetailField";
import { DeleteConfirmModal } from "../Modal";
import { PhoneDataBadge } from "../Table/tableBadges";
import { fetchContractById } from "../../services/contracts";
import {
  DetailModalShell,
  DetailModalFooter,
  DetailDocumentsSection,
  useDetailRefresh,
  useDetailEditMode,
  useDetailDelete,
} from "./detailModal";

const contractFullName = (row) =>
  [row?.first_name, row?.last_name].filter(Boolean).join(" ").trim();

const ContractDetailModal = ({
  contract,
  isOpen,
  onClose,
  isAdmin = false,
  onDelete,
}) => {
  const { isEditing, startEdit, cancelEdit } = useDetailEditMode(isOpen);
  const canDelete = isAdmin && Boolean(onDelete);

  const { row } = useDetailRefresh({
    isOpen,
    item: contract,
    fetchById: fetchContractById,
    errorMessage: "Could not refresh contract details.",
  });

  const {
    confirmDelete,
    setConfirmDelete,
    deleting,
    handleDeleteConfirm,
  } = useDetailDelete({
    onDelete,
    onClose,
    onAfterDelete: cancelEdit,
    errorMessage: "Could not delete contract.",
  });

  if (!isOpen || !contract) return null;

  const fullName = contractFullName(row) || "Contract details";

  const documents = [
    {
      key: "photo",
      url: row.photo_url,
      viewLabel: "View photo",
      missingLabel: "No photo",
      preset: "photo",
    },
    {
      key: "pdf",
      url: row.pdf_url,
      viewLabel: "View PDF",
      missingLabel: "No PDF",
      preset: "pdf",
    },
    {
      key: "signature",
      url: row.signature_url,
      viewLabel: "View signature",
      missingLabel: "No signature",
      preset: "signature",
    },
  ];

  return (
    <>
      <DetailModalShell
        isOpen={isOpen}
        onClose={onClose}
        title={fullName}
        description="Contract submission — review details and actions below."
        isEditing={isEditing}
        canDelete={canDelete}
        onDelete={() => setConfirmDelete(true)}
        footer={
          <DetailModalFooter
            isEditing={isEditing}
            canEdit={canDelete}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onClose={onClose}
          />
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="First name">{row.first_name}</DetailField>
          <DetailField label="Last name">{row.last_name}</DetailField>
          <DetailField label="Phone">
            <PhoneDataBadge phone={row.phone} />
          </DetailField>
          <DetailField label="Email">{row.email}</DetailField>
          <DetailField label="Created">{row.created_at_label}</DetailField>
        </div>

        <DetailDocumentsSection items={documents} />
      </DetailModalShell>

      <DeleteConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => handleDeleteConfirm(row.id)}
        loading={deleting}
        subject={fullName}
        recordLabel="contract"
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
