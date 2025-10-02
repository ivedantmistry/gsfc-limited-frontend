// src/components/records/TestRecordsTable.tsx

"use client";

import React from "react";
import Link from "next/link";
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

interface TestRecordsTableProps {
  records: TestRecordInList[];
}

export default function TestRecordsTable({ records }: TestRecordsTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Record ID</TableHead>
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
              >
                <TableCell className="font-mono">
                  <Link
                    href={`/dashboard/records/${record.id}`}
                    className="hover:underline"
                  >
                    {record.record_id}
                  </Link>
                </TableCell>
                <TableCell>{record.product_name}</TableCell>
                <TableCell>{record.analyst_username || "N/A"}</TableCell>
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
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
