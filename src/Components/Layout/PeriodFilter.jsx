import React from "react";
import PropTypes from "prop-types";

const PERIODS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "all", label: "All time" },
];

const PeriodFilter = ({ value, onChange, className = "" }) => (
  <div className={`dash-period-group ${className}`} role="group" aria-label="Time period">
    {PERIODS.map((period) => (
      <button
        key={period.id}
        type="button"
        onClick={() => onChange(period.id)}
        className={`dash-period-btn ${value === period.id ? "dash-period-btn--active" : ""}`}
      >
        {period.label}
      </button>
    ))}
  </div>
);

PeriodFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export { PERIODS };
export default PeriodFilter;
