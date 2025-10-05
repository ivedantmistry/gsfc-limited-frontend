// src/app/dashboard/admin/users/page.tsx
"use client";

import React from "react";
import { useUsers } from "@/lib/api/users";
import UsersTable from "@/components/users/UsersTable";
import { Loader2 } from "lucide-react";
import PaginationControls from "@/components/shared/PaginationControls";
import { useSearchParams } from "next/navigation";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");

  const { users, totalCount, isLoading, error } = useUsers(page, pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          User Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all users in the system.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load users.</div>}

      {users && (
        <>
          <UsersTable users={users} />
          {totalCount != null && (
            <PaginationControls
              totalCount={totalCount}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </div>
  );
}