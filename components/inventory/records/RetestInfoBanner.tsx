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
  // Case 1: This record IS a retest
  if (testRecord.retest_of) {
    return (
      <Alert className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 text-blue-700" />
          <div>
            <AlertTitle className="font-semibold text-blue-800">
              This is a Retest
            </AlertTitle>
            <AlertDescription className="text-sm text-blue-700">
              This test is a retest for the original record{" "}
              <Link
                href={`/dashboard/records/${testRecord.retest_of.id}`}
                className="font-medium text-blue-700 underline hover:text-blue-900 transition-colors"
              >
                {testRecord.retest_of.record_id}
              </Link>
              . Please perform the analysis and enter the results below.
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  // Case 2: This record has been superseded by a retest
  if (testRecord.status === "RETEST_ORDERED" && testRecord.retests.length > 0) {
    const newRetest = testRecord.retests[0];
    return (
      <Alert className="bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-5 w-5 mt-0.5 text-red-700" />
          <div>
            <AlertTitle className="font-semibold text-red-800">
              Record Superseded
            </AlertTitle>
            <AlertDescription className="text-sm text-red-700">
              <span>
                This record has been superseded by retest{" "}
                <Link
                  href={`/dashboard/records/${newRetest.id}`}
                  className="font-medium text-red-700 underline hover:text-red-900 transition-colors"
                >
                  {newRetest.record_id}
                </Link>
                .
              </span>
              <br />
              <span>This original record can now be closed.</span>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  return null;
}
