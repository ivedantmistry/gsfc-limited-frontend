// src/components/alerts/AlertActions.tsx

"use client";

import React, { useState } from "react";
import { AlertDetail } from "@/lib/types/alert.types";
import { useHasPermission } from "@/context/AuthContext";
import { updateAlertStatus } from "@/lib/api/alerts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSWRConfig } from "swr";

interface AlertActionsProps {
  alert: AlertDetail;
}

export default function AlertActions({ alert }: AlertActionsProps) {
  const canManageAlerts = useHasPermission(
    "inventory.can_approve_test_records"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleStatusUpdate = async (newStatus: "ACKNOWLEDGED" | "RESOLVED") => {
    setIsSubmitting(true);

    const swrKey = `/alerts/${alert.id}/context/`;

    try {
      await updateAlertStatus(alert.id, newStatus);
      toast.success(`Alert marked as ${newStatus.toLowerCase()}.`);

      mutate(swrKey);
    } catch {
      toast.error("Failed to update alert status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canManageAlerts || alert.status === "RESOLVED") {
    return null;
  }

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
