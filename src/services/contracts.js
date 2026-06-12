import { supabase } from "../supabase/client";
import { FormatTimestamp } from "../utils/date";
import { AUTH_SCOPES } from "../utils/authSecurity";
import { assertSessionScope } from "./auth";

export const mapContractRow = (row) => ({
  id: row.id,
  first_name: row.first_name || "",
  last_name: row.last_name || "",
  phone: row.phone || "",
  email: row.email || "",
  photo_url: row.photo_url || "",
  pdf_url: row.pdf_url || "",
  signature_url: row.signature_url || "",
  form_data: row.form_data || {},
  user_id: row.user_id || null,
  created_at: row.created_at,
  updated_at: row.updated_at,
  created_at_label: FormatTimestamp(row.created_at),
});

const CONTRACT_LIST_COLUMNS =
  "id, first_name, last_name, phone, email, photo_url, pdf_url, signature_url, user_id, created_at, updated_at";

const CONTRACT_DETAIL_COLUMNS = `${CONTRACT_LIST_COLUMNS}, form_data`;

export const fetchContracts = async () => {
  const { data, error } = await supabase
    .from("contracts")
    .select(CONTRACT_LIST_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapContractRow);
};

export const fetchContractById = async (id) => {
  const { data, error } = await supabase
    .from("contracts")
    .select(CONTRACT_DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapContractRow(data) : null;
};

export const deleteContract = async (id) => {
  await assertSessionScope(AUTH_SCOPES.CONTRACTS_DELETE);
  const { error } = await supabase.from("contracts").delete().eq("id", id);
  if (error) throw error;
};
