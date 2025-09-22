// context/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, LoginResponse } from "@/lib/types";

// Define the shape of the context's value
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Effect to check for user session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userJSON = localStorage.getItem("user");

      if (accessToken && userJSON) {
        try {
          // You could optionally verify the token here by making a call to a 'verify' endpoint
          // For now, we trust the stored data.
          const storedUser: User = JSON.parse(userJSON);
          setUser(storedUser);
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          // Clear potentially corrupted storage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (data: any) => {
    const response = await api.post<LoginResponse>("/auth/token/", data);
    const { access, refresh, user: loggedInUser } = response.data;

    // Store tokens and user data
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    // Update state and redirect
    setUser(loggedInUser);
    router.push("/dashboard"); // Redirect to your main dashboard page
  };

  // Logout function
  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await api.post("/auth/logout/", { refresh_token: refreshToken });
      } catch (error) {
        console.error("Logout failed", error);
        // Still proceed with client-side logout even if server call fails
      }
    }

    // Clear everything from storage and state
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login"); // Redirect to login page
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};