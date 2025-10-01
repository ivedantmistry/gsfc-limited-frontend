"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { notFound } from "next/navigation";

export default function TestsLayout({ children }: { children: ReactNode }) {
  // Check for the permission to view any test records.
  const canViewTests = useHasPermission("inventory.view_testrecord");

  // If the user lacks permission, prevent the page from rendering at all.
  if (!canViewTests) {
    notFound();
  }

  return <>{children}</>;
}