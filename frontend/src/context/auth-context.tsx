"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("ideon_access_token");
      if (token) {
        const userData = await api.users.me();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load user profile", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: any) => {
    const res = await api.auth.login(data);
    if (res.access_token) {
      localStorage.setItem("ideon_access_token", res.access_token);
      await refreshUser();
      router.push("/dashboard");
    }
  };

  const signup = async (data: any) => {
    await api.auth.signup(data);
    // After signup, we log them in automatically with the same credentials
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("ideon_access_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
