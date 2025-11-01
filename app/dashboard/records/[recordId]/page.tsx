// src/app/dashboard/records/[recordId]/page.tsx

"use client";
import { toast } from "sonner";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRecordDetail } from "@/context/RecordDetailContext";
import RecordHeader from "@/components/inventory/records/RecordHeader";
import RecordInfoCard from "@/components/inventory/records/RecordInfoCard";
import ResultsTable from "@/components/inventory/records/ResultsTable";
import ResultsEntryForm from "@/components/inventory/records/ResultsEntryForm";
import RecordActions from "@/components/inventory/records/RecordActions/index";
import { Loader2 } from "lucide-react";
import RetestInfoBanner from "@/components/inventory/records/RetestInfoBanner";
import RecordAlertsCard from "@/components/inventory/records/RecordAlertsCard";
import { triggerBrowserDownload } from "@/lib/utils";
import { downloadTestRecordPdf, downloadTestRecordExcel } from "@/lib/api/test";

export default function RecordDetailPage() {
  const { testRecord } = useRecordDetail();
  const { user } = useAuth();
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isExcelDownloading, setIsExcelDownloading] = useState(false);
  const handleDownloadPdf = async () => {
    if (!testRecord) return;

    setIsPdfDownloading(true);
    try {
      const pdfBlob = await downloadTestRecordPdf(testRecord.id);
      triggerBrowserDownload(pdfBlob, `Report-${testRecord.record_id}.pdf`);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to generate PDF report.");
    } finally {
      setIsPdfDownloading(false);
    }
  };
  const handleDownloadExcel = async () => {
    if (!testRecord) return;
    setIsExcelDownloading(true);
    try {
      const excelBlob = await downloadTestRecordExcel(testRecord.id);
      triggerBrowserDownload(excelBlob, `Report-${testRecord.record_id}.xlsx`);
    } catch (error) {
      console.error("Failed to download Excel:", error);
      toast.error("Failed to generate Excel report.");
    } finally {
      setIsExcelDownloading(false);
    }
  };
  if (!testRecord) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const canEdit =
    testRecord.status === "PENDING" &&
    user?.id === testRecord.analyst &&
    testRecord.parameter_values.length === 0;

  const showActions = testRecord.status !== "CLOSED";

  return (
    <>
      <RecordHeader
        testRecord={testRecord}
        onDownloadPdf={handleDownloadPdf}
        isPdfDownloading={isPdfDownloading}
        onDownloadExcel={handleDownloadExcel}
        isExcelDownloading={isExcelDownloading}
      />
      <RetestInfoBanner testRecord={testRecord} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {canEdit ? (
            <ResultsEntryForm testRecord={testRecord} />
          ) : (
            <ResultsTable results={testRecord.parameter_values} />
          )}
          <RecordAlertsCard testRecord={testRecord} />
        </div>
        <div className="space-y-6">
          {showActions && <RecordActions testRecord={testRecord} />}
          <RecordInfoCard testRecord={testRecord} />
        </div>
      </div>
    </>
  );
}
