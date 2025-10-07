"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/context/AuthContext";
import AccessDenied from "@/components/shared/AccessDenied";

export default function ProductLayout({ children }: { children: ReactNode }) {
  const canViewInventory = useHasPermission("inventory.can_view_products");

  if (!canViewInventory) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
