import { supabase } from "../supabase/client";
import { toast } from "react-toastify";
import { sanitizeEmail } from "../utils/sanitize";

export const ADMIN_ROLE = "admin";
export const CONSULTANT_ROLE = "consultant";

export const resolveRole = (user, profile) =>
  profile?.role || user?.app_metadata?.role || CONSULTANT_ROLE;

export const buildAuthUser = (user, profile) => {
  if (!user) return null;

  const role = resolveRole(user, profile);

  return {
    id: user.id,
    email: user.email,
    username: profile?.username || user.email?.split("@")[0] || "User",
    role,
    isAdmin: role === ADMIN_ROLE,
    raw: user,
    profile,
  };
};

export const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, role, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116" && error.code !== "PGRST205") {
    console.error("Profile fetch error:", error.message);
  }

  return data || null;
};

export const checkAuthStatus = (setUser, setLoading) => {
  let active = true;

  const hydrateUser = async (sessionUser) => {
    if (!sessionUser) {
      if (active) setUser(null);
      return;
    }

    const profile = await fetchProfile(sessionUser.id);
    if (active) setUser(buildAuthUser(sessionUser, profile));
  };

  supabase.auth.getSession().then(({ data: { session } }) => {
    hydrateUser(session?.user ?? null).finally(() => {
      if (active && setLoading) setLoading(false);
    });
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    hydrateUser(session?.user ?? null).finally(() => {
      if (active && setLoading) setLoading(false);
    });
  });

  return () => {
    active = false;
    subscription.unsubscribe();
  };
};

export const Login = async (email, password) => {
  const safeEmail = sanitizeEmail(email);
  const safePassword = typeof password === "string" ? password.trim() : "";

  if (!safeEmail || !safePassword) {
    toast.error("Please enter both email and password.");
    throw new Error("Missing credentials");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: safeEmail,
    password: safePassword,
  });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      const err = new Error("Invalid email or password.");
      err.code = "invalid_credentials";
      throw err;
    }
    toast.error(error.message);
    throw error;
  }

  toast.success("Login successful!");
  return buildAuthUser(data.user, await fetchProfile(data.user.id));
};

export const Logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error(error.message);
    throw error;
  }
  toast.success("Logout successful!");
};
