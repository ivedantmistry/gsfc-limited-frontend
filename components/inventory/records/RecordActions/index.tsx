// src/components/records/RecordActions/index.tsx

"use client";

import React, { useState } from "react";
import { TestRecord } from "@/lib/types/test.types";
import { useHasPermission } from "@/hooks/useHasPermission";
import { approveOrRejectTest, closeTestRecord } from "@/lib/api/test";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import RejectModal from "./RejectModal";
import RetestModal from "./RetestModal";

interface RecordActionsProps {
  testRecord: TestRecord;
}

export default function RecordActions({ testRecord }: RecordActionsProps) {
  const router = useRouter();
  const canApprove = useHasPermission("inventory.can_approve_test_records");

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRetestModalOpen, setIsRetestModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveOrRejectTest(testRecord.id, { status: "APPROVED" });
      toast.success("Success", {
        description: "Test record has been approved.",
      });
      router.refresh();
    } catch (error) {
      toast.error("Error", { description: "Failed to approve record." });
    } finally {
      setIsApproving(false);
    }
  };

  const handleClose = async () => {
    setIsClosing(true);
    try {
      await closeTestRecord(testRecord.id);
      toast.success("Success", {
        description: "Test record has been closed.",
      });
      router.refresh();
    } catch (error) {
      toast.error("Error", { description: "Failed to close record." });
    } finally {
      setIsClosing(false);
    }
  };

  if (!canApprove) {
    return null;
  }

  return (
    <>
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">Actions</h3>
        </div>
        <div className="p-4 space-y-3">
          {testRecord.status === "PENDING" && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}{" "}
                Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setIsRejectModalOpen(true)}
              >
                Reject
              </Button>
            </div>
          )}

          {/* ✅ 1. SHOW "ORDER RETEST" FOR APPROVED/REJECTED */}
          {(testRecord.status === "APPROVED" ||
            testRecord.status === "REJECTED") && (
            <Button
              className="w-full"
              onClick={() => setIsRetestModalOpen(true)}
            >
              Order Retest
            </Button>
          )}

          {/* ✅ 2. SHOW "CLOSE RECORD" FOR APPROVED, REJECTED, OR RETEST_ORDERED */}
          {(testRecord.status === "APPROVED" ||
            testRecord.status === "REJECTED" ||
            testRecord.status === "RETEST_ORDERED") && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleClose}
              disabled={isClosing}
            >
              {isClosing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Close Record
            </Button>
          )}

          {testRecord.status === "CLOSED" && (
            <p className="text-sm text-center text-slate-500">
              This record is closed.
            </p>
          )}
        </div>
      </div>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        recordId={testRecord.id}
      />
      <RetestModal
        isOpen={isRetestModalOpen}
        onClose={() => setIsRetestModalOpen(false)}
        recordId={testRecord.id}
      />
    </>
  );
}
