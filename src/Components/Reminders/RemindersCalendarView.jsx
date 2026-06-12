import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { Button } from "../Buttons";
import { Badge } from "../Badge";
import { formatRoTime } from "../../utils/date";
import {
  formatFollowUpDateTime,
  getTodayFollowUpDate,
  isFollowUpDue,
} from "../../utils/followUpDates";
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  formatCalendarMonthTitle,
  groupRemindersByDate,
} from "../../utils/calendarUtils";

const MAX_VISIBLE_EVENTS = 3;

const RemindersCalendarView = ({
  reminders = [],
  loading = false,
  onOpenClient,
}) => {
  const today = new Date();
  const todayKey = getTodayFollowUpDate();
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedReminder, setSelectedReminder] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const remindersByDate = useMemo(() => groupRemindersByDate(reminders), [reminders]);
  const monthTitle = formatCalendarMonthTitle(year, month);

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedReminder(null);
  };

  const handleSelectReminder = (reminder) => {
    setSelectedReminder(reminder);
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading calendar...</p>;
  }

  return (
    <div className="reminders-calendar">
      <div className="reminders-calendar__toolbar">
        <div className="reminders-calendar__nav">
          <Button
            variant="outline"
            type="button"
            size="sm"
            icon={HiOutlineChevronLeft}
            onClick={goPrev}
            aria-label="Previous month"
          />
          <Button
            variant="outline"
            type="button"
            size="sm"
            icon={HiOutlineChevronRight}
            onClick={goNext}
            aria-label="Next month"
          />
          <Button
            variant="outline"
            type="button"
            size="sm"
            text="Today"
            onClick={goToday}
          />
        </div>
        <h3 className="reminders-calendar__title">{monthTitle}</h3>
      </div>

      <div className="reminders-calendar__weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="reminders-calendar__weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="reminders-calendar__grid">
        {weeks.map((week) => (
          <div key={week[0].dateKey} className="reminders-calendar__week">
            {week.map((day) => {
              const dayReminders = remindersByDate.get(day.dateKey) || [];
              const hiddenCount = Math.max(0, dayReminders.length - MAX_VISIBLE_EVENTS);
              const isToday = day.dateKey === todayKey;

              return (
                <div
                  key={day.dateKey}
                  className={[
                    "reminders-calendar__day",
                    !day.inCurrentMonth && "reminders-calendar__day--outside",
                    isToday && "reminders-calendar__day--today",
                  ].filter(Boolean).join(" ")}
                >
                  <div className="reminders-calendar__day-number">
                    <span className={isToday ? "reminders-calendar__today-badge" : undefined}>
                      {day.date.getDate()}
                    </span>
                  </div>

                  <div className="reminders-calendar__events">
                    {dayReminders.slice(0, MAX_VISIBLE_EVENTS).map((reminder) => {
                      const due = isFollowUpDue(reminder.follow_up_at);
                      const isSelected = selectedReminder?.id === reminder.id;

                      return (
                        <button
                          key={reminder.id}
                          type="button"
                          className={[
                            "reminders-calendar__event",
                            due ? "reminders-calendar__event--due" : "reminders-calendar__event--scheduled",
                            isSelected && "reminders-calendar__event--selected",
                          ].filter(Boolean).join(" ")}
                          onClick={() => handleSelectReminder(reminder)}
                          title={formatFollowUpDateTime(reminder.follow_up_at)}
                        >
                          <span className="reminders-calendar__event-time">
                            {formatRoTime(reminder.follow_up_at)}
                          </span>
                          <span className="reminders-calendar__event-title">
                            {reminder.client_name}
                          </span>
                        </button>
                      );
                    })}
                    {hiddenCount > 0 && (
                      <span className="reminders-calendar__more">
                        +{hiddenCount} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedReminder && (
        <div className="reminders-calendar__detail">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {selectedReminder.client_name}
              </p>
              <p className="text-sm text-gray-600">
                {formatFollowUpDateTime(selectedReminder.follow_up_at)}
              </p>
              {selectedReminder.note ? (
                <p className="mt-1 text-sm text-gray-500">{selectedReminder.note}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={isFollowUpDue(selectedReminder.follow_up_at) ? "danger" : "info"}
                size="sm"
              >
                {isFollowUpDue(selectedReminder.follow_up_at) ? "Due" : "Scheduled"}
              </Badge>
              <Button
                variant="primary"
                type="button"
                size="sm"
                text="Open client"
                onClick={() => onOpenClient?.(selectedReminder)}
              />
            </div>
          </div>
        </div>
      )}

      {!reminders.length && (
        <p className="reminders-calendar__empty">
          No reminders on the calendar. They appear here after you save them on a client.
        </p>
      )}
    </div>
  );
};

RemindersCalendarView.propTypes = {
  reminders: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onOpenClient: PropTypes.func,
};

export default RemindersCalendarView;
