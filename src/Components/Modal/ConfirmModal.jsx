import PropTypes from "prop-types";
import { Modal } from "./Modal";

/**
 * Yes / No confirmation modal — delete, assign, or any destructive action.
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
  description,
  confirmText = "Yes",
  cancelText = "No",
  confirmButtonType = "delete",
  loading = false,
  size = "sm",
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    description={description}
    size={size}
    cancelText={cancelText}
    confirmText={confirmText}
    onConfirm={onConfirm}
    confirmButtonType={confirmButtonType}
    confirmLoading={loading}
  >
    {message && <p className="text-sm text-gray-600">{message}</p>}
  </Modal>
);

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmButtonType: PropTypes.string,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "2xl"]),
};

export default ConfirmModal;
