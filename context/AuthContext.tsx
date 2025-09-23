// context/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, LoginResponse } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userJSON = localStorage.getItem("user");

      if (accessToken && userJSON) {
        try {
          const storedUser: User = JSON.parse(userJSON);
          setUser(storedUser);
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleUserUpdate = () => {
      console.log("AuthContext: Detected user update from storage.");
      const userJSON = localStorage.getItem("user");
      if (userJSON) {
        try {
          const updatedUser: User = JSON.parse(userJSON);
          setUser(updatedUser);
        } catch (error) {
          console.error(
            "Failed to parse updated user from localStorage",
            error
          );
        }
      }
    };

    window.addEventListener("user-updated", handleUserUpdate);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, []);
  const login = async (data: any) => {
    const response = await api.post<LoginResponse>("/auth/token/", data);
    const { access, refresh, user: loggedInUser } = response.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);
    router.push("/dashboard");
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await api.post("/auth/logout/", { refresh_token: refreshToken });
      } catch (error) {
        console.error("Logout failed", error);
      }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
