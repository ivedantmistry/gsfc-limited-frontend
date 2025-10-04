// src/components/inventory/records/RetestInfoBanner.tsx

"use client";

import React from "react";
import Link from "next/link";
import { TestRecord } from "@/lib/types/test.types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface RetestInfoBannerProps {
  testRecord: TestRecord;
}

export default function RetestInfoBanner({
  testRecord,
}: RetestInfoBannerProps) {
  const { user } = useAuth();

  // Case 1: This is a new retest record assigned to the current user.
  if (
    testRecord.retest_record_id &&
    user?.id === testRecord.analyst &&
    testRecord.status === "PENDING"
  ) {
    return (
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 !text-blue-800" />
        <AlertTitle className="font-semibold">
          You are assigned this retest
        </AlertTitle>
        <AlertDescription>
          This is a retest for the original record{" "}
          <Link href="#" className="font-medium underline hover:no-underline">
            {/* We'll need to find the original record's ID to link to it */}
            {testRecord.retest_record_id}
          </Link>
          Please perform the analysis and enter the results below.
        </AlertDescription>
      </Alert>
    );
  }

  // Case 2: This is a new retest record, but not assigned to the current user.
  if (testRecord.retest_record_id) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>This is a Retest</AlertTitle>
        <AlertDescription>
          This test is a retest for the original record{" "}
          <Link href="#" className="font-medium underline hover:no-underline">
            {testRecord.retest_record_id}
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }

  // Case 3: This is an old record that has been superseded by a retest.
  if (testRecord.status === "RETEST_ORDERED" && testRecord.retests.length > 0) {
    const newRetestId = testRecord.retests[0]; // Assuming the first ID is the relevant one
    return (
      <Alert variant="destructive">
        <RefreshCw className="h-4 w-4" />
        <AlertTitle>Record Superseded</AlertTitle>
        <AlertDescription>
          This record has been superseded by retest{" "}
          <Link href="#" className="font-medium underline hover:no-underline">
            {/* We'll need to find the new record's ID to link to it */}
            {newRetestId}
          </Link>
          . No further actions can be taken on this record.
        </AlertDescription>
      </Alert>
    );
  }

  return null; // Don't render the banner if it's a normal record
}
