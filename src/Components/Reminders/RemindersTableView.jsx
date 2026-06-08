import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Badge } from "../Badge";
import { Button } from "../Buttons";
import { DateTimeFieldGroup } from "../Inputs";
import {
  combineDateAndTime,
  formatFollowUpDateTime,
  getDefaultFollowUpTime,
  getTodayFollowUpDate,
  isFollowUpDue,
} from "../../utils/followUpDates";

const shortId = (id) => (id ? String(id).slice(0, 8) : "—");

const RemindersTableView = ({
  reminders = [],
  loading = false,
  emptyMessage = "No active reminders.",
  onFinish,
  onPostpone,
  onOpenClient,
}) => {
  const [extendingId, setExtendingId] = useState(null);
  const [extendDate, setExtendDate] = useState(getTodayFollowUpDate());
  const [extendTime, setExtendTime] = useState(getDefaultFollowUpTime());
  const [actionLoading, setActionLoading] = useState(null);

  const startExtend = (reminder) => {
    setExtendingId(reminder.id);
    setExtendDate(getTodayFollowUpDate());
    setExtendTime(getDefaultFollowUpTime());
  };

  const handlePostpone = async (id) => {
    const followUpAt = combineDateAndTime(extendDate, extendTime);
    if (!followUpAt) {
      toast.error("Invalid date or time.");
      return;
    }

    setActionLoading(id);
    try {
      await onPostpone?.(id, followUpAt);
      setExtendingId(null);
      toast.success("Reminder extended.");
    } catch (error) {
      toast.error(error.message || "Could not extend reminder.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFinish = async (id) => {
    setActionLoading(id);
    try {
      await onFinish?.(id);
      if (extendingId === id) setExtendingId(null);
      toast.success("Reminder completed.");
    } catch (error) {
      toast.error(error.message || "Could not complete reminder.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading reminders...</p>;
  }

  if (!reminders.length) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="data-table-wrap overflow-x-auto">
      <table className="data-table w-full min-w-[44rem]">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Date / Time</th>
            <th>Note</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder) => {
            const due = isFollowUpDue(reminder.follow_up_at);
            const isExtending = extendingId === reminder.id;
            const busy = actionLoading === reminder.id;

            return (
              <tr key={reminder.id}>
                <td className="font-mono text-xs text-gray-500">{shortId(reminder.id)}</td>
                <td>
                  <button
                    type="button"
                    className="text-left font-medium text-primary-700 hover:underline"
                    onClick={() => onOpenClient?.(reminder)}
                  >
                    {reminder.client_name}
                  </button>
                </td>
                <td className="whitespace-nowrap text-sm">
                  {reminder.follow_up_at_label || formatFollowUpDateTime(reminder.follow_up_at)}
                </td>
                <td className="max-w-[12rem] truncate text-sm text-gray-600">
                  {reminder.note || "—"}
                </td>
                <td>
                  <Badge variant={due ? "danger" : "info"} size="sm">
                    {due ? "Due" : "Scheduled"}
                  </Badge>
                </td>
                <td>
                  {isExtending ? (
                    <div className="flex min-w-[16rem] flex-col gap-3">
                      <DateTimeFieldGroup
                        showNote={false}
                        dateName={`extend_date_${reminder.id}`}
                        timeName={`extend_time_${reminder.id}`}
                        dateLabel="New date"
                        timeLabel="New time"
                        dateValue={extendDate}
                        timeValue={extendTime}
                        onDateChange={(e) => setExtendDate(e.target.value)}
                        onTimeChange={(e) => setExtendTime(e.target.value)}
                        disabled={busy}
                      />
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          text="Cancel"
                          onClick={() => setExtendingId(null)}
                          disabled={busy}
                        />
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          text="Save"
                          onClick={() => handlePostpone(reminder.id)}
                          disabled={busy}
                          loading={busy}
                          loadingText="..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        text="Extend"
                        onClick={() => startExtend(reminder)}
                        disabled={busy}
                      />
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        text="Complete"
                        onClick={() => handleFinish(reminder.id)}
                        disabled={busy}
                        loading={busy}
                        loadingText="..."
                      />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

RemindersTableView.propTypes = {
  reminders: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onFinish: PropTypes.func,
  onPostpone: PropTypes.func,
  onOpenClient: PropTypes.func,
};

export default RemindersTableView;
