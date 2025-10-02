// src/app/dashboard/records/[recordId]/layout.tsx

"use client";

import React, { ReactNode } from "react";
import { useTestRecord } from "@/lib/api/test"; // Corrected import path
import { notFound, useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { RecordDetailContext } from "@/context/RecordDetailContext"; // ✅ 1. IMPORT THE CONTEXT

export default function RecordDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const recordId = params.recordId as string;

  const { testRecord, isLoading, error } = useTestRecord(recordId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    if (error.response?.status === 404) {
      notFound();
    }
    return (
      <div className="text-center bg-red-50 border border-dashed border-red-300 rounded-lg p-12 text-red-700">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        <h3 className="font-medium">Failed to load test record</h3>
        <p className="text-sm text-red-600 mt-1">
          There was an error fetching the data. Please try again later.
        </p>
      </div>
    );
  }

  // NOTE: The `if (!testRecord)` guard is no longer strictly necessary here
  // because the page component will now handle the undefined case.

  // ✅ 2. WRAP THE CHILDREN IN THE CONTEXT PROVIDER
  // This makes the 'testRecord', 'isLoading', and 'error' values available
  // to the page and any other components inside this layout.
  return (
    <RecordDetailContext.Provider value={{ testRecord, isLoading, error }}>
      <div className="space-y-6">{children}</div>
    </RecordDetailContext.Provider>
  );
}
