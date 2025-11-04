// src/components/records/RecordInfoCard.tsx

import React from "react";
import Link from "next/link";
import { TestRecord } from "@/lib/types/test.types";
import { format } from "date-fns";

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex justify-between items-start py-1">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <div className="text-sm text-slate-800 text-right max-w-[60%] break-words">
      {value || <span className="text-slate-400">N/A</span>}
    </div>
  </div>
);

interface RecordInfoCardProps {
  testRecord: TestRecord;
}

export default function RecordInfoCard({ testRecord }: RecordInfoCardProps) {
  let decisionLabel: string | null = null;
  let decisionDateLabel: string | null = null;

  if (testRecord.decision === "REJECTED") {
    decisionLabel = "Rejected By:";
    decisionDateLabel = "Rejected At:";
  } else if (testRecord.decision === "APPROVED") {
    decisionLabel = "Approved By:";
    decisionDateLabel = "Approved At:";
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-800">Record Details</h3>
      </div>

      {/* Info content */}
      <div className="p-5 space-y-3">
        {testRecord.retest_of && (
          <InfoRow
            label="Original Record:"
            value={
              <Link
                href={`/dashboard/records/${testRecord.retest_of.id}`}
                className="font-mono text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                {testRecord.retest_of.record_id}
              </Link>
            }
          />
        )}

        {testRecord.retests && testRecord.retests.length > 0 && (
          <InfoRow
            label="Retest Order:"
            value={
              <div className="flex flex-col items-end gap-1">
                {testRecord.retests.map((retest) => (
                  <Link
                    key={retest.id}
                    href={`/dashboard/records/${retest.id}`}
                    className="font-mono text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                  >
                    {retest.record_id}
                  </Link>
                ))}
              </div>
            }
          />
        )}

        <InfoRow
          label="Product:"
          value={
            <Link
              href={`/dashboard/products/${testRecord.product_id}`}
              className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              {testRecord.product_name}
            </Link>
          }
        />

        <InfoRow label="Product Grade:" value={testRecord.product_grade_name} />

        <InfoRow
          label="Testing Version:"
          value={
            <Link
              href={`/dashboard/products/${testRecord.product_id}/versions/${testRecord.version}`}
              className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              {testRecord.version_name}
            </Link>
          }
        />
        <InfoRow label="Lab Tested At:" value={testRecord.lab_name} />

        <InfoRow
          label="Sample ID:"
          value={<span className="font-mono">{testRecord.sample_id}</span>}
        />

        <InfoRow
          label="Batch No:"
          value={<span className="font-mono">{testRecord.batch_no}</span>}
        />
        <InfoRow label="Tested By:" value={testRecord.analyst_full_name} />
        <InfoRow
          label="Tested At:"
          value={format(
            new Date(testRecord.created_at),
            "dd MMM yyyy, hh:mm a"
          )}
        />

        {decisionLabel && testRecord.approved_by_full_name && (
          <InfoRow
            label={decisionLabel}
            value={testRecord.approved_by_full_name}
          />
        )}
        {decisionDateLabel && testRecord.approved_at && (
          <InfoRow
            label={decisionDateLabel}
            value={format(
              new Date(testRecord.approved_at),
              "dd MMM yyyy, hh:mm a"
            )}
          />
        )}

        {testRecord.retest_ordered_by_full_name && (
          <InfoRow
            label="Retest Ordered By:"
            value={testRecord.retest_ordered_by_full_name}
          />
        )}
        {testRecord.retest_ordered_at && (
          <InfoRow
            label="Retest Ordered At:"
            value={format(
              new Date(testRecord.retest_ordered_at),
              "dd MMM yyyy, hh:mm a"
            )}
          />
        )}

        {testRecord.closed_by_full_name && (
          <InfoRow label="Closed By:" value={testRecord.closed_by_full_name} />
        )}
        {testRecord.closed_at && (
          <InfoRow
            label="Closed At:"
            value={format(
              new Date(testRecord.closed_at),
              "dd MMM yyyy, hh:mm a"
            )}
          />
        )}
      </div>
    </div>
  );
}
