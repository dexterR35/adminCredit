import React from "react";
import PropTypes from "prop-types";
import { getBadgeClasses } from "../../constants/colors";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className = "" 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full text-center";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  // Badge variant classes using centralized color constants
  const variantClasses = {
    default: getBadgeClasses('default'),
    success: getBadgeClasses('success'),
    error: getBadgeClasses('error'),
    warning: getBadgeClasses('warning'),
    info: getBadgeClasses('info'),
    green: getBadgeClasses('green'),
    red: getBadgeClasses('red'),
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "success", "error", "warning", "info", "green", "red"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default Badge;

