// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, LoginResponse } from "@/lib/types"; // Import from the single source of truth

// --- 1. CONTEXT DEFINITION ---
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 2. PROVIDER COMPONENT ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect to initialize from localStorage is correct
    const initializeAuth = () => {
      const userJSON = localStorage.getItem("user");
      if (userJSON) {
        try {
          setUser(JSON.parse(userJSON));
        } catch (error) {
          localStorage.clear(); // Clear all if data is corrupt
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
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
    // Your existing logout logic is correct
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 3. CONSUMER HOOKS ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useHasPermission = (requiredPermission: string): boolean => {
  const { user } = useAuth();
  if (!user || !user.all_permissions) {
    return false;
  }
  return user.all_permissions.includes(requiredPermission);
};
