import PropTypes from "prop-types";

const TabProgress = ({
  current,
  total,
  label,
  children,
  className = "",
}) => {
  const progress = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  const stepLabel = label ?? `Step ${current + 1} of ${total}`;

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">{stepLabel}</span>
          <span className="font-semibold tabular-nums text-primary-600">{progress}%</span>
        </div>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress"
        >
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {children}
    </div>
  );
};

TabProgress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default TabProgress;
