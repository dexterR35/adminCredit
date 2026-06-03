import Badge from "../Badge/Badge";
import {
  yesNoBadgeVariant,
  presenceBadgeVariant,
  PHONE_BADGE_PRESET,
  resolveBadgeVariant,
} from "../Badge/badgeStyles";
import { sanitizeUrlForHref } from "../../utils/sanitize";
import { openTelLink } from "../../utils/phone";

const TABLE_BADGE_CLASS = "dash-table-badge";

/** Reusable table cell badge */
export const TableBadge = ({ variant = "default", children, className = "" }) => (
  <Badge
    variant={resolveBadgeVariant(variant)}
    size="sm"
    className={`${TABLE_BADGE_CLASS} ${className}`.trim()}
  >
    {children}
  </Badge>
);

/** Yes / No / — */
export const DataBadge = ({
  positive,
  yesLabel = "Yes",
  noLabel = "No",
  emptyLabel = "—",
}) => {
  const variant = yesNoBadgeVariant(positive);
  const label =
    positive === null || positive === undefined
      ? emptyLabel
      : typeof positive === "boolean"
        ? positive
          ? yesLabel
          : noLabel
        : positive !== "" && positive !== "—"
          ? positive
          : emptyLabel;

  return <TableBadge variant={variant}>{label}</TableBadge>;
};

/** External link with view / missing labels */
export const LinkDataBadge = ({
  url,
  viewLabel,
  missingLabel,
  viewVariant = "info",
  missingVariant = "default",
}) => {
  const safeHref = sanitizeUrlForHref(url);

  if (!safeHref) {
    return (
      <TableBadge variant={resolveBadgeVariant(missingVariant)}>
        {missingLabel}
      </TableBadge>
    );
  }

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex cursor-pointer"
    >
      <Badge
        variant={resolveBadgeVariant(viewVariant)}
        size="sm"
        interactive
        className={TABLE_BADGE_CLASS}
      >
        {viewLabel}
      </Badge>
    </a>
  );
};

/** Clickable phone number — blue info badge, opens tel: link */
export const PhoneDataBadge = ({
  phone,
  emptyLabel = "—",
  variant = PHONE_BADGE_PRESET.variant,
}) => {
  const value = String(phone ?? "").trim();

  if (!value) {
    return <TableBadge variant="default">{emptyLabel}</TableBadge>;
  }

  return (
    <Badge
      as="button"
      type="button"
      variant={resolveBadgeVariant(variant)}
      size="sm"
      interactive
      className={TABLE_BADGE_CLASS}
      onClick={() => openTelLink(value)}
    >
      {value}
    </Badge>
  );
};

export const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return value;
};
