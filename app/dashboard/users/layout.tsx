// src/app/dashboard/users/layout.tsx
"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/context/AuthContext";
import AccessDenied from "@/components/shared/AccessDenied";

export default function AdminUsersLayout({
  children,
}: {
  children: ReactNode;
}) {
  const canViewUsers = useHasPermission("authentication.view_user_list");

  if (!canViewUsers) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
