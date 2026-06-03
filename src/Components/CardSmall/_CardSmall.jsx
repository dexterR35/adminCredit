import React from "react";
import PropTypes from "prop-types";
import IconR from "../utils/_Icon";

const CardSmall = ({
  _one = "",
  _two = "",
  _three = "",
  icon,
  className = "",
  accent = "primary",
  loading = false,
}) => {
  const accentClasses = {
    primary: "dash-stat-icon",
    success: "flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700",
    info: "flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700",
    warning: "flex h-7 w-7 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-700",
  };

  if (loading) {
    return (
      <div
        className={`dash-stat-card ${className}`}
        aria-busy="true"
        aria-label={`Loading ${_one || "statistic"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="mt-3 h-7 w-12 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div className={`dash-stat-card ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="dash-stat-label">{_one}</p>
        <div className={accentClasses[accent] || accentClasses.primary}>
          <IconR icon={icon} size={15} />
        </div>
      </div>
      <p className="dash-stat-value">{_two}</p>
      {_three !== "Details" && (
        <p className="dash-stat-meta capitalize">{_three}</p>
      )}
    </div>
  );
};

export default CardSmall;

CardSmall.propTypes = {
  _one: PropTypes.string,
  _two: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  _three: PropTypes.string,
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  accent: PropTypes.oneOf(["primary", "success", "info", "warning"]),
  loading: PropTypes.bool,
};
