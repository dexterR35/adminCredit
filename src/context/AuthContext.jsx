import React, { createContext, useContext, useMemo } from "react";
import { useAuthUser } from "../services/Hooks";

const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const { user, loading, isAdmin } = useAuthUser();
  const value = useMemo(() => ({ user, loading, isAdmin }), [user, loading, isAdmin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
