"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { get, post } from "@/services/api";

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const data = await get("/auth/session");
      setUser(data?.user || null);
    } catch (err) {
      console.error("Failed to fetch user session:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await post("/auth/logout", {});
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      // Still clear user on client side
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
