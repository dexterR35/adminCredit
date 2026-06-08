import {
  BUTTON_VARIANT_CLASS,
  buttonClassName as uiButtonClassName,
} from "../uiCheck";

/** Compatibility helpers. New styling lives in Components/uiCheck/Button.jsx. */

export const BUTTON_BASE = "btn";

export const BUTTON_VARIANTS = {
  ...BUTTON_VARIANT_CLASS,
  error: BUTTON_VARIANT_CLASS.danger,
};

export const BUTTON_SIZES = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
  xl: "btn-xl",
};

export const LEGACY_BUTTON_TYPES = {
  submit: "primary",
  logIn: "primary",
  modal: "primary",
  default: "secondary",
  logOut: "ghost",
  delete: "danger",
  error: "danger",
  success: "success",
  edit: "warning",
  info: "info",
  disabled: "secondary",
};

export const resolveButtonVariant = (variant, legacyButtonType) => {
  if (variant && BUTTON_VARIANTS[variant]) return variant === "error" ? "danger" : variant;
  if (legacyButtonType && LEGACY_BUTTON_TYPES[legacyButtonType]) {
    return LEGACY_BUTTON_TYPES[legacyButtonType];
  }
  return "secondary";
};

export const buttonClassName = ({
  variant = "secondary",
  legacyButtonType,
  size = "md",
  disabled = false,
  className = "",
} = {}) =>
  uiButtonClassName({
    variant: resolveButtonVariant(variant, legacyButtonType),
    size,
    disabled,
    className,
  });
