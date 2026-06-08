import PropTypes from "prop-types";
import InputField from "./InputField";
import { getTodayFollowUpDate } from "../../utils/followUpDates";

const DateTimeFieldGroup = ({
  dateValue = "",
  timeValue = "",
  noteValue = "",
  onDateChange,
  onTimeChange,
  onNoteChange,
  disabled = false,
  showNote = true,
  dateName = "follow_up_date",
  timeName = "follow_up_time",
  noteName = "follow_up_note",
  dateLabel = "Date",
  timeLabel = "Time",
  noteLabel = "Note (optional)",
  notePlaceholder = "e.g. Client OK to continue...",
  minDate,
  className = "",
}) => {
  const min = minDate ?? getTodayFollowUpDate();

  return (
    <div
      className={`grid grid-cols-1 gap-3 ${showNote ? "sm:grid-cols-3" : "sm:grid-cols-2"} ${className}`.trim()}
    >
      <InputField
        label={dateLabel}
        name={dateName}
        type="date"
        value={dateValue}
        min={min}
        onChange={onDateChange}
        disabled={disabled}
      />
      <InputField
        label={timeLabel}
        name={timeName}
        type="time"
        value={timeValue}
        onChange={onTimeChange}
        disabled={disabled}
      />
      {showNote && (
        <InputField
          label={noteLabel}
          name={noteName}
          value={noteValue}
          onChange={onNoteChange}
          placeholder={notePlaceholder}
          disabled={disabled}
        />
      )}
    </div>
  );
};

DateTimeFieldGroup.propTypes = {
  dateValue: PropTypes.string,
  timeValue: PropTypes.string,
  noteValue: PropTypes.string,
  onDateChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  onNoteChange: PropTypes.func,
  disabled: PropTypes.bool,
  showNote: PropTypes.bool,
  dateName: PropTypes.string,
  timeName: PropTypes.string,
  noteName: PropTypes.string,
  dateLabel: PropTypes.string,
  timeLabel: PropTypes.string,
  noteLabel: PropTypes.string,
  notePlaceholder: PropTypes.string,
  minDate: PropTypes.string,
  className: PropTypes.string,
};

export default DateTimeFieldGroup;
