// /app/dashboard/users/[userId]/layout.tsx
"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useUser } from "@/lib/api/users"; // Use the new single user hook
import { UserProfileContext } from "@/context/UserProfileContext";
import { Loader2, ChevronRight, User as UserIcon } from "lucide-react";

export default function UserProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const userIdParam = params.usersId as string;
  const userId =
    userIdParam && !isNaN(Number(userIdParam)) ? Number(userIdParam) : null;

  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    notFound();
  }

  return (
    <UserProfileContext.Provider
      value={{ user: user || null, userId, isLoading }}
    >
      <div className="space-y-6">
        <nav className="flex items-center text-sm font-medium text-slate-500">
          <UserIcon className="h-4 w-4 mr-2" />
          <Link href="/dashboard/users" className="hover:text-slate-900">
            User Management
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-slate-900">{user?.username}</span>
        </nav>
        {children}
      </div>
    </UserProfileContext.Provider>
  );
}
