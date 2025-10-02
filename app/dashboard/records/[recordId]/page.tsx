// src/app/dashboard/records/[recordId]/page.tsx

"use client";

import React from "react";
import { useRecordDetail } from "@/context/RecordDetailContext"; // ✅ 1. IMPORT THE CUSTOM HOOK
import RecordHeader from "@/components/inventory/records/RecordHeader";
import RecordInfoCard from "@/components/inventory/records/RecordInfoCard";
import ResultsTable from "@/components/inventory/records/ResultsTable";
import RecordActions from "@/components/inventory/records/RecordActions/index";
import { Loader2 } from "lucide-react";

// ✅ 2. REMOVE PROPS. The page no longer receives props directly.
export default function RecordDetailPage() {
  // ✅ 3. PULL DATA FROM THE CONTEXT using our custom hook.
  const { testRecord } = useRecordDetail();

  // ✅ 4. ADD A GUARD. Handle the case where testRecord might still be loading.
  if (!testRecord) {
    // This will briefly show a spinner while the data is being passed through context.
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
    );
  }

  // By this point, testRecord is guaranteed to be defined.
  return (
    <>
      <RecordHeader testRecord={testRecord} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ResultsTable results={testRecord.parameter_values} />
        </div>
        <div className="space-y-6">
          <RecordActions testRecord={testRecord} />
          <RecordInfoCard testRecord={testRecord} />
        </div>
      </div>
    </>
  );
}