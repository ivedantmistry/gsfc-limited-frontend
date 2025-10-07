// src/components/alerts/AlertsTable.tsx

"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertInList, AlertStatus } from "@/lib/types/alert.types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const getStatusVariant = (status: AlertStatus) => {
  switch (status) {
    case "NEW":
      return "warning";
    case "ACKNOWLEDGED":
      return "default";
    case "RESOLVED":
      return "secondary";
    default:
      return "secondary";
  }
};

interface AlertsTableProps {
  alerts: AlertInList[];
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
  const router = useRouter();
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Sample ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Date & Time Triggered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <TableRow
                key={alert.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/dashboard/alerts/${alert.id}`)}
              >
                <TableCell className="font-mono">{alert.alert_id}</TableCell>
                <TableCell>
                  <Badge
                    className={`badge-${getStatusVariant(alert.status)}`}
                    variant="outline"
                  >
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                    {`Parameter '${alert.details.parameter_name}' was ${alert.details.value_entered}`}
                  <p className="text-xs text-muted-foreground">
                    (Expected: {alert.details.normal_range})
                  </p>
                </TableCell>
                <TableCell className="font-mono">{alert.sample_id}</TableCell>
                <TableCell>{alert.product_name}</TableCell>
                <TableCell className="text-sm text-slate-500">
                  {format(new Date(alert.created_at), "dd MMM yyyy, hh:mm a")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No alerts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
