// src/app/dashboard/records/[recordId]/page.tsx

"use client";

import React from "react";
import { useRecordDetail } from "@/context/RecordDetailContext";
import RecordHeader from "@/components/inventory/records/RecordHeader";
import RecordInfoCard from "@/components/inventory/records/RecordInfoCard";
import ResultsTable from "@/components/inventory/records/ResultsTable";
import RecordActions from "@/components/inventory/records/RecordActions/index"; // Corrected import path
import { Loader2 } from "lucide-react";

export default function RecordDetailPage() {
  const { testRecord } = useRecordDetail();

  if (!testRecord) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <RecordHeader testRecord={testRecord} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ResultsTable results={testRecord.parameter_values} />
          <RecordInfoCard testRecord={testRecord} />
        </div>
        <div className="space-y-6">
          {/* ✅ Swapped order to match your preference */}
          <RecordActions testRecord={testRecord} />
        </div>
      </div>
    </>
  );
}
