import { useState } from "react";
import PropTypes from "prop-types";
import { HiOutlineCalendarDays, HiOutlineTableCells } from "react-icons/hi2";
import RemindersTableView from "../../Components/Reminders/RemindersTableView";
import RemindersCalendarView from "../../Components/Reminders/RemindersCalendarView";
import { ViewToggle } from "../../Components/ViewToggle";
import { useClientRemindersContext } from "../../context/ClientRemindersContext";
import ClientDetailModal from "../../Components/Customer/ClientDetailModal";
import FisaReportDetailModal from "../../Components/Customer/FisaReportDetailModal";
import { fetchWebClientById } from "../../services/customers";
import { fetchFisaReportById } from "../../services/fisaReports";
import { useClientModalRoute } from "../../hooks/useClientModalRoute";
import { useUrlOpenedEntity } from "../../hooks/useUrlOpenedEntity";

const REMINDER_VIEW_OPTIONS = [
  { id: "table", label: "Table", icon: HiOutlineTableCells },
  { id: "calendar", label: "Calendar", icon: HiOutlineCalendarDays },
];

const RemindersPanel = ({ loading: externalLoading = false }) => {
  const {
    reminders,
    loading,
    refresh,
    dismiss,
    postpone,
  } = useClientRemindersContext();

  const {
    webClientId,
    fisaReportId,
    openWebClient,
    openFisaReport,
    closeClientModals,
  } = useClientModalRoute();

  const { entity: webClient, setEntity: setWebClient, loading: webClientLoading } = useUrlOpenedEntity({
    id: webClientId,
    fetchById: fetchWebClientById,
  });

  const { entity: fisaReport, setEntity: setFisaReport, loading: fisaReportLoading } = useUrlOpenedEntity({
    id: fisaReportId,
    fetchById: fetchFisaReportById,
  });

  const [viewMode, setViewMode] = useState("table");

  const isBusy = loading || externalLoading || webClientLoading || fisaReportLoading;

  const handleOpenClient = (reminder) => {
    if (reminder.source === "web_client" && reminder.credit_application_id) {
      openWebClient(reminder.credit_application_id, { tab: "reminders" });
      return;
    }

    if (reminder.fisa_report_id) {
      openFisaReport(reminder.fisa_report_id, { tab: "reminders" });
    }
  };

  const handleFinish = async (id) => {
    await dismiss(id);
    await refresh({ silent: true });
  };

  const handlePostpone = async (id, followUpAt) => {
    await postpone(id, followUpAt);
    await refresh({ silent: true });
  };

  const handleCloseWebClient = () => {
    closeClientModals();
    setWebClient(null);
  };

  const handleCloseFisaReport = () => {
    closeClientModals();
    setFisaReport(null);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ViewToggle
          options={REMINDER_VIEW_OPTIONS}
          value={viewMode}
          onChange={setViewMode}
          ariaLabel="Reminder view"
        />
        <p className="text-sm text-gray-500">
          {reminders.length} active reminder{reminders.length === 1 ? "" : "s"}
        </p>
      </div>

      {viewMode === "calendar" ? (
        <RemindersCalendarView
          reminders={reminders}
          loading={isBusy}
          onOpenClient={handleOpenClient}
        />
      ) : (
        <RemindersTableView
          reminders={reminders}
          loading={isBusy}
          emptyMessage="No reminders for In Progress clients."
          onFinish={handleFinish}
          onPostpone={handlePostpone}
          onOpenClient={handleOpenClient}
        />
      )}

      <ClientDetailModal
        client={webClient}
        isOpen={Boolean(webClient)}
        onClose={handleCloseWebClient}
        onClientUpdated={(updated) => {
          setWebClient(updated);
          refresh({ silent: true });
        }}
      />

      <FisaReportDetailModal
        report={fisaReport}
        isOpen={Boolean(fisaReport)}
        onClose={handleCloseFisaReport}
        onReportUpdated={(updated) => {
          setFisaReport(updated);
          refresh({ silent: true });
        }}
      />
    </>
  );
};

RemindersPanel.propTypes = {
  loading: PropTypes.bool,
};

export default RemindersPanel;
