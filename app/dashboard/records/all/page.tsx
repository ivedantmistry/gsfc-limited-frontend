// src/app/dashboard/records/all/page.tsx

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { Loader2 } from "lucide-react";
import TestRecordsTable from "@/components/inventory/records/TestRecordsTable";
import PaginationControls from "@/components/inventory/records/PaginationControls";

export default function AllRecordsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "10");

  const {
    testRecords,
    totalCount,
    isLoading,
    error,
  } = useTestRecords({
    view_type: "historical", // ✅ Tell the backend we want all records
    page: page,
    pageSize: pageSize,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          All Test Records
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Showing all historical test records assigned to you.
        </p>
      </div>

      {isLoading && <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}
      {error && <div className="text-red-600">Failed to load records.</div>}
      {testRecords && (
        <>
          <TestRecordsTable records={testRecords} />
          <PaginationControls 
            totalCount={totalCount || 0}
            currentPage={page}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  );
}