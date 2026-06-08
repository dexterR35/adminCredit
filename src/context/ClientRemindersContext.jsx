import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useClientReminders } from "../hooks/useClientReminders";
import { useAuth } from "./AuthContext";
import DueRemindersModal from "../Components/Reminders/DueRemindersModal";
import {
  buildHomeRemindersFisaSearch,
  buildHomeRemindersWebClientSearch,
} from "../utils/clientModalRoute";

const ClientRemindersContext = createContext(null);

export const ClientRemindersProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const value = useClientReminders({ enabled: Boolean(user) });

  const handleOpenClient = (reminder) => {
    value.closeDueModal();

    if (reminder.source === "web_client" && reminder.credit_application_id) {
      navigate(`/home?${buildHomeRemindersWebClientSearch(reminder.credit_application_id)}`);
      return;
    }

    if (reminder.fisa_report_id) {
      navigate(`/home?${buildHomeRemindersFisaSearch(reminder.fisa_report_id)}`);
    }
  };

  const handleFinish = async (id) => {
    await value.dismiss(id);
    await value.refresh({ silent: true });
  };

  const handlePostpone = async (id, followUpAt) => {
    await value.postpone(id, followUpAt);
    await value.refresh({ silent: true });
  };

  return (
    <ClientRemindersContext.Provider value={value}>
      {children}

      <DueRemindersModal
        isOpen={value.dueModalOpen && value.dueReminders.length > 0}
        reminders={value.dueReminders}
        loading={value.loading}
        onClose={value.closeDueModal}
        onFinish={handleFinish}
        onPostpone={handlePostpone}
        onOpenClient={handleOpenClient}
      />
    </ClientRemindersContext.Provider>
  );
};

ClientRemindersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useClientRemindersContext = () => {
  const context = useContext(ClientRemindersContext);
  if (!context) {
    throw new Error("useClientRemindersContext must be used within ClientRemindersProvider");
  }
  return context;
};
