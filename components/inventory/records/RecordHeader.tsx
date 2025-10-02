// src/components/records/RecordHeader.tsx

import React from "react";
import { TestRecord } from "@/lib/types/test.types";
import { Badge } from "@/components/ui/badge";

// Helper from your TestRecordsTable component
const getStatusVariant = (status: TestRecord['status']) => {
  switch (status) {
    case "PENDING": return "secondary";
    case "APPROVED": return "default";
    case "REJECTED": return "destructive";
    case "RETEST_ORDERED": return "outline";
    default: return "secondary";
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
          <Badge variant={getStatusVariant(testRecord.status)}>{testRecord.status}</Badge>
        </div>
      </div>
    </div>
  );
}