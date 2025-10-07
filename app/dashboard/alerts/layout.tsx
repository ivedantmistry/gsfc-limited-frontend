// src/app/dashboard/alerts/layout.tsx
"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/context/AuthContext";
import AccessDenied from "@/components/shared/AccessDenied";

export default function AlertsLayout({ children }: { children: ReactNode }) {
  const canViewAlerts = useHasPermission("alerts.view_alert");

  if (!canViewAlerts) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
