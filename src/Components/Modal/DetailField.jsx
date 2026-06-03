import PropTypes from "prop-types";

const DetailField = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
    <div className="mt-1 text-sm text-gray-900">{children ?? "—"}</div>
  </div>
);

DetailField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default DetailField;
