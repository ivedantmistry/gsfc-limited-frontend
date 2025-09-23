"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { notFound } from "next/navigation";

export default function InventoryLayout({ children }: { children: ReactNode }) {
  const canViewInventory = useHasPermission("inventory.can_view_products");

  if (!canViewInventory) {
    notFound();
  }

  return <>{children}</>;
}
