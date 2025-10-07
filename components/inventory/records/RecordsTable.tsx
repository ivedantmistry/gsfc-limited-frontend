// src/components/records/TestRecordsTable.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TestRecord, TestRecordInList } from "@/lib/types/test.types";
import { format } from "date-fns";

const getStatusVariant = (
  status: TestRecord["status"] | TestRecordInList["status"]
) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "destructive";
    case "CLOSED":
    case "RETEST_ORDERED":
    default:
      return "secondary";
  }
};

interface RecordsTableProps {
  records: TestRecordInList[];
}
export default function RecordsTable({ records }: RecordsTableProps) {
  const router = useRouter();
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Record ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Analyst</TableHead>
            <TableHead>Lab</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((record) => (
              <TableRow
                key={record.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/dashboard/records/${record.id}`)}
              >
                <TableCell className="font-mono">
                    {record.record_id}
                </TableCell>
                <TableCell>{record.product_name}</TableCell>
                <TableCell>{record.analyst_full_name || "N/A"}</TableCell>
                <TableCell>{record.lab_name}</TableCell>
                <TableCell>
                  <Badge className={`badge-${getStatusVariant(record.status)}`}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(record.created_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No records have been created today.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
