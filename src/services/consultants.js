import { supabase } from "../supabase/client";
import { toast } from "react-toastify";
import { sanitizeEmail, sanitizePassword, sanitizeUsername } from "../utils/sanitize";

export const getAllConsultants = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .eq("role", "consultant")
    .order("username", { ascending: true });

  if (error) throw error;
  return data || [];
};

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

export const getConsultantByUserName = async (username) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, email, role")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Consultant not found");
  return data;
};

export const AddConsultant = async (email, password, username) => {
  const safeEmail = sanitizeEmail(email);
  const safePassword = sanitizePassword(password);
  const safeUsername = sanitizeUsername(username);

  if (!safeEmail || !safePassword || !safeUsername) {
    toast.error("Please fill in all required fields with valid values.");
    throw new Error("Invalid consultant data");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const adminSession = sessionData.session;

  const { data, error } = await supabase.auth.signUp({
    email: safeEmail,
    password: safePassword,
    options: {
      data: { username: safeUsername },
    },
  });

  if (error) {
    toast.error(`Error adding consultant: ${error.message}`);
    throw error;
  }

  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email: safeEmail,
      username: safeUsername,
      role: "consultant",
    });

    if (profileError) {
      console.warn("Consultant profile upsert:", profileError.message);
    }
  }

  if (adminSession) {
    await supabase.auth.setSession({
      access_token: adminSession.access_token,
      refresh_token: adminSession.refresh_token,
    });
  }

  toast.success("Consultant added successfully!");
  return { id: data.user?.id, email: safeEmail, username: safeUsername, role: "consultant" };
};
