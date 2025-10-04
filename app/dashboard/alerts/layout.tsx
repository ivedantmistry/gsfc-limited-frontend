// src/app/dashboard/alerts/layout.tsx

"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { notFound } from "next/navigation";

export default function AlertsLayout({ children }: { children: ReactNode }) {
  const canViewAlerts = useHasPermission("alerts.view_alert");

  if (canViewAlerts === null) {
    notFound();
  }

  if (!canViewAlerts) {
    notFound();
  }

  return <>{children}</>;
}
