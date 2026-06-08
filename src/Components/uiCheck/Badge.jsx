import PropTypes from "prop-types";
import { cx } from "./utils";

export const BADGE_VARIANT_CLASS = {
  default: "badge--default",
  primary: "badge--accent",
  accent: "badge--accent",
  secondary: "badge--slate",
  slate: "badge--slate",
  success: "badge--success",
  danger: "badge--error",
  error: "badge--error",
  warning: "badge--warning",
  info: "badge--info",
  sky: "badge--sky",
  edit: "badge--warning",
};

export const BADGE_VARIANT_KEYS = Object.keys(BADGE_VARIANT_CLASS);

const BADGE_SIZE_CLASS = {
  sm: "badge--sm",
  md: "",
  lg: "badge--lg",
};

export const resolveBadgeVariant = (variant) =>
  variant && BADGE_VARIANT_CLASS[variant] ? variant : "default";

export const badgeClassName = ({
  variant = "default",
  size = "md",
  interactive = false,
  className = "",
} = {}) =>
  cx(
    "badge",
    BADGE_VARIANT_CLASS[resolveBadgeVariant(variant)],
    BADGE_SIZE_CLASS[size] || "",
    interactive && "badge--interactive",
    className
  );

export const yesNoBadgeVariant = (value) => {
  if (value === null || value === undefined) return "default";
  if (typeof value === "boolean") return value ? "success" : "danger";
  return value !== "" && value !== "—" ? "success" : "danger";
};

export const statusBadgeVariant = (status) => {
  const value = String(status || "").toLowerCase();
  if (["approved", "approve", "completed"].includes(value)) return "success";
  if (["denied", "deny", "rejected", "cancelled"].includes(value)) return "danger";
  if (["pending", "new"].includes(value)) return "edit";
  return "default";
};

export const presenceBadgeVariant = (value) =>
  value === null || value === undefined || value === "" || value === "—"
    ? "danger"
    : "primary";

export const LINK_BADGE_PRESETS = {
  photo: { viewVariant: "info", missingVariant: "default" },
  pdf: { viewVariant: "info", missingVariant: "default" },
  signature: { viewVariant: "info", missingVariant: "default" },
};

export const PHONE_BADGE_PRESET = { variant: "info" };

export const ToggleOptionBadge = ({
  label,
  checked = false,
  disabled = false,
  onClick,
}) => (
  <Badge
    as="button"
    type="button"
    variant={checked ? "accent" : "slate"}
    interactive={!disabled}
    disabled={disabled}
    aria-pressed={checked}
    onClick={onClick}
  >
    {label}
  </Badge>
);

ToggleOptionBadge.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export const ActiveToggleBadge = ({ active = false, onClick }) => (
  <ToggleOptionBadge
    label={active ? "Active" : "Inactive"}
    checked={active}
    onClick={onClick}
  />
);

ActiveToggleBadge.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export const ErrorBadge = ({ diff = 0, hideZero = true }) => {
  if (diff === 0 && hideZero) return null;
  const label = diff > 0 ? `+${diff}` : String(diff);
  return <Badge variant={diff >= 0 ? "success" : "error"}>{label}</Badge>;
};

ErrorBadge.propTypes = {
  diff: PropTypes.number,
  hideZero: PropTypes.bool,
};

const Badge = ({
  children,
  variant = "default",
  size = "md",
  interactive = false,
  className = "",
  as: Component = "span",
  ...props
}) => (
  <Component
    className={badgeClassName({ variant, size, interactive, className })}
    {...props}
  >
    {children}
  </Component>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(BADGE_VARIANT_KEYS),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  interactive: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Badge;
