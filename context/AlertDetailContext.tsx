// src/contexts/AlertDetailContext.tsx

"use client";

import { createContext, useContext } from "react";
import { AlertDetail } from "@/lib/types/alert.types";

// Define the shape of the data our context will hold
interface AlertDetailContextType {
  alert: AlertDetail | undefined;
  isLoading: boolean;
  error: any;
}

// Create the context
const AlertDetailContext = createContext<AlertDetailContextType | undefined>(
  undefined
);

// Create a custom hook for easily using the context
export const useAlertDetail = () => {
  const context = useContext(AlertDetailContext);
  if (context === undefined) {
    throw new Error(
      "useAlertDetail must be used within an AlertDetailProvider"
    );
  }
  return context;
};

// We will use the Provider part directly in the layout
export { AlertDetailContext };
