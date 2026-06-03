import { supabase } from "../supabase/client";

/** All app users eligible for fisa report assignment (admin + consultant). */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .in("role", ["admin", "consultant"])
    .order("username", { ascending: true });

  if (error) throw error;
  return data || [];
};

