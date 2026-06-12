import { supabase } from "../supabase/client";
import { toast } from "react-toastify";
import { sanitizeEmail, sanitizePassword } from "../utils/sanitize";
import { getScopesForRole } from "../utils/authSecurity";
import { requireScope } from "../utils/authSecurity";

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
    scopes: getScopesForRole(role),
    isAdmin: role === ADMIN_ROLE,
    raw: user,
    profile,
  };
};

export const getAccessToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.access_token || null;
};

export const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data.session;
};

export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw error || new Error("Not authenticated");
  const profile = await fetchProfile(user.id);
  return buildAuthUser(user, profile);
};

export const assertSessionScope = async (scope) => {
  const user = await getAuthenticatedUser();
  requireScope(user, scope);
  return user;
};

export const RevokeToken = async ({ scope = "local" } = {}) => {
  const { error } = await supabase.auth.signOut({ scope });
  if (error) {
    toast.error(error.message);
    throw error;
  }
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
  const safePassword = sanitizePassword(password);

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
  await RevokeToken({ scope: "local" });
  toast.success("Logout successful!");
};
