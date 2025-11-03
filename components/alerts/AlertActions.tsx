// src/components/alerts/AlertActions.tsx

"use client";

import React, { useState } from "react";
import { AlertDetail } from "@/lib/types/alert.types";
import { useHasPermission } from "@/context/AuthContext";
import { updateAlertStatus } from "@/lib/api/alerts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSWRConfig } from "swr"; // Correct import

interface AlertActionsProps {
  alert: AlertDetail;
}

export default function AlertActions({ alert }: AlertActionsProps) {
  const canManageAlerts = useHasPermission(
    "inventory.can_approve_test_records"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig(); // Get the global mutate function

  const handleStatusUpdate = async (newStatus: "ACKNOWLEDGED" | "RESOLVED") => {
    setIsSubmitting(true);

    // This is the SWR cache key for the alert page's main data
    const swrKey = `/alerts/${alert.id}/`;

    try {
      // 1. Call the API to update the status. We don't need the return value.
      await updateAlertStatus(alert.id, newStatus);
      toast.success(`Alert marked as ${newStatus.toLowerCase()}.`);

      // 2. ✅ TELL SWR TO RE-FETCH (REVALIDATE) THE DATA
      // This call tells SWR "the data for this key is stale, go get it again."
      // SWR will then automatically re-fetch data from `/alerts/${alert.id}/`.
      // The page will re-render with the fresh data from the server.
      mutate(swrKey);
    } catch (_error) {
      // Prefixed 'error' with '_' to mark it as unused
      toast.error("Failed to update alert status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canManageAlerts || alert.status === "RESOLVED") {
    return null;
  }

  // ... (rest of the component JSX is unchanged)
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-slate-800">Actions</h3>
      </div>
      <div className="p-4 space-y-3">
        {alert.status === "NEW" && (
          <Button
            className="w-full"
            onClick={() => handleStatusUpdate("ACKNOWLEDGED")}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Acknowledge Alert
          </Button>
        )}
        {alert.status === "ACKNOWLEDGED" && (
          <Button
            className="w-full"
            onClick={() => handleStatusUpdate("RESOLVED")}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mark as Resolved
          </Button>
        )}
      </div>
    </div>
  );
}
