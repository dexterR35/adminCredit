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

  const startExtend = (event, reminder) => {
    event.stopPropagation();
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

  const handleFinish = async (event, id) => {
    event.stopPropagation();
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

  const handleRowClick = (reminder) => {
    onOpenClient?.(reminder);
  };

  const stopRowClick = (event) => {
    event.stopPropagation();
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading reminders...</p>;
  }

  if (!reminders.length) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="data-table-wrap overflow-x-auto">
      <table className="data-table w-full min-w-[40rem]">
        <thead>
          <tr>
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
              <tr
                key={reminder.id}
                className="data-table-row--clickable cursor-pointer"
                onClick={() => handleRowClick(reminder)}
              >
                <td className="font-medium text-gray-900">
                  {reminder.client_name}
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
                <td onClick={stopRowClick}>
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
                          variant="outline"
                          type="button"
                          size="sm"
                          text="Cancel"
                          onClick={() => setExtendingId(null)}
                          disabled={busy}
                        />
                        <Button
                          variant="primary"
                          type="button"
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
                        variant="outline"
                        type="button"
                        size="sm"
                        text="Extend"
                        onClick={(event) => startExtend(event, reminder)}
                        disabled={busy}
                      />
                      <Button
                        variant="primary"
                        type="button"
                        size="sm"
                        text="Complete"
                        onClick={(event) => handleFinish(event, reminder.id)}
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
