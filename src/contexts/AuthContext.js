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
  login: () => {},
  register: () => {},
  logout: () => {},
  refreshUser: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      // First get the session to check if user is authenticated
      const sessionData = await get("/api/auth/session");
      
      if (sessionData?.user) {
        // Then get the full profile with image
        try {
          const profileData = await get("/api/user/profile");
          setUser({
            ...sessionData.user,
            ...profileData, // This will include the image
          });
        } catch (profileErr) {
          // If profile fetch fails, use session data
          console.error("Failed to fetch profile, using session data:", profileErr);
          setUser(sessionData.user);
        }
      } else {
        setUser(null);
      }
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

  const login = async (credentials) => {
    try {
      const data = await post("/api/auth/login", credentials);
      
      // After login, fetch full profile including image
      try {
        const profileData = await get("/api/user/profile");
        setUser({
          ...data.user,
          ...profileData,
        });
      } catch (profileErr) {
        setUser(data.user);
      }
      
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const data = await post("/api/auth/register", userData);
      
      // After register, fetch full profile including image
      try {
        const profileData = await get("/api/user/profile");
        setUser({
          ...data.user,
          ...profileData,
        });
      } catch (profileErr) {
        setUser(data.user);
      }
      
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await post("/api/auth/logout", {});
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      // Still clear user on client side
      setUser(null);
    }
  };

  // Memoized refreshUser to prevent infinite loops
  const refreshUser = useCallback(async () => {
    if (loading) return;
    
    try {
      const data = await get("/api/user/profile");
      if (data) {
        setUser(prevUser => ({
          ...prevUser,
          ...data,
        }));
      }
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
    }
  }, [loading]);

  const updateUser = useCallback((updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData,
    }));
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        refreshUser, 
        updateUser 
      }}
    >
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