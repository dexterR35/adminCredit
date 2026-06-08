import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useClientReminders } from "../hooks/useClientReminders";
import { useAuth } from "./AuthContext";
import DueRemindersModal from "../Components/Reminders/DueRemindersModal";
import ClientDetailModal from "../Components/Customer/ClientDetailModal";
import FisaReportDetailModal from "../Components/Customer/FisaReportDetailModal";
import { fetchWebClientById } from "../services/customers";
import { fetchFisaReportById } from "../services/fisaReports";

const ClientRemindersContext = createContext(null);

export const ClientRemindersProvider = ({ children }) => {
  const { user } = useAuth();
  const value = useClientReminders({ enabled: Boolean(user) });
  const [webClient, setWebClient] = useState(null);
  const [fisaReport, setFisaReport] = useState(null);

  const handleOpenClient = async (reminder) => {
    value.closeDueModal();
    try {
      if (reminder.source === "web_client" && reminder.credit_application_id) {
        const row = await fetchWebClientById(reminder.credit_application_id);
        setWebClient(row);
      } else if (reminder.fisa_report_id) {
        const row = await fetchFisaReportById(reminder.fisa_report_id);
        setFisaReport(row);
      }
    } catch (error) {
      console.error("Error opening client from reminder:", error);
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

      <ClientDetailModal
        client={webClient}
        isOpen={Boolean(webClient)}
        onClose={() => setWebClient(null)}
        onClientUpdated={() => value.refresh({ silent: true })}
      />

      <FisaReportDetailModal
        report={fisaReport}
        isOpen={Boolean(fisaReport)}
        onClose={() => setFisaReport(null)}
        onReportUpdated={() => value.refresh({ silent: true })}
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
