import Badge from "../Badge/Badge";
import {
  yesNoBadgeVariant,
  presenceBadgeVariant,
  resolveBadgeVariant,
} from "../Badge/badgeStyles";
import { sanitizeUrlForHref } from "../../utils/sanitize";

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
  viewVariant = "default",
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

export const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  return value;
};
