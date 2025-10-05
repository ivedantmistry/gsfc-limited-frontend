"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/context/AuthContext";
import { notFound } from "next/navigation";

export default function TestLayout({ children }: { children: ReactNode }) {
  const canEnterTestData = useHasPermission("inventory.view_testrecord");

  if (!canEnterTestData) {
    notFound();
  }

  return <>{children}</>;
}
