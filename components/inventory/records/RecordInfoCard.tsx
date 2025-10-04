// src/components/records/RecordInfoCard.tsx

import React from "react";
import { TestRecord } from "@/lib/types/test.types";
import { format } from "date-fns";

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex justify-between items-center">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="text-sm text-slate-800 text-right">{value || "N/A"}</p>
  </div>
);

interface RecordInfoCardProps {
  testRecord: TestRecord;
}

export default function RecordInfoCard({ testRecord }: RecordInfoCardProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-slate-800">Record Details</h3>
      </div>
      <div className="p-4 space-y-3">
        <InfoRow label="Analyst" value={testRecord.analyst_full_name} />
        <InfoRow label="Lab" value={testRecord.lab_name} />
        <InfoRow
          label="Sample ID"
          value={<span className="font-mono">{testRecord.sample_id}</span>}
        />
        <InfoRow
          label="Batch No"
          value={<span className="font-mono">{testRecord.batch_no}</span>}
        />
        <InfoRow label="Product Grade" value={testRecord.product_grade_name} />
        <InfoRow
          label="Created At"
          value={format(
            new Date(testRecord.created_at),
            "dd MMM yyyy, hh:mm a"
          )}
        />
        {testRecord.approved_by_full_name && (
          <InfoRow
            label="Approved By"
            value={testRecord.approved_by_full_name}
          />
        )}
        {testRecord.approved_at && (
          <InfoRow
            label="Approved At"
            value={format(
              new Date(testRecord.approved_at),
              "dd MMM yyyy, hh:mm a"
            )}
          />
        )}
      </div>
    </div>
  );
}
