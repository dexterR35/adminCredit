/** Canonical badge variants — use only these across tables, modals, and UI */

export const BADGE_VARIANTS_LIST = [
  "primary",
  "secondary",
  "success",
  "danger",
  "info",
  "default",
  "edit",
];

export const BADGE_BASE = "dash-badge";

export const BADGE_VARIANTS = {
  primary: "dash-badge-primary",
  secondary: "dash-badge-secondary",
  success: "dash-badge-success",
  danger: "dash-badge-danger",
  info: "dash-badge-info",
  default: "dash-badge-default",
  edit: "dash-badge-edit",
};

export const BADGE_SIZES = {
  sm: "dash-badge-sm",
  md: "dash-badge-md",
  lg: "dash-badge-lg",
};

/** Clickable badge (modal actions, links) */
export const BADGE_BUTTON = "dash-badge-btn";

export const resolveBadgeVariant = (variant) =>
  (variant && BADGE_VARIANTS[variant] ? variant : "default");

/** Yes / No / empty */
export const yesNoBadgeVariant = (value) => {
  if (value === null || value === undefined) return "default";
  if (typeof value === "boolean") return value ? "success" : "danger";
  const hasValue = value !== "" && value !== "—";
  return hasValue ? "success" : "danger";
};

/** Client / report status text */
export const statusBadgeVariant = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "approved" || s === "completed") return "primary";
  if (s === "rejected" || s === "cancelled") return "danger";
  if (s === "pending" || s === "new") return "edit";
  return "default";
};

/** Has value vs missing */
export const presenceBadgeVariant = (value) => {
  const formatted = value === null || value === undefined || value === "" ? null : value;
  if (!formatted || formatted === "—") return "danger";
  return "primary";
};

/** Link columns in contracts / reports tables */
export const LINK_BADGE_PRESETS = {
  photo: { viewVariant: "default", missingVariant: "default" },
  pdf: { viewVariant: "default", missingVariant: "default" },
  signature: { viewVariant: "default", missingVariant: "default" },
};

export const badgeClassName = ({
  variant = "default",
  size = "md",
  interactive = false,
  className = "",
} = {}) =>
  [
    BADGE_BASE,
    BADGE_VARIANTS[resolveBadgeVariant(variant)],
    BADGE_SIZES[size] || BADGE_SIZES.md,
    interactive ? BADGE_BUTTON : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
