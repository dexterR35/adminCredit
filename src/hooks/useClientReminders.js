import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  dismissClientFollowUp,
  fetchMyActiveReminders,
  postponeClientFollowUp,
} from "../services/clientFollowUps";
import { isFollowUpDue } from "../utils/followUpDates";

const POLL_INTERVAL_MS = 60 * 1000;

export const useClientReminders = ({ enabled = true } = {}) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dueModalOpen, setDueModalOpen] = useState(false);
  const isMounted = useRef(true);
  const snoozedDueIds = useRef(new Set());

  const dueReminders = useMemo(
    () => reminders.filter((row) => isFollowUpDue(row.follow_up_at)),
    [reminders]
  );

  const dueCount = dueReminders.length;

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!enabled) return [];
    if (!silent) setLoading(true);
    try {
      const rows = await fetchMyActiveReminders();
      if (!isMounted.current) return rows;
      setReminders(rows);
      setError(null);

      const dueRows = rows.filter((row) => isFollowUpDue(row.follow_up_at));
      const unseenDue = dueRows.filter((row) => !snoozedDueIds.current.has(row.id));

      if (unseenDue.length) {
        setDueModalOpen(true);
      }

      if (!dueRows.length) {
        setDueModalOpen(false);
      }

      return rows;
    } catch (err) {
      if (!isMounted.current) return [];
      setError(err);
      if (!silent) {
        console.error("Error loading reminders:", err);
      }
      return [];
    } finally {
      if (isMounted.current && !silent) setLoading(false);
    }
  }, [enabled]);

  const dismiss = useCallback(async (id) => {
    await dismissClientFollowUp(id);
    snoozedDueIds.current.delete(id);
    setReminders((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const postpone = useCallback(async (id, followUpAt) => {
    const updated = await postponeClientFollowUp(id, followUpAt);
    snoozedDueIds.current.delete(id);
    setReminders((prev) => prev
      .map((row) => (row.id === id ? updated : row))
      .sort((a, b) => a.follow_up_at.localeCompare(b.follow_up_at)));
    if (!isFollowUpDue(updated.follow_up_at)) {
      setDueModalOpen(false);
    }
  }, []);

  const closeDueModal = useCallback(() => {
    dueReminders.forEach((row) => snoozedDueIds.current.add(row.id));
    setDueModalOpen(false);
  }, [dueReminders]);

  const openDueModal = useCallback(() => {
    dueReminders.forEach((row) => snoozedDueIds.current.delete(row.id));
    setDueModalOpen(true);
  }, [dueReminders]);

  useEffect(() => {
    isMounted.current = true;
    if (!enabled) {
      setReminders([]);
      return undefined;
    }

    refresh();
    const timer = window.setInterval(() => refresh({ silent: true }), POLL_INTERVAL_MS);
    return () => {
      isMounted.current = false;
      window.clearInterval(timer);
    };
  }, [enabled, refresh]);

  return {
    reminders,
    dueReminders,
    dueCount,
    dueModalOpen,
    loading,
    error,
    refresh,
    dismiss,
    postpone,
    closeDueModal,
    openDueModal,
  };
};
