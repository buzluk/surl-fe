import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { postLogin } from "../services/userService";
import type { ISignInRequest } from "../types/account";
type User = { username: string };
type AuthState = {
  user: User | null;
  token: string | null;
};

type AuthContextType = AuthState & {
  login: (loginData: ISignInRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    if (t && u) {
      setToken(t);
      setUser({ username: u });
    }
  }, []);

  const login = async ({ username, password }: ISignInRequest) => {
    const token = await postLogin({ username, password });
    if (!token) throw new Error("Login failed");
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setToken(token);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};