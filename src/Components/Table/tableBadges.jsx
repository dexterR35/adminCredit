import PropTypes from "prop-types";
import Badge from "../Badge/Badge";
import {
  yesNoBadgeVariant,
  PHONE_BADGE_PRESET,
  resolveBadgeVariant,
} from "../Badge/badgeStyles";
import { sanitizeUrlForHref } from "../../utils/sanitize";
import { openTelLink } from "../../utils/phone";

const TABLE_BADGE_CLASS = "data-badge";

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
      onClick={(event) => event.stopPropagation()}
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
      onClick={(event) => {
        event.stopPropagation();
        openTelLink(value);
      }}
    >
      {value}
    </Badge>
  );
};

export const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return value;
};

TableBadge.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

DataBadge.propTypes = {
  positive: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  yesLabel: PropTypes.string,
  noLabel: PropTypes.string,
  emptyLabel: PropTypes.string,
};

LinkDataBadge.propTypes = {
  url: PropTypes.string,
  viewLabel: PropTypes.string.isRequired,
  missingLabel: PropTypes.string.isRequired,
  viewVariant: PropTypes.string,
  missingVariant: PropTypes.string,
};

PhoneDataBadge.propTypes = {
  phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyLabel: PropTypes.string,
  variant: PropTypes.string,
};
