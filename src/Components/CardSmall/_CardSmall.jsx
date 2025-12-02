import React from "react";
import PropTypes from "prop-types";
import IconR from "../utils/_Icon";

const CardSmall = ({
  _one = "",
  _two = "",
  _three = "",
  icon,
  className = "",
}) => {
  return (
    <div className={`${className} rounded-xl p-6 border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{_one}</p>
        <div className="p-2 rounded-lg bg-slate-700/50">
          <IconR icon={icon} size={18} />
        </div>
      </div>
      
      {/* Main Value */}
      <div className="mb-3">
        <p className="text-3xl font-semibold text-slate-100 tracking-tight">{_two}</p>
      </div>
      
      {/* Footer */}
      {_three !== "Details" && (
        <p className="text-sm font-medium text-slate-400 capitalize">{_three}</p>
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
};
