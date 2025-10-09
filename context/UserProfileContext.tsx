// src/context/UserProfileContext.tsx
"use client";
import { createContext, useContext } from "react";
import { User } from "@/lib/types";

interface UserProfileContextType {
  user: User | null;
  userId: number | null;
  isLoading: boolean;
}

export const UserProfileContext = createContext<UserProfileContextType>({
  user: null,
  userId: null,
  isLoading: true,
});

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};