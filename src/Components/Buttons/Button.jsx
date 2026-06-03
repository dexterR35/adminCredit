import React, { useEffect } from "react";
import PropTypes from "prop-types";
import IconR from "../utils/_Icon";
import { buttonClassName } from "./buttonStyles";
import { useTrackLoading } from "../LoadingProgress";

const Button = ({
  children,
  text,
  variant,
  buttonType,
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  loadingText = "Please wait...",
  icon,
  iconPosition = "left",
  onClick,
  className = "",
  fullWidth = false,
  ...rest
}) => {
  const content = children ?? text;
  const isDisabled = disabled || loading;
  const resolvedIcon = icon ?? (buttonType === "logOut" ? "IoLogout" : null);
  const isPlainText =
    typeof content === "string" || typeof content === "number";

  useTrackLoading(loading);

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={buttonClassName({
        variant,
        legacyButtonType: buttonType,
        size,
        disabled: isDisabled,
        className: `${fullWidth ? "w-full" : ""} ${className}`.trim(),
      })}
      {...rest}
    >
      {!loading && resolvedIcon && iconPosition === "left" && (
        <IconR icon={resolvedIcon} />
      )}
      {content != null && content !== "" && (
        isPlainText ? (
          <span>{loading ? loadingText : content}</span>
        ) : (
          loading ? loadingText : content
        )
      )}
      {!loading && resolvedIcon && iconPosition === "right" && (
        <IconR icon={resolvedIcon} />
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "ghost",
    "success",
    "warning",
    "info",
    "edit",
    "error",
  ]),
  buttonType: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
