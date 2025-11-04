import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { setAuthToken } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn("Invalid user payload in storage", error);
      localStorage.removeItem("user");
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = ({ user: userPayload, token: tokenPayload }) => {
    setUser(userPayload);
    setToken(tokenPayload);
    setAuthToken(tokenPayload);
    localStorage.setItem("user", JSON.stringify(userPayload));
    localStorage.setItem("token", tokenPayload);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ user, token, login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
