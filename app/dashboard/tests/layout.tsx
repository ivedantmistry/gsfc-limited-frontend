"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { notFound } from "next/navigation";

export default function TestLayout({ children }: { children: ReactNode }) {
  // Guard the entire route. A user must be able to add a test to see this page.
  const canEnterTestData = useHasPermission("inventory.add_testrecord");

  if (!canEnterTestData) {
    notFound();
  }

  // The outer padding and container will be handled by the page itself.
  return <>{children}</>;
}