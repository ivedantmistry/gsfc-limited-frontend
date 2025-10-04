// src/app/dashboard/records/[recordId]/layout.tsx

"use client";

import React, { ReactNode } from "react";
import Link from "next/link"; // ✅ 1. Import Link
import { useTestRecord } from "@/lib/api/test"; // Corrected import path
import { notFound, useParams } from "next/navigation";
import { Loader2, AlertCircle, ChevronRight } from "lucide-react";
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

  if (!testRecord) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <RecordDetailContext.Provider value={{ testRecord, isLoading, error }}>
      <div className="space-y-6">
        {/* ✅ 3. ADD THE BREADCRUMB NAVIGATION */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                href="/dashboard/records"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                Recent Records
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2">
                  {testRecord.record_id}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {children}
      </div>
    </RecordDetailContext.Provider>
  );
}
