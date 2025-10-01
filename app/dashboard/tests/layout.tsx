"use client";

import React from "react";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { notFound } from "next/navigation";

/**
 * Layout for the Tests section.
 * It guards the entire route, showing a 404 page if the user lacks
 * the basic permission to view test records.
 */
export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the layout to check for the basic 'view' permission.
  const canViewTests = useHasPermission("inventory.view_testrecord");

  // If the user can't view the page at all, trigger a 404.
  if (!canViewTests) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}