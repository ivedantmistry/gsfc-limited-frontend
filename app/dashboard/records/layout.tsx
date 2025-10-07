"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/context/AuthContext";
import AccessDenied from "@/components/shared/AccessDenied";

export default function TestLayout({ children }: { children: ReactNode }) {
  const canEnterTestData = useHasPermission("inventory.view_testrecord");

  if (!canEnterTestData) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
