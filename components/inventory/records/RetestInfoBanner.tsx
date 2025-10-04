// src/components/inventory/records/RetestInfoBanner.tsx
"use client";

import React from "react";
import Link from "next/link";
import { TestRecord } from "@/lib/types/test.types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, RefreshCw } from "lucide-react";

interface RetestInfoBannerProps {
  testRecord: TestRecord;
}

export default function RetestInfoBanner({
  testRecord,
}: RetestInfoBannerProps) {
  // Case 1: This is a retest record.
  if (testRecord.retest_of) {
    return (
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 !text-blue-800" />
        <AlertTitle className="font-semibold">This is a Retest</AlertTitle>
        <AlertDescription>
          This test is a retest for the original record{" "}
          <Link
            href={`/dashboard/records/${testRecord.retest_of.id}`}
            className="font-medium underline hover:no-underline"
          >
            {testRecord.retest_of.record_id}
          </Link>
          Please perform the analysis and enter the results below.
        </AlertDescription>
      </Alert>
    );
  }

  // Case 2: This is an old record that has been superseded by a retest.
  if (testRecord.status === "RETEST_ORDERED" && testRecord.retests.length > 0) {
    const newRetest = testRecord.retests[0]; // Get the first retest
    return (
      <Alert variant="destructive">
        <RefreshCw className="h-4 w-4" />
        <AlertTitle>Record Superseded</AlertTitle>
        <AlertDescription>
          {/* ✅ CHANGED: Update the message to be accurate */}
          This record has been superseded by retest{" "}
          <Link
            href={`/dashboard/records/${newRetest.id}`}
            className="font-medium underline hover:no-underline"
          >
            {newRetest.record_id}
          </Link>
          . This original record can now be closed.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}