import PropTypes from "prop-types";
import IconR from "../utils/_Icon";
import { cx } from "./utils";

export const BUTTON_VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
  dangerMuted: "btn-danger-muted",
  success: "btn-success",
  warning: "btn-warning",
  info: "btn-info",
  edit: "btn-warning",
  gray: "btn-gray",
  link: "btn-link",
  default: "btn-primary",
};

export const BUTTON_VARIANT_KEYS = Object.keys(BUTTON_VARIANT_CLASS);

const BUTTON_SIZE_CLASS = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
  xl: "btn-xl",
};

const renderIcon = (icon, iconClassName) => {
  if (!icon) return null;
  if (typeof icon === "string") return <IconR icon={icon} className={iconClassName} />;
  if (typeof icon === "function") {
    const Icon = icon;
    return <Icon className={iconClassName} aria-hidden />;
  }
  return icon;
};

export const buttonClassName = ({
  variant = "secondary",
  size = "md",
  disabled = false,
  fullWidth = false,
  className = "",
} = {}) =>
  cx(
    "btn",
    BUTTON_VARIANT_CLASS[variant] || BUTTON_VARIANT_CLASS.secondary,
    BUTTON_SIZE_CLASS[size] || "",
    fullWidth && "w-full",
    disabled && "btn-disabled",
    className
  );

const Button = ({
  children,
  text,
  variant = "secondary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  loadingText = "Please wait...",
  icon,
  iconPosition = "left",
  className = "",
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const iconNode = !loading ? renderIcon(icon, "h-4 w-4 shrink-0") : null;
  const content = loading ? loadingText : children ?? text;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonClassName({
        variant,
        size,
        disabled: isDisabled,
        fullWidth,
        className,
      })}
      {...props}
    >
      {iconPosition === "left" && iconNode}
      {content != null && content !== "" && <span>{content}</span>}
      {iconPosition === "right" && iconNode}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(BUTTON_VARIANT_KEYS),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.node]),
  iconPosition: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
