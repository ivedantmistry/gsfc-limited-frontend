// app/dashboard/quality-trends/layout.tsx
"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/context/AuthContext";
import AccessDenied from "@/components/shared/AccessDenied";

export default function QualityTrendsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const canViewTrends = useHasPermission("inventory.can_view_quality_trends");

  if (!canViewTrends) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
