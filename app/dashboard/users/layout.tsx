// src/app/dashboard/admin/users/layout.tsx
"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/hooks/useHasPermission";
import { notFound } from "next/navigation";

export default function AdminUsersLayout({ children }: { children: ReactNode }) {
  // Guard the entire route with the specific permission
  const canViewUsers = useHasPermission("authentication.view_user_list");

  if (!canViewUsers) {
    notFound();
  }

  return <>{children}</>;
}