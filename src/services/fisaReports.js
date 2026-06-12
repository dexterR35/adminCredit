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
import {
  formatFollowUpDateTime,
  isFollowUpDue,
} from "../utils/followUpDates";
import { isFisaReportStatus, isInProgressClientStatus, normalizeFisaStatus } from "./fisaReportStatus";
import { getFisaReportAttachmentMeta } from "../utils/fisaReportDocuments";
import { AUTH_SCOPES, createRequestContext } from "../utils/authSecurity";
import { assertSessionScope } from "./auth";

const pickActiveFollowUp = (followUps = []) =>
  followUps
    .filter((item) => !item.dismissed_at)
    .sort(
      (a, b) => new Date(b.follow_up_at).getTime() - new Date(a.follow_up_at).getTime(),
    )[0] || null;

export const formatRequestedCredit = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value).trim();
  return new Intl.NumberFormat("en-GB").format(amount);
};

export const mapFisaReportRow = (row) => {
  const attachmentMeta = getFisaReportAttachmentMeta(row);
  const status = normalizeFisaStatus(row.user_status);
  const activeFollowUp = pickActiveFollowUp(row.client_follow_ups);
  const showReminder = isInProgressClientStatus(status) && activeFollowUp;
  const requestedCredit = row.form_data?.requestedCreditValue ?? "";

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
    user_status: status,
    requested_credit: requestedCredit,
    requested_credit_label: formatRequestedCredit(requestedCredit),
    follow_up_at: showReminder ? activeFollowUp.follow_up_at : null,
    follow_up_at_label: showReminder
      ? formatFollowUpDateTime(activeFollowUp.follow_up_at)
      : "",
    follow_up_due: showReminder ? isFollowUpDue(activeFollowUp.follow_up_at) : false,
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
  ),
  client_follow_ups (
    follow_up_at,
    note,
    dismissed_at
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
  const actor = await assertSessionScope(AUTH_SCOPES.FISA_WRITE);
  const targetUserId = await resolveFisaReportUserId(formData, userId, options);
  const safeForm = sanitizeDeepStrings(formData);
  assertFormDataSize(safeForm);
  const requestContext = createRequestContext(actor, "fisa:create");

  const payload = {
    user_id: targetUserId,
    form_data: {
      ...safeForm,
      security: requestContext,
    },
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

export const updateFisaReportData = async (id, formData, options = {}) => {
  const actor = await assertSessionScope(AUTH_SCOPES.FISA_WRITE);
  const targetUserId = await resolveFisaReportUserId(formData, actor.id, options);
  const safeForm = sanitizeDeepStrings(formData);
  assertFormDataSize(safeForm);

  const payloadForm = {
    ...safeForm,
    security: createRequestContext(actor, "fisa:data:update"),
  };

  const { data, error } = await supabase
    .from("fisa_reports")
    .update({
      user_id: targetUserId,
      form_data: payloadForm,
      client_full_name: sanitizeText(safeForm.clientFullName, { maxLength: 120, trim: true }),
      client_cnp: sanitizeCnp(safeForm.clientCNP),
      phone: assertRomanianMobilePhone(safeForm.phone),
      email: safeForm.email ? sanitizeEmail(safeForm.email) : null,
      today_date: sanitizeText(safeForm.todayDate, { maxLength: 20, trim: true }),
      pdf_url: sanitizeUrl(safeForm.pdfUrl),
      photo_url: sanitizeUrl(safeForm.photoUrl),
      user_status: normalizeFisaStatus(safeForm.userStatus || "In Progress"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(FISA_LIST_COLUMNS)
    .single();

  if (error) throw error;
  return mapFisaReportRow(data);
};

export const assignFisaReportToUser = async (reportId, assignedUserId) => {
  const actor = await assertSessionScope(AUTH_SCOPES.USERS_ASSIGN);

  if (!isValidUuid(reportId)) {
    throw new Error("Invalid report selected.");
  }
  if (!isValidUuid(assignedUserId)) {
    throw new Error("Invalid consultant selected.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .eq("id", assignedUserId)
    .in("role", ["admin", "consultant"])
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) throw new Error("Selected consultant was not found.");

  const { data: existing, error: fetchError } = await supabase
    .from("fisa_reports")
    .select("form_data")
    .eq("id", reportId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!existing) throw new Error("Report not found.");

  const formData = {
    ...(existing.form_data || {}),
    user: profile.id,
    userName: profile.username || profile.email?.split("@")[0] || "User",
    security: createRequestContext(actor, "fisa:assign"),
  };

  const { data, error } = await supabase
    .from("fisa_reports")
    .update({
      user_id: profile.id,
      form_data: formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .select(FISA_LIST_COLUMNS)
    .single();

  if (error) throw error;

  const { error: followUpError } = await supabase
    .from("client_follow_ups")
    .update({
      user_id: profile.id,
      updated_at: new Date().toISOString(),
    })
    .eq("fisa_report_id", reportId)
    .is("dismissed_at", null);

  if (followUpError) throw followUpError;

  return mapFisaReportRow(data);
};

export const deleteFisaReport = async (id) => {
  await assertSessionScope(AUTH_SCOPES.FISA_DELETE);
  const { error } = await supabase.from("fisa_reports").delete().eq("id", id);
  if (error) throw error;
};

export const updateFisaReportStatus = async (id, status) => {
  const actor = await assertSessionScope(AUTH_SCOPES.FISA_WRITE);
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
    security: createRequestContext(actor, "fisa:status:update"),
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
