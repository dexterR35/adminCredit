import PropTypes from "prop-types";
import { Button as UiButton } from "../uiCheck";
import { useTrackLoading } from "../LoadingProgress";
import { resolveButtonVariant } from "./buttonStyles";

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

  useTrackLoading(loading);

  return (
    <UiButton
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      variant={resolveButtonVariant(variant, buttonType)}
      size={size}
      loading={loading}
      loadingText={loadingText}
      icon={resolvedIcon}
      iconPosition={iconPosition}
      className={className}
      fullWidth={fullWidth}
      {...rest}
    >
      {content}
    </UiButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    "outline",
    "dangerMuted",
    "gray",
    "link",
  ]),
  buttonType: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.node]),
  iconPosition: PropTypes.oneOf(["left", "right"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
