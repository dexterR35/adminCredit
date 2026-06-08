import PropTypes from "prop-types";
import { Modal } from "../Modal";
import RemindersTableView from "./RemindersTableView";

const DueRemindersModal = ({
  isOpen,
  reminders = [],
  loading = false,
  onClose,
  onFinish,
  onPostpone,
  onOpenClient,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Due reminders"
    description="All due reminders in one place. Extend or complete each one."
    size="2xl"
    cancelText="Close"
  >
    <RemindersTableView
      reminders={reminders}
      loading={loading}
      emptyMessage="No due reminders right now."
      onFinish={onFinish}
      onPostpone={onPostpone}
      onOpenClient={onOpenClient}
    />
  </Modal>
);

DueRemindersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  reminders: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onFinish: PropTypes.func,
  onPostpone: PropTypes.func,
  onOpenClient: PropTypes.func,
};

export default DueRemindersModal;
