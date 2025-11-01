// src/components/records/RecordHeader.tsx

"use client";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import React, { useState } from "react";
import { TestRecord } from "@/lib/types/test.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";

// Helper to get status colors and variants
const getStatusVariant = (status: TestRecord["status"]) => {
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

interface RecordHeaderProps {
  testRecord: TestRecord;
  onDownloadPdf: () => void;
  isPdfDownloading: boolean; // 👈 Renamed for clarity
  onDownloadExcel: () => void; // 👈 Add Excel prop
  isExcelDownloading: boolean; // 👈 Add Excel prop
}

export default function RecordHeader({
  testRecord,
  onDownloadPdf,
  isPdfDownloading,
  onDownloadExcel,
  isExcelDownloading,
}: RecordHeaderProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(testRecord.record_id).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      },
      (err) => {
        console.error("Failed to copy ID: ", err);
      }
    );
  };

  return (
    <TooltipProvider>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {testRecord.product_name}
          </h1>
          <div className="mt-2 flex items-center gap-4">
            {/* ✅ Record ID with Copy Button */}
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <span className="font-mono">ID: {testRecord.record_id}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? "Copied!" : "Copy ID"}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Badge className={`badge-${getStatusVariant(testRecord.status)}`}>
              {testRecord.status}
            </Badge>
            {testRecord.retest_record_id && (
              <Badge
                variant="outline"
                className="border-blue-300 text-blue-700"
              >
                RETEST
              </Badge>
            )}
          </div>
        </div>

        {/* ✅ 2. Add the download button here */}
        <div className="mt-4 md:mt-0">
          <Button
            onClick={onDownloadExcel}
            disabled={isExcelDownloading}
            variant="outline"
          >
            {isExcelDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            {isExcelDownloading ? "Generating..." : "Excel"}
          </Button>
          <Button
            onClick={onDownloadPdf}
            disabled={isPdfDownloading} // 👈 Use renamed prop
            variant="outline"
          >
            {isPdfDownloading ? ( // 👈 Use renamed prop
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {isPdfDownloading ? "Generating..." : "PDF"}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
