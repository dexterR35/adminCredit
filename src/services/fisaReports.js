import { supabase } from "../supabase/client";
import { FormatTimestamp } from "../utils/date";
import {
  assertFormDataSize,
  isValidUuid,
  sanitizeCnp,
  sanitizeDeepStrings,
  sanitizeEmail,
  sanitizeText,
  sanitizeUrl,
} from "../utils/sanitize";
import { assertRomanianMobilePhone } from "../utils/phone";
import { isFisaReportStatus, normalizeFisaStatus } from "./fisaReportStatus";
import { getFisaReportAttachmentMeta } from "../utils/fisaReportDocuments";

export const mapFisaReportRow = (row) => {
  const attachmentMeta = getFisaReportAttachmentMeta(row);

  return {
    id: row.id,
    user_id: row.user_id,
    client_full_name: row.client_full_name || "",
    client_cnp: row.client_cnp || "",
    phone: row.phone || "",
    email: row.email || "",
    today_date: row.today_date || "",
    pdf_url: attachmentMeta.pdfUrl,
    photo_url: attachmentMeta.imageUrl,
    has_image_document: attachmentMeta.hasImage,
    has_pdf_document: attachmentMeta.hasPdf,
    user_status: normalizeFisaStatus(row.user_status),
    form_data: row.form_data || {},
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_at_label: FormatTimestamp(row.created_at),
  };
};

const FISA_LIST_COLUMNS = `
  id,
  user_id,
  client_full_name,
  client_cnp,
  phone,
  email,
  today_date,
  pdf_url,
  photo_url,
  user_status,
  form_data,
  created_at,
  updated_at,
  fisa_report_attachments (
    content_type,
    original_name
  )
`;

const FISA_DETAIL_COLUMNS = `${FISA_LIST_COLUMNS}, form_data`;

export const fetchFisaReports = async () => {
  const { data, error } = await supabase
    .from("fisa_reports")
    .select(FISA_LIST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapFisaReportRow);
};

export const resolveFisaReportUserId = async (formData, sessionUserId, { isAdmin = false } = {}) => {
  if (!isValidUuid(sessionUserId)) {
    throw new Error("Invalid session user");
  }

  if (!isAdmin) return sessionUserId;

  const requestedId = formData?.user;
  if (!requestedId) return sessionUserId;

  if (!isValidUuid(requestedId)) {
    throw new Error("Invalid consultant selected");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", requestedId)
    .in("role", ["admin", "consultant"])
    .maybeSingle();

  if (error) throw error;
  if (!profile) throw new Error("Selected consultant was not found");

  return profile.id;
};

export const addFisaReport = async (formData, userId, options = {}) => {
  const targetUserId = await resolveFisaReportUserId(formData, userId, options);
  const safeForm = sanitizeDeepStrings(formData);
  assertFormDataSize(safeForm);

  const payload = {
    user_id: targetUserId,
    form_data: safeForm,
    client_full_name: sanitizeText(safeForm.clientFullName, { maxLength: 120, trim: true }),
    client_cnp: sanitizeCnp(safeForm.clientCNP),
    phone: assertRomanianMobilePhone(safeForm.phone),
    email: safeForm.email ? sanitizeEmail(safeForm.email) : null,
    today_date: sanitizeText(safeForm.todayDate, { maxLength: 20, trim: true }),
    pdf_url: sanitizeUrl(safeForm.pdfUrl),
    photo_url: sanitizeUrl(safeForm.photoUrl),
    user_status: normalizeFisaStatus(safeForm.userStatus || "In Progress"),
  };

  const { data, error } = await supabase.from("fisa_reports").insert(payload).select("id").single();
  if (error) throw error;
  return data.id;
};

export const deleteFisaReport = async (id) => {
  const { error } = await supabase.from("fisa_reports").delete().eq("id", id);
  if (error) throw error;
};

export const updateFisaReportStatus = async (id, status) => {
  const normalized = normalizeFisaStatus(status);
  if (!isFisaReportStatus(normalized)) {
    throw new Error("Invalid report status.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("fisa_reports")
    .select("form_data")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!existing) throw new Error("Report not found.");

  const formData = {
    ...(existing.form_data || {}),
    userStatus: normalized,
  };

  const { data, error } = await supabase
    .from("fisa_reports")
    .update({
      user_status: normalized,
      form_data: formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(FISA_LIST_COLUMNS)
    .single();

  if (error) throw error;
  return mapFisaReportRow(data);
};

export const fetchFisaReportById = async (id) => {
  const { data, error } = await supabase
    .from("fisa_reports")
    .select(FISA_DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapFisaReportRow(data) : null;
};
