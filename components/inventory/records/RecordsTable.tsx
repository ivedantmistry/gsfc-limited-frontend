// src/components/records/TestRecordsTable.tsx

"use client";

import React, { useState } from "react";
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
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TestRecord, TestRecordInList } from "@/lib/types/test.types";
import { format } from "date-fns";
import { Copy, Check } from "lucide-react";

const getStatusColor = (
  status: TestRecord["status"] | TestRecordInList["status"]
) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700 border border-green-300";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "REJECTED":
      return "bg-red-100 text-red-700 border border-red-300";
    case "RETEST_ORDERED":
      return "bg-blue-100 text-blue-700 border border-blue-300";
    case "CLOSED":
    default:
      return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

interface RecordsTableProps {
  records: TestRecordInList[];
}

export default function RecordsTable({ records }: RecordsTableProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, id: string, recordId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(recordId).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700">
                Record ID
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Product
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Analyst
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Lab
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Date Created
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow
                  key={record.id}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                  onClick={() => router.push(`/dashboard/records/${record.id}`)}
                >
                  {/* Record ID + Copy */}
                  <TableCell className="font-mono text-slate-800">
                    <div className="flex items-center gap-2">
                      <span>{record.record_id}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-transparent"
                            onClick={(e) =>
                              handleCopy(e, String(record.id), record.record_id)
                            }
                          >
                            {copiedId === String(record.id) ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-slate-500 hover:text-slate-700" />
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

                  {/* Product Name */}
                  <TableCell className="font-medium text-slate-800">
                    {record.product_name}
                  </TableCell>

                  {/* Analyst */}
                  <TableCell className="text-slate-600">
                    {record.analyst_full_name || "N/A"}
                  </TableCell>

                  {/* Lab */}
                  <TableCell className="text-slate-600">
                    {record.lab_name}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      className={`text-xs font-semibold px-2 py-1 rounded-md ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-slate-600">
                    {format(
                      new Date(record.created_at),
                      "dd MMM yyyy, hh:mm a"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-500"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
