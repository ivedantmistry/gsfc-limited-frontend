// src/components/records/TestRecordsTable.tsx

"use client";

import React, { useState } from "react"; //
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TestRecord, TestRecordInList } from "@/lib/types/test.types";
import { format } from "date-fns";
import { Copy, Check } from "lucide-react";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // This function now includes `e.stopPropagation()` to prevent navigation
  const handleCopy = (e: React.MouseEvent, id: string, recordId: string) => {
    e.stopPropagation(); // Prevents the row's onClick from firing
    navigator.clipboard.writeText(recordId).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Reset feedback after 2s
    });
  };
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
                  {/* ✅ 5. Added copy button and functionality */}
                  <div className="flex items-center gap-2">
                    <span>{record.record_id}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) =>
                            handleCopy(e, String(record.id), record.record_id)
                          }
                        >
                          {copiedId === String(record.id) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent onClick={(e) => e.stopPropagation()}>
                        <p>
                          {copiedId === String(record.id)
                            ? "Copied!"
                            : "Copy ID"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
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
