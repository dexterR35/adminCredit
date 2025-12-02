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
    <div className={`${className} rounded-xl p-6 border border-gray-700 bg-gray-900 transition-all duration-200 shadow-lg`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{_one}</p>
        <div className="p-2.5 rounded-lg bg-gray-800 border border-gray-700">
          <IconR icon={icon} size={20} />
        </div>
      </div>
      
      {/* Main Value */}
      <div className="mb-4">
        <p className="text-4xl font-bold text-white tracking-tight">{_two}</p>
      </div>
      
      {/* Footer */}
      {_three !== "Details" && (
        <p className="text-sm font-medium text-gray-400 capitalize">{_three}</p>
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
