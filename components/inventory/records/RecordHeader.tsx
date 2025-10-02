// src/components/records/RecordHeader.tsx

import React from "react";
import { TestRecord, TestRecordInList } from "@/lib/types/test.types";
import { Badge } from "@/components/ui/badge";

// Helper to get status colors and variants
const getStatusVariant = (
  status: TestRecord["status"] | TestRecordInList["status"]
) => {
  switch (status) {
    case "APPROVED":
      return "success"; // We'll style this to be green
    case "PENDING":
      return "warning"; // We'll style this to be yellow
    case "REJECTED":
      return "destructive"; // Already red
    case "CLOSED":
    case "RETEST_ORDERED":
    default:
      return "secondary"; // Gray
  }
};
interface RecordHeaderProps {
  testRecord: TestRecord;
}

export default function RecordHeader({ testRecord }: RecordHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {testRecord.product_name}
        </h1>
        <div className="mt-2 flex items-center gap-4">
          <p className="text-sm text-slate-500 font-mono">
            ID: {testRecord.record_id}
          </p>
          <Badge className={`badge-${getStatusVariant(testRecord.status)}`}>
            {testRecord.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
