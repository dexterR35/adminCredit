import { supabase } from "../supabase/client";
import { FormatTimestamp } from "../utils/date";
import {
  sanitizeEmail,
  sanitizeFormValues,
  sanitizePhone,
  sanitizeText,
} from "../utils/sanitize";
import { isFisaReportStatus, normalizeFisaStatus } from "./fisaReportStatus";

export const REFERRAL_LABELS = {
  facebook: "Facebook",
  pliant: "Pliant",
  tiktok: "TikTok",
  consultant: "Consultant",
  recomandare: "Referral",
};

export const PATH_LABELS = {
  negative_report: "Negative BC report",
  standard: "Standard",
};

export const OUTCOME_LABELS = {
  institutions_selected: "Institutions selected",
  has_history: "With banking history",
  no_history: "No banking history",
};

const formatInstitutionList = (institutions = [], type) => {
  const items = institutions
    .filter((row) => row.institution_type === type)
    .map((row) => (type === "other" ? row.custom_name : row.institution_key))
    .filter(Boolean);

  return items.length ? items.join(", ") : "—";
};

export const mapWebClientRow = (row) => {
  const institutions = row.credit_application_institutions || [];

  return {
    id: row.id,
    status: normalizeFisaStatus(row.status),
    path: row.path,
    path_label: PATH_LABELS[row.path] || row.path,
    outcome: row.outcome,
    outcome_label: OUTCOME_LABELS[row.outcome] || row.outcome,
    full_name: row.full_name || "",
    phone: row.phone || "",
    email: row.email || "",
    referral_source: row.referral_source || "",
    referral_source_label: REFERRAL_LABELS[row.referral_source] || row.referral_source || "—",
    has_negative_bc_report: row.has_negative_bc_report,
    has_banking_history: row.has_banking_history,
    employment_start_date: row.employment_start_date || "",
    bank_count: row.bank_count ?? 0,
    ifn_count: row.ifn_count ?? 0,
    other_institution_count: row.other_institution_count ?? 0,
    banks: formatInstitutionList(institutions, "bank"),
    ifn: formatInstitutionList(institutions, "ifn"),
    others: formatInstitutionList(institutions, "other"),
    assigned_user_id: row.assigned_user_id || null,
    raw_payload: row.raw_payload || {},
    submitted_at: row.submitted_at,
    created_at: row.created_at,
    submitted_at_label: FormatTimestamp(row.submitted_at || row.created_at),
  };
};

const WEB_CLIENTS_INSTITUTIONS = `
  credit_application_institutions (
    institution_type,
    institution_key,
    custom_name
  )
`;

const WEB_CLIENTS_LIST_COLUMNS = `
  id,
  status,
  path,
  outcome,
  full_name,
  phone,
  email,
  referral_source,
  has_negative_bc_report,
  has_banking_history,
  employment_start_date,
  bank_count,
  ifn_count,
  other_institution_count,
  assigned_user_id,
  submitted_at,
  created_at,
  ${WEB_CLIENTS_INSTITUTIONS}
`;

const WEB_CLIENTS_DETAIL_SELECT = `
  *,
  ${WEB_CLIENTS_INSTITUTIONS}
`;

export const fetchWebClients = async () => {
  const { data, error } = await supabase
    .from("credit_applications")
    .select(WEB_CLIENTS_LIST_COLUMNS)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapWebClientRow);
};

export const fetchWebClientById = async (id) => {
  const { data, error } = await supabase
    .from("credit_applications")
    .select(WEB_CLIENTS_DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapWebClientRow(data) : null;
};

export const updateWebClient = async (id, values) => {
  const sanitized = sanitizeFormValues(values, {
    full_name: "text",
    phone: "phone",
    email: "email",
    referral_source: "text",
    employment_start_date: "date",
  });

  const { error } = await supabase
    .from("credit_applications")
    .update({
      full_name: sanitizeText(sanitized.full_name, { maxLength: 120, trim: true }),
      phone: sanitizePhone(sanitized.phone),
      email: sanitized.email ? sanitizeEmail(sanitized.email) : null,
      referral_source: sanitizeText(sanitized.referral_source, { maxLength: 60, trim: true }) || null,
      employment_start_date: sanitized.employment_start_date || null,
      has_banking_history: Boolean(sanitized.has_banking_history),
      has_negative_bc_report: Boolean(sanitized.has_negative_bc_report),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
};

export const updateWebClientStatus = async (id, status) => {
  const normalized = normalizeFisaStatus(status);
  if (!isFisaReportStatus(normalized)) {
    throw new Error("Invalid client status.");
  }

  const { error } = await supabase
    .from("credit_applications")
    .update({
      status: normalized,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return normalized;
};

export const deleteWebClient = async (id) => {
  const { error } = await supabase.from("credit_applications").delete().eq("id", id);
  if (error) throw error;
};

export const assignWebClientToUser = async (creditApplicationId, assignedUserId, assignedBy) => {
  const { error: assignmentError } = await supabase.from("client_assignments").upsert(
    {
      credit_application_id: creditApplicationId,
      assigned_user_id: assignedUserId,
      assigned_by: assignedBy,
    },
    { onConflict: "credit_application_id" }
  );

  if (assignmentError) throw assignmentError;

  const { error } = await supabase
    .from("credit_applications")
    .update({ assigned_user_id: assignedUserId, updated_at: new Date().toISOString() })
    .eq("id", creditApplicationId);

  if (error && error.code !== "PGRST204") throw error;
};

export const fetchUsersForAssignment = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .in("role", ["admin", "consultant"])
    .order("username", { ascending: true });

  if (error) throw error;
  return data || [];
};

/** @deprecated use fetchUsersForAssignment */
export const fetchConsultantsForAssignment = fetchUsersForAssignment;
