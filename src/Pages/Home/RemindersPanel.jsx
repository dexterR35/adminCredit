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

  const [viewMode, setViewMode] = useState("table");
  const [webClient, setWebClient] = useState(null);
  const [fisaReport, setFisaReport] = useState(null);
  const [opening, setOpening] = useState(false);

  const isBusy = loading || externalLoading || opening;

  const handleOpenClient = async (reminder) => {
    setOpening(true);
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
    } finally {
      setOpening(false);
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
        onClose={() => setWebClient(null)}
        onClientUpdated={() => refresh({ silent: true })}
      />

      <FisaReportDetailModal
        report={fisaReport}
        isOpen={Boolean(fisaReport)}
        onClose={() => setFisaReport(null)}
        onReportUpdated={() => refresh({ silent: true })}
      />
    </>
  );
};

RemindersPanel.propTypes = {
  loading: PropTypes.bool,
};

export default RemindersPanel;
