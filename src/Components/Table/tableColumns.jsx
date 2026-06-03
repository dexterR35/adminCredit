import {
  LinkDataBadge,
  DataBadge,
  TableBadge,
  formatCellValue,
} from "./tableBadges";
import { LINK_BADGE_PRESETS, statusBadgeVariant } from "../Badge/badgeStyles";

export { TableBadge, DataBadge, LinkDataBadge, formatCellValue } from "./tableBadges";

export const createLinkBadgeColumn = ({
  accessorKey,
  header,
  size = 120,
  missingLabel = "Missing",
  viewLabel = "View",
  viewVariant = "default",
  missingVariant = "default",
}) => ({
  accessorKey,
  header,
  size,
  Cell: ({ row }) => (
    <LinkDataBadge
      url={row.original[accessorKey]}
      viewLabel={viewLabel}
      missingLabel={missingLabel}
      viewVariant={viewVariant}
      missingVariant={missingVariant}
    />
  ),
});

export const photoColumn = (options = {}) =>
  createLinkBadgeColumn({
    accessorKey: "photo_url",
    header: "Photo",
    missingLabel: "No photo",
    viewLabel: "View photo",
    ...LINK_BADGE_PRESETS.photo,
    ...options,
  });

export const pdfColumn = (options = {}) =>
  createLinkBadgeColumn({
    accessorKey: "pdf_url",
    header: "PDF",
    missingLabel: "No PDF",
    viewLabel: "View PDF",
    ...LINK_BADGE_PRESETS.pdf,
    ...options,
  });

export const signatureColumn = (options = {}) =>
  createLinkBadgeColumn({
    accessorKey: "signature_url",
    header: "Signature",
    missingLabel: "No signature",
    viewLabel: "View",
    ...LINK_BADGE_PRESETS.signature,
    ...options,
  });

/** Yes / No / — */
export const yesNoColumn = ({
  accessorKey,
  header,
  size = 110,
  yesLabel = "Yes",
  noLabel = "No",
  emptyLabel = "—",
}) => ({
  accessorKey,
  header,
  size,
  Cell: ({ row }) => (
    <DataBadge
      positive={row.original[accessorKey]}
      yesLabel={yesLabel}
      noLabel={noLabel}
      emptyLabel={emptyLabel}
    />
  ),
});

/** Text value: primary if present, danger if missing */
export const dataBadgeColumn = ({
  accessorKey,
  header,
  size = 120,
  emptyLabel = "—",
  capitalize = false,
}) => ({
  accessorKey,
  header,
  size,
  Cell: ({ row }) => {
    const raw = row.original[accessorKey];
    const value = formatCellValue(raw);

    if (!value || value === "—") {
      return <TableBadge variant="danger">{emptyLabel}</TableBadge>;
    }

    const display = capitalize
      ? String(value).replace(/\b\w/g, (char) => char.toUpperCase())
      : String(value);

    return <TableBadge variant="primary">{display}</TableBadge>;
  },
});

/** Status field */
export const statusBadgeColumn = ({
  accessorKey,
  header,
  size = 100,
  emptyLabel = "—",
}) => ({
  accessorKey,
  header,
  size,
  Cell: ({ row }) => {
    const value = formatCellValue(row.original[accessorKey]);

    if (!value) {
      return <TableBadge variant="default">{emptyLabel}</TableBadge>;
    }

    return (
      <TableBadge variant={statusBadgeVariant(value)}>{value}</TableBadge>
    );
  },
});
