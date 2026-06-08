import { supabase } from "../supabase/client";
import { sanitizeText } from "../utils/sanitize";
import {
  formatFollowUpDateTime,
  isFollowUpInFuture,
  validateFollowUpDraft,
} from "../utils/followUpDates";
import { isInProgressClientStatus, normalizeFisaStatus } from "./fisaReportStatus";

const mapFollowUpRow = (row) => ({
  id: row.id,
  user_id: row.user_id,
  credit_application_id: row.credit_application_id,
  fisa_report_id: row.fisa_report_id,
  follow_up_at: row.follow_up_at,
  follow_up_at_label: formatFollowUpDateTime(row.follow_up_at),
  note: row.note || "",
  dismissed_at: row.dismissed_at,
  created_at: row.created_at,
  client_name:
    row.credit_applications?.full_name
    || row.fisa_reports?.client_full_name
    || "Client",
  client_status: normalizeFisaStatus(
    row.credit_applications?.status || row.fisa_reports?.user_status
  ),
  source: row.credit_application_id ? "web_client" : "fisa_report",
});

const filterInProgressReminders = (rows) =>
  rows
    .map(mapFollowUpRow)
    .filter((row) => isInProgressClientStatus(row.client_status));

const dedupeActiveRemindersByClient = (rows) => {
  const byClient = new Map();

  rows.forEach((row) => {
    const key = row.credit_application_id || row.fisa_report_id;
    if (!key) return;

    const existing = byClient.get(key);
    if (
      !existing
      || new Date(row.follow_up_at).getTime() > new Date(existing.follow_up_at).getTime()
    ) {
      byClient.set(key, row);
    }
  });

  return [...byClient.values()].sort(
    (a, b) => new Date(a.follow_up_at).getTime() - new Date(b.follow_up_at).getTime(),
  );
};

const FOLLOW_UP_SELECT = `
  id,
  user_id,
  credit_application_id,
  fisa_report_id,
  follow_up_at,
  note,
  dismissed_at,
  created_at,
  credit_applications ( full_name, status ),
  fisa_reports ( client_full_name, user_status )
`;

const applyClientFollowUpFilter = (query, { creditApplicationId, fisaReportId }) => {
  if (creditApplicationId) {
    return query.eq("credit_application_id", creditApplicationId);
  }
  if (fisaReportId) {
    return query.eq("fisa_report_id", fisaReportId);
  }
  return null;
};

/** Active (non-dismissed) row for a client, if any. */
export const fetchActiveFollowUpForClient = async ({ creditApplicationId, fisaReportId }) => {
  let query = supabase
    .from("client_follow_ups")
    .select(FOLLOW_UP_SELECT)
    .is("dismissed_at", null)
    .order("follow_up_at", { ascending: false })
    .limit(1);

  query = applyClientFollowUpFilter(query, { creditApplicationId, fisaReportId });
  if (!query) return null;

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? mapFollowUpRow(data) : null;
};

export const fetchFollowUpsForClient = async ({ creditApplicationId, fisaReportId }) => {
  const active = await fetchActiveFollowUpForClient({ creditApplicationId, fisaReportId });
  if (!active || !isInProgressClientStatus(active.client_status)) {
    return [];
  }
  return [active];
};

export const fetchMyActiveReminders = async () => {
  const { data, error } = await supabase
    .from("client_follow_ups")
    .select(FOLLOW_UP_SELECT)
    .is("dismissed_at", null)
    .order("follow_up_at", { ascending: true });

  if (error) throw error;
  return dedupeActiveRemindersByClient(filterInProgressReminders(data || []));
};

export const createClientFollowUp = async ({
  creditApplicationId,
  fisaReportId,
  followUpAt,
  note = "",
}) => {
  if (!followUpAt) {
    throw new Error("Follow-up date and time are required.");
  }
  if (!isFollowUpInFuture(followUpAt)) {
    throw new Error("Reminder must be scheduled in the future.");
  }
  if (!creditApplicationId && !fisaReportId) {
    throw new Error("Client reference is required.");
  }

  const payload = {
    follow_up_at: followUpAt,
    note: sanitizeText(note, { maxLength: 500, trim: true }) || null,
    dismissed_at: null,
    updated_at: new Date().toISOString(),
  };

  if (creditApplicationId) {
    payload.credit_application_id = creditApplicationId;
  } else {
    payload.fisa_report_id = fisaReportId;
  }

  const { data, error } = await supabase
    .from("client_follow_ups")
    .insert(payload)
    .select(FOLLOW_UP_SELECT)
    .single();

  if (error) throw error;
  return mapFollowUpRow(data);
};

export const updateClientFollowUp = async (id, { followUpAt, note }) => {
  if (!followUpAt) {
    throw new Error("Follow-up date and time are required.");
  }
  if (!isFollowUpInFuture(followUpAt)) {
    throw new Error("Reminder must be scheduled in the future.");
  }

  const { data, error } = await supabase
    .from("client_follow_ups")
    .update({
      follow_up_at: followUpAt,
      note: sanitizeText(note, { maxLength: 500, trim: true }) || null,
      dismissed_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(FOLLOW_UP_SELECT)
    .single();

  if (error) throw error;
  return mapFollowUpRow(data);
};

export const postponeClientFollowUp = async (id, followUpAt) => {
  if (!followUpAt) {
    throw new Error("Date and time are required.");
  }
  if (!isFollowUpInFuture(followUpAt)) {
    throw new Error("New reminder must be scheduled in the future.");
  }

  const { data, error } = await supabase
    .from("client_follow_ups")
    .update({
      follow_up_at: followUpAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(FOLLOW_UP_SELECT)
    .single();

  if (error) throw error;
  return mapFollowUpRow(data);
};

export const dismissClientFollowUp = async (id) => {
  const { data, error } = await supabase
    .from("client_follow_ups")
    .update({
      dismissed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(FOLLOW_UP_SELECT)
    .single();

  if (error) throw error;
  return mapFollowUpRow(data);
};

export const deleteClientFollowUp = async (id) => {
  const { error } = await supabase.from("client_follow_ups").delete().eq("id", id);
  if (error) throw error;
};

export const saveFollowUpFromDraft = async ({
  creditApplicationId,
  fisaReportId,
  draft,
}) => {
  const validation = validateFollowUpDraft(draft);
  if (!validation.shouldSave) return null;
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const existing = await fetchActiveFollowUpForClient({ creditApplicationId, fisaReportId });

  if (existing) {
    return updateClientFollowUp(existing.id, {
      followUpAt: validation.followUpAt,
      note: draft.note,
    });
  }

  return createClientFollowUp({
    creditApplicationId,
    fisaReportId,
    followUpAt: validation.followUpAt,
    note: draft.note,
  });
};
