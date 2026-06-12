import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { HiOutlineBell } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Badge } from "../Badge";
import { Button } from "../Buttons";
import { formatFollowUpDateTime, isFollowUpDue } from "../../utils/followUpDates";

const ReminderBell = ({
  reminders = [],
  dueCount = 0,
  onRefresh,
  onOpenDueModal,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        close();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, close]);

  const goToRemindersTab = () => {
    close();
    navigate("/home?tab=reminders");
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        className="app-reminder-btn"
        onClick={() => {
          if (dueCount > 0) {
            onOpenDueModal?.();
          } else {
            setOpen((value) => !value);
          }
          onRefresh?.({ silent: true });
        }}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Reminders${dueCount ? `, ${dueCount} due` : ""}`}
      >
        <HiOutlineBell className="h-5 w-5" aria-hidden />
        {dueCount > 0 && (
          <span className="app-reminder-badge" aria-hidden>
            {dueCount > 9 ? "9+" : dueCount}
          </span>
        )}
      </button>

      {open && (
        <div className="app-reminder-menu" role="menu">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Reminders</p>
            <p className="text-xs text-gray-500">In Progress clients only</p>
          </div>

          {reminders.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">No active reminders.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {reminders.slice(0, 5).map((reminder) => {
                const due = isFollowUpDue(reminder.follow_up_at);
                return (
                  <li
                    key={reminder.id}
                    className="border-b border-gray-50 px-4 py-3 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {reminder.client_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFollowUpDateTime(reminder.follow_up_at)}
                        </p>
                      </div>
                      <Badge variant={due ? "danger" : "info"} size="sm">
                        {due ? "Due" : "Scheduled"}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-gray-100 p-3">
            <Button
              variant="outline"
              type="button"
              size="sm"
              text="View all reminders"
              onClick={goToRemindersTab}
              className="w-full"
            />
            {dueCount > 0 && (
              <Button
                variant="primary"
                type="button"
                size="sm"
                text="Open due reminders"
                onClick={() => {
                  close();
                  onOpenDueModal?.();
                }}
                className="mt-2 w-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ReminderBell.propTypes = {
  reminders: PropTypes.arrayOf(PropTypes.object),
  dueCount: PropTypes.number,
  onRefresh: PropTypes.func,
  onOpenDueModal: PropTypes.func,
};

export default ReminderBell;
