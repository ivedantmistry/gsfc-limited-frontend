"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/context/AuthContext";
import { notFound } from "next/navigation";

export default function ProductDetailLayout({ children }: { children: ReactNode }) {
  const canViewProducts = useHasPermission("inventory.can_view_products");

  if (!canViewProducts) {
    notFound();
  }

  return <>{children}</>;
}