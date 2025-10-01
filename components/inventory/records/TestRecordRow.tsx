"use client";

import React from "react";
import Link from "next/link";
import { FilePenLine } from "lucide-react";
import { TestRecord } from "../../../lib/types"; // Adjust path if needed

interface TestRecordRowProps {
  record: TestRecord;
  canManage: boolean;
}

// Helper to get color classes based on status
const getStatusBadge = (status: TestRecord["status"]) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
  switch (status) {
    case "APPROVED":
      return `bg-green-100 text-green-800 ${baseClasses}`;
    case "REJECTED":
      return `bg-red-100 text-red-800 ${baseClasses}`;
    case "RETEST":
    case "RETEST_ORDERED":
      return `bg-yellow-100 text-yellow-800 ${baseClasses}`;
    case "PENDING":
    default:
      return `bg-slate-100 text-slate-800 ${baseClasses}`;
  }
};

export const TestRecordRow = ({ record, canManage }: TestRecordRowProps) => {
  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <tr className="bg-white border-b hover:bg-slate-50/70 transition-colors">
      <td className="px-6 py-4 font-mono text-slate-800">{record.record_id}</td>
      <td className="px-6 py-4 font-medium text-slate-900">
        {record.product_name}
      </td>
      <td className="px-6 py-4">
        <span className={getStatusBadge(record.status)}>{record.status}</span>
      </td>
      <td className="px-6 py-4 text-slate-700">{record.analyst_username}</td>
      <td className="px-6 py-4 text-slate-600">{formattedDate}</td>
      <td className="px-6 py-4">
        {canManage && (
          <Link href={`/dashboard/tests/${record.record_id}`}>
            <span
              className="p-2 rounded-md hover:bg-slate-200 inline-block"
              title="View/Edit Record"
            >
              <FilePenLine className="w-4 h-4 text-slate-600" />
            </span>
          </Link>
        )}
      </td>
    </tr>
  );
};
