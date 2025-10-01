import React from "react";
import { TestRecord } from "../../../lib/types"; // Adjust path if needed
import { ClipboardList } from "lucide-react";
import { TestRecordSkeletonRow } from "./TestRecordSkeletonRow";
import { TestRecordRow } from "./TestRecordRow";

interface TestRecordTableProps {
  records?: TestRecord[];
  isLoading: boolean;
  error: any;
  canManage: boolean;
}

export const TestRecordTable = ({
  records,
  isLoading,
  error,
  canManage,
}: TestRecordTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="bg-slate-100 text-xs text-slate-700 uppercase tracking-wider">
          <tr>
            <th scope="col" className="px-6 py-3">Record ID</th>
            <th scope="col" className="px-6 py-3">Product</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Analyst</th>
            <th scope="col" className="px-6 py-3">Date Created</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TestRecordSkeletonRow key={i} />
            ))}
          {error && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-red-500">
                Failed to load test records.
              </td>
            </tr>
          )}
          {!isLoading && records && records.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-16 text-slate-500">
                <ClipboardList className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                <h3 className="font-medium">No records found.</h3>
                <p className="text-xs mt-1">
                  Click "Enter Data" to create a new test record.
                </p>
              </td>
            </tr>
          )}
          {!isLoading &&
            records?.map((record) => (
              <TestRecordRow
                key={record.id}
                record={record}
                canManage={canManage}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};