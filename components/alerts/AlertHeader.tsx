// src/components/alerts/AlertHeader.tsx

import React from "react";
import { AlertDetail, AlertStatus } from "@/lib/types/alert.types";
import { Badge } from "@/components/ui/badge";

const getStatusVariant = (status: AlertStatus) => {
  switch (status) {
    case "NEW": return "warning";
    case "ACKNOWLEDGED": return "default";
    case "RESOLVED": return "secondary";
    default: return "secondary";
  }
};

interface AlertHeaderProps {
  alert: AlertDetail;
}

export default function AlertHeader({ alert }: AlertHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Alert Details
        </h1>
        <div className="mt-2 flex items-center gap-4">
          <p className="text-sm text-slate-500 font-mono">
            ID: {alert.alert_id}
          </p>
          <Badge className={`badge-${getStatusVariant(alert.status)}`} variant="outline">
            {alert.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}