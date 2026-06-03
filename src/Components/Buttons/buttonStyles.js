/** Base + variant classes — aligned with index.css dash-btn tokens */

export const BUTTON_BASE = "dash-btn cursor-pointer";

export const BUTTON_VARIANTS = {
  primary: "dash-btn-primary",
  secondary: "dash-btn-secondary",
  danger: "dash-btn-danger",
  ghost: "dash-btn-ghost",
  success: "dash-btn-success",
  warning: "dash-btn-warning",
  info: "dash-btn-info",
  edit: "dash-btn-edit",
  error: "dash-btn-danger",
};

export const BUTTON_SIZES = {
  sm: "dash-btn-sm",
  md: "",
  lg: "dash-btn-lg",
};

/** @deprecated — maps legacy `buttonType` to design variants */
export const LEGACY_BUTTON_TYPES = {
  submit: "primary",
  logIn: "primary",
  modal: "primary",
  default: "secondary",
  logOut: "ghost",
  delete: "danger",
  error: "danger",
  success: "success",
  edit: "edit",
  info: "info",
  disabled: "secondary",
};

export const resolveButtonVariant = (variant, legacyButtonType) => {
  if (variant && BUTTON_VARIANTS[variant]) return variant;
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
  [
    BUTTON_BASE,
    BUTTON_VARIANTS[resolveButtonVariant(variant, legacyButtonType)],
    BUTTON_SIZES[size] || "",
    disabled ? "dash-btn--disabled !cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
