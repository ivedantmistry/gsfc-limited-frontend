// hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Custom hook to access the authentication context.
 * Provides an easy way to get the user, loading state, and auth functions.
 * Throws an error if used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};