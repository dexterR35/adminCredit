import PropTypes from "prop-types";
import { Button } from "../Buttons";
import { tabBadgeClassName, tabButtonClassName, tabLabelClassName } from "./tabStyles";

const Tab = ({
  label,
  index,
  isActive = false,
  isCompleted = false,
  disabled = false,
  onClick,
  className = "",
  showIndex = true,
}) => {
  const isReachable = !disabled;
  const displayIndex = index != null ? index + 1 : null;

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      disabled={disabled}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      className={`${tabButtonClassName({ isActive, isCompleted, isReachable })} ${className}`.trim()}
    >
      <span className="inline-flex items-center gap-2">
        {showIndex && displayIndex != null && (
          <span className={tabBadgeClassName({ isActive, isCompleted })}>
            {isCompleted && !isActive ? "✓" : displayIndex}
          </span>
        )}
        <span className={tabLabelClassName({ isActive })}>{label}</span>
      </span>
    </Button>
  );
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  index: PropTypes.number,
  isActive: PropTypes.bool,
  isCompleted: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  showIndex: PropTypes.bool,
};

export default Tab;
