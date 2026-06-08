import {
  LinkDataBadge,
  DataBadge,
  PhoneDataBadge,
  TableBadge,
  formatCellValue,
} from "./tableBadges";
import {
  LINK_BADGE_PRESETS,
  PHONE_BADGE_PRESET,
  statusBadgeVariant,
} from "../Badge/badgeStyles";
import { normalizeFisaStatus } from "../../services/fisaReportStatus";

export { TableBadge, DataBadge, LinkDataBadge, formatCellValue } from "./tableBadges";

export const createLinkBadgeColumn = ({
  accessorKey,
  header,
  size = 120,
  missingLabel = "Missing",
  viewLabel = "View",
  viewVariant = "info",
  missingVariant = "default",
}) => ({
  accessorKey,
  header,
  size,
  exportValue: (row) => row[accessorKey] || "",
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

const createFisaDocumentColumn = ({
  header,
  urlKey,
  flagKey,
  viewLabel,
  missingLabel,
  preset,
  size = 120,
}) => ({
  accessorKey: urlKey,
  header,
  size,
  exportValue: (row) => row[urlKey] || (row[flagKey] ? "attached" : ""),
  Cell: ({ row }) => {
    const data = row.original;
    const url = data[urlKey];

    if (url) {
      return (
        <LinkDataBadge
          url={url}
          viewLabel={viewLabel}
          missingLabel={missingLabel}
          {...LINK_BADGE_PRESETS[preset]}
        />
      );
    }

    if (data[flagKey]) {
      return <TableBadge variant="info">{viewLabel.replace(/^View /, "")}</TableBadge>;
    }

    return <TableBadge variant="default">{missingLabel}</TableBadge>;
  },
});

export const fisaPhotoColumn = (options = {}) =>
  createFisaDocumentColumn({
    header: "Photo",
    urlKey: "photo_url",
    flagKey: "has_image_document",
    viewLabel: "View photo",
    missingLabel: "No photo",
    preset: "photo",
    ...options,
  });

export const fisaPdfColumn = (options = {}) =>
  createFisaDocumentColumn({
    header: "PDF",
    urlKey: "pdf_url",
    flagKey: "has_pdf_document",
    viewLabel: "View PDF",
    missingLabel: "No PDF",
    preset: "pdf",
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

/** Clickable phone — same blue info badge as View PDF */
export const phoneColumn = (options = {}) => {
  const {
    accessorKey = "phone",
    header = "Phone",
    size = 100,
    emptyLabel = "—",
  } = options;

  return {
    accessorKey,
    header,
    size,
    exportValue: (row) => row[accessorKey] || "",
    Cell: ({ row }) => (
      <PhoneDataBadge
        phone={row.original[accessorKey]}
        emptyLabel={emptyLabel}
        variant={PHONE_BADGE_PRESET.variant}
      />
    ),
  };
};

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
  exportValue: (row) => {
    const value = row[accessorKey];
    if (value === true) return yesLabel;
    if (value === false) return noLabel;
    return "";
  },
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

/** Fisa report status: Pending / Approved / Denied */
export const fisaStatusBadgeColumn = ({
  accessorKey = "user_status",
  header = "Status",
  size = 100,
  emptyLabel = "Pending",
}) => ({
  accessorKey,
  header,
  size,
  exportValue: (row) => normalizeFisaStatus(row[accessorKey] || emptyLabel),
  Cell: ({ row }) => {
    const raw = formatCellValue(row.original[accessorKey]);
    const value = normalizeFisaStatus(raw || emptyLabel);

    return (
      <TableBadge variant={statusBadgeVariant(value)}>{value}</TableBadge>
    );
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
