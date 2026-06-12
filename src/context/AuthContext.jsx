import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { useAuthUser } from "../services/Hooks";

const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  scopes: [],
});

export const AuthProvider = ({ children }) => {
  const { user, loading, isAdmin } = useAuthUser();
  const value = useMemo(
    () => ({ user, loading, isAdmin, scopes: user?.scopes || [] }),
    [user, loading, isAdmin]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
