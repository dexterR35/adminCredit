import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
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

const REMINDER_VIEW_OPTIONS = [
  { id: "table", label: "Table", icon: HiOutlineTableCells },
  { id: "calendar", label: "Calendar", icon: HiOutlineCalendarDays },
];

const entityCacheKey = (source, id) => `${source}:${id}`;

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

  const entityCacheRef = useRef(new Map());
  const urlHydratedRef = useRef(false);
  const [webClient, setWebClient] = useState(null);
  const [fisaReport, setFisaReport] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const loadCachedEntity = useCallback(async (source, id) => {
    if (!id) return null;

    const cacheKey = entityCacheKey(source, id);
    if (entityCacheRef.current.has(cacheKey)) {
      return entityCacheRef.current.get(cacheKey);
    }

    const entity = source === "web_client"
      ? await fetchWebClientById(id)
      : await fetchFisaReportById(id);

    if (entity) {
      entityCacheRef.current.set(cacheKey, entity);
    }

    return entity;
  }, []);

  const openReminderClient = useCallback(async (reminder) => {
    const isWeb = reminder.source === "web_client";
    const id = isWeb ? reminder.credit_application_id : reminder.fisa_report_id;
    if (!id) return;

    if (isWeb && webClient?.id === id) return;
    if (!isWeb && fisaReport?.id === id) return;

    try {
      const entity = await loadCachedEntity(reminder.source, id);
      if (!entity) return;

      if (isWeb) {
        setFisaReport(null);
        setWebClient(entity);
        openWebClient(id, { tab: "reminders", replace: true });
        return;
      }

      setWebClient(null);
      setFisaReport(entity);
      openFisaReport(id, { tab: "reminders", replace: true });
    } catch (error) {
      console.error("Error opening reminder client:", error);
      toast.error(error.message || "Could not open client details.");
    }
  }, [fisaReport?.id, loadCachedEntity, openFisaReport, openWebClient, webClient?.id]);

  useEffect(() => {
    if (urlHydratedRef.current) return;

    const hydrateFromUrl = async () => {
      if (fisaReportId && fisaReport?.id !== fisaReportId) {
        try {
          const entity = await loadCachedEntity("fisa_report", fisaReportId);
          if (entity) {
            setWebClient(null);
            setFisaReport(entity);
          }
        } catch (error) {
          console.error("Error loading fisa report from URL:", error);
        }
      } else if (webClientId && webClient?.id !== webClientId) {
        try {
          const entity = await loadCachedEntity("web_client", webClientId);
          if (entity) {
            setFisaReport(null);
            setWebClient(entity);
          }
        } catch (error) {
          console.error("Error loading web client from URL:", error);
        }
      }

      if (fisaReportId || webClientId) {
        urlHydratedRef.current = true;
      }
    };

    hydrateFromUrl();
  }, [
    fisaReport?.id,
    fisaReportId,
    loadCachedEntity,
    webClient?.id,
    webClientId,
  ]);

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

  const handleClientUpdated = (updated) => {
    if (updated?.id) {
      entityCacheRef.current.set(entityCacheKey("web_client", updated.id), updated);
    }
    setWebClient(updated);
    refresh({ silent: true });
  };

  const handleReportUpdated = (updated) => {
    if (updated?.id) {
      entityCacheRef.current.set(entityCacheKey("fisa_report", updated.id), updated);
    }
    setFisaReport(updated);
    refresh({ silent: true });
  };

  const isTableLoading = loading || externalLoading;

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
          loading={isTableLoading}
          onOpenClient={openReminderClient}
        />
      ) : (
        <RemindersTableView
          reminders={reminders}
          loading={isTableLoading}
          emptyMessage="No reminders for In Progress clients."
          onFinish={handleFinish}
          onPostpone={handlePostpone}
          onOpenClient={openReminderClient}
        />
      )}

      <ClientDetailModal
        client={webClient}
        isOpen={Boolean(webClient)}
        onClose={handleCloseWebClient}
        onClientUpdated={handleClientUpdated}
        readOnly
        refreshOnOpen={false}
      />

      <FisaReportDetailModal
        report={fisaReport}
        isOpen={Boolean(fisaReport)}
        onClose={handleCloseFisaReport}
        onReportUpdated={handleReportUpdated}
        readOnly
        refreshOnOpen={false}
      />
    </>
  );
};

RemindersPanel.propTypes = {
  loading: PropTypes.bool,
};

export default RemindersPanel;
