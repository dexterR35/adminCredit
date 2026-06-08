import PropTypes from "prop-types";
import { Select } from "./Form.jsx";

const initialsFor = (name, email) => {
  const source = name || email || "?";
  return source
    .split(/[.\s@_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const Avatar = ({ name, email, size = "sm", color }) => (
  <span
    className={`avatar avatar--${size}`}
    style={color ? { backgroundColor: color } : undefined}
    title={name || email}
  >
    {initialsFor(name, email)}
  </span>
);

Avatar.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md"]),
  color: PropTypes.string,
};

export const ColorInput = ({ label, value, onChange }) => (
  <label className="input-wrap">
    {label && <span className="input-label">{label}</span>}
    <input
      type="color"
      className="input input-color"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  </label>
);

ColorInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const DepartmentSelect = ({ label = "Department", value, onChange }) => (
  <Select
    label={label}
    value={value}
    onChange={onChange}
    placeholder="Choose..."
    options={[
      { value: "sales", label: "Sales" },
      { value: "admin", label: "Admin" },
      { value: "support", label: "Support" },
    ]}
  />
);

DepartmentSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const SkeletonSummaryCards = () => (
  <div className="summary-grid">
    {Array.from({ length: 4 }).map((_, index) => (
      <div className="summary-card" key={index}>
        <span className="skeleton h-3 w-24" />
        <span className="skeleton mt-4 h-8 w-16" />
        <span className="skeleton mt-3 h-3 w-32" />
      </div>
    ))}
  </div>
);

export const SkeletonBoardCards = ({ count = 3 }) => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div className="card card--padded" key={index}>
        <span className="skeleton h-4 w-32" />
        <span className="skeleton mt-4 h-20 w-full" />
      </div>
    ))}
  </div>
);

SkeletonBoardCards.propTypes = {
  count: PropTypes.number,
};

export const SkeletonTable = ({ rows = 4, cols = 4 }) => (
  <div className="data-table-wrap">
    <table className="data-table">
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: cols }).map((__, colIndex) => (
              <td key={colIndex}>
                <span className="skeleton h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

SkeletonTable.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
};

export const Tabs = ({ value, onChange, options = [] }) => (
  <div className="ui-tabs" role="tablist">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="tab"
        aria-selected={value === option.value}
        className={`ui-tabs__tab ${value === option.value ? "ui-tabs__tab--active" : ""}`}
        onClick={() => onChange?.(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

Tabs.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
