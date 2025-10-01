"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { notFound } from "next/navigation";

// This layout's only job is to protect the product detail route.
export default function ProductDetailLayout({ children }: { children: ReactNode }) {
  const canViewProducts = useHasPermission("inventory.can_view_products");

  if (!canViewProducts) {
    notFound();
  }

  return <>{children}</>;
}