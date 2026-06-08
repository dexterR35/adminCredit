import PropTypes from "prop-types";
import { cx } from "./utils";

export const Loader = ({ label = "Loading..." }) => (
  <div className="loader">
    <div className="loading-spinner" />
    {label && <p>{label}</p>}
  </div>
);

Loader.propTypes = {
  label: PropTypes.string,
};

export const ProgressLoader = ({
  label = "Loading...",
  trailing,
  centered = false,
  className = "",
}) => (
  <div className={cx("progress-loader", centered && "progress-loader--centered", className)}>
    <div className="progress-loader__row">
      <span>{label}</span>
      {trailing}
    </div>
    <div className="progress-loader__track">
      <div className="progress-loader__bar" />
    </div>
  </div>
);

ProgressLoader.propTypes = {
  label: PropTypes.node,
  trailing: PropTypes.node,
  centered: PropTypes.bool,
  className: PropTypes.string,
};

export const AsyncProgressBar = ({
  label = "Working...",
  current = 0,
  total = 0,
  indeterminate = false,
}) => {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink-secondary">{label}</span>
        {!indeterminate && <span className="font-semibold text-ink-tertiary">{percent}%</span>}
      </div>
      <div className={`progress-bar ${indeterminate ? "progress-bar--indeterminate" : ""}`}>
        <div className="progress-bar__fill" style={{ width: indeterminate ? "42%" : `${percent}%` }} />
      </div>
    </div>
  );
};

AsyncProgressBar.propTypes = {
  label: PropTypes.node,
  current: PropTypes.number,
  total: PropTypes.number,
  indeterminate: PropTypes.bool,
};
