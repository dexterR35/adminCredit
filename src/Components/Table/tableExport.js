import { buildCsv, buildExportFilename, downloadCsv } from "../../utils/csvExport";
import { normalizeFisaStatus } from "../../services/fisaReportStatus";

const plainValue = (value) => {
  if (value == null || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return "";
  return String(value);
};

export const resolveExportColumns = (tableColumns = [], exportColumns) => {
  const source = exportColumns?.length ? exportColumns : tableColumns;

  return source
    .filter((col) => col.exportable !== false && (col.key || col.accessorKey))
    .map((col) => {
      const key = col.key || col.accessorKey;
      const header = col.exportHeader || col.header || key;

      if (typeof col.exportValue === "function") {
        return { key, header, getValue: col.exportValue };
      }

      const accessorKey = col.accessorKey || col.key;
      return {
        key,
        header,
        getValue: (row) => plainValue(row?.[accessorKey]),
      };
    });
};

export const exportRowsToCsv = ({
  rows,
  columns,
  selectedKeys,
  fileName,
}) => {
  const activeColumns = columns.filter((col) => selectedKeys.includes(col.key));
  if (!activeColumns.length || !rows.length) return false;

  const headers = activeColumns.map((col) => col.header);
  const dataRows = rows.map((row) =>
    activeColumns.map((col) => col.getValue(row))
  );

  downloadCsv(buildCsv(headers, dataRows), buildExportFilename(fileName));
  return true;
};

export const webClientExportColumns = [
  { key: "full_name", header: "Name" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "referral_source_label", header: "Source" },
  { key: "path_label", header: "Path" },
  { key: "outcome_label", header: "Outcome" },
  { key: "banks", header: "Banks" },
  { key: "ifn", header: "IFN" },
  { key: "others", header: "Others" },
  { key: "employment_start_date", header: "Employment date" },
  {
    key: "has_banking_history",
    header: "Bank history",
    exportValue: (row) => (row.has_banking_history ? "Yes" : "No"),
  },
  {
    key: "has_negative_bc_report",
    header: "Negative BC",
    exportValue: (row) => (row.has_negative_bc_report ? "Yes" : "No"),
  },
  { key: "submitted_at_label", header: "Submitted" },
  {
    key: "status",
    header: "Status",
    exportValue: (row) => normalizeFisaStatus(row.status),
  },
];

export const fisaReportExportColumns = [
  { key: "client_full_name", header: "Client" },
  { key: "today_date", header: "Report date" },
  { key: "client_cnp", header: "CNP" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  {
    key: "user_status",
    header: "Status",
    exportValue: (row) => normalizeFisaStatus(row.user_status),
  },
  {
    key: "consultant",
    header: "Consultant",
    exportValue: (row) => row.form_data?.userName || "",
  },
  {
    key: "requested_credit",
    header: "Credit requested",
    exportValue: (row) => row.form_data?.requestedCreditValue ?? "",
  },
  { key: "photo_url", header: "Photo URL" },
  { key: "pdf_url", header: "PDF URL" },
  { key: "created_at_label", header: "Created" },
];

export const contractExportColumns = [
  { key: "first_name", header: "First name" },
  { key: "last_name", header: "Last name" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "photo_url", header: "Photo URL" },
  { key: "pdf_url", header: "PDF URL" },
  { key: "signature_url", header: "Signature URL" },
  { key: "created_at_label", header: "Created" },
];
