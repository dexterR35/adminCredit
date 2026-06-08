import PropTypes from "prop-types";

const ViewToggle = ({
  options = [],
  value,
  onChange,
  ariaLabel = "View mode",
  className = "",
}) => (
  <div
    className={`view-toggle ${className}`.trim()}
    role="tablist"
    aria-label={ariaLabel}
  >
    {options.map((option) => {
      const Icon = option.icon;
      const active = value === option.id;

      return (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={active}
          className={[
            "view-toggle__btn",
            active && "view-toggle__btn--active",
          ].filter(Boolean).join(" ")}
          onClick={() => onChange?.(option.id)}
        >
          {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
          <span>{option.label}</span>
        </button>
      );
    })}
  </div>
);

ViewToggle.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default ViewToggle;
