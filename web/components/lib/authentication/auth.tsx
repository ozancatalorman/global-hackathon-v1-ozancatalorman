"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

const KEY = "storma_auth";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "1";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem(KEY) === "1");
    }
  }, []);

  const login = (email: string, password: string) => {
    const envEmail = process.env.NEXT_PUBLIC_LOGIN_EMAIL ?? "";
    const envPass = process.env.NEXT_PUBLIC_LOGIN_PASSWORD ?? "";
    const ok = email === envEmail && password === envPass;
    if (ok && typeof window !== "undefined") {
      localStorage.setItem(KEY, "1");
      setIsLoggedIn(true);
    }
    return ok;
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEY);
      setIsLoggedIn(false);
    }
  };

  const value = useMemo(() => ({ isLoggedIn, login, logout }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
