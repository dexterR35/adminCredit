import PropTypes from "prop-types";
import ConfirmModal from "./ConfirmModal";

const DELETE_TITLE = "Are you sure?";
const DELETE_CONFIRM_TEXT = "Yes";
const DELETE_CANCEL_TEXT = "No";

const buildDeleteMessage = ({ subject, recordLabel = "record", count = 1 }) => {
  if (count > 1) {
    return (
      <>
        Delete {count} selected {recordLabel}? This cannot be undone.
      </>
    );
  }

  return (
    <>
      Delete {recordLabel} for <strong>{subject}</strong>? This cannot be undone.
    </>
  );
};

const getRowDeleteSubject = (row = {}) => {
  const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return (
    row.full_name ||
    row.client_full_name ||
    fullName ||
    row.email ||
    row.phone ||
    row.id ||
    "this record"
  );
};

/** Props for DataTable delete (single row name or bulk count) */
export const getTableDeleteConfirm = (rows = []) => {
  const count = rows.length;
  if (count <= 1) {
    const subject = count === 1 ? getRowDeleteSubject(rows[0]?.original) : "this record";
    return { count: 1, subject, recordLabel: "record" };
  }
  return {
    count,
    subject: `${count} selected records`,
    recordLabel: "records",
  };
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  subject,
  recordLabel = "record",
  count = 1,
  title = DELETE_TITLE,
  confirmText = DELETE_CONFIRM_TEXT,
  cancelText = DELETE_CANCEL_TEXT,
}) => (
  <ConfirmModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title={title}
    message={buildDeleteMessage({ subject, recordLabel, count })}
    confirmText={confirmText}
    cancelText={cancelText}
    confirmButtonType="delete"
    loading={loading}
  />
);

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  subject: PropTypes.node.isRequired,
  recordLabel: PropTypes.string,
  count: PropTypes.number,
  title: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default DeleteConfirmModal;
