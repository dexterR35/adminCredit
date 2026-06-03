export const FISA_REPORT_STATUSES = ["Pending", "Approved", "Denied"];

export const FISA_STATUS_OPTIONS = FISA_REPORT_STATUSES.map((value) => ({
  value,
  label: value,
}));

/** Labels shown when completing a fisa — explains when to pick each status */
export const FISA_STATUS_SUBMIT_OPTIONS = [
  { value: "Pending", label: "Pending — client not yet resolved" },
  { value: "Approved", label: "Approved — client resolved successfully" },
  { value: "Denied", label: "Denied — client cannot be resolved" },
];

export const normalizeFisaStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();

  if (value === "approved" || value === "approve") return "Approved";
  if (value === "denied" || value === "deny" || value === "rejected") return "Denied";
  if (value === "pending" || value === "new" || value === "") return "Pending";

  const match = FISA_REPORT_STATUSES.find(
    (item) => item.toLowerCase() === value
  );
  return match || "Pending";
};

export const isFisaReportStatus = (status) =>
  FISA_REPORT_STATUSES.includes(normalizeFisaStatus(status));
