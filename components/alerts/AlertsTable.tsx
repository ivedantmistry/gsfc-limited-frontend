// src/components/alerts/AlertsTable.tsx

"use client";

import React from "react";
import Link from "next/link";
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

// ✅ Helper to get status colors for the badges
const getStatusVariant = (status: AlertStatus) => {
  switch (status) {
    case "NEW":
      return "warning"; // Yellow
    case "ACKNOWLEDGED":
      return "default"; // Will be styled as blue or primary
    case "RESOLVED":
      return "secondary"; // Gray
    default:
      return "secondary";
  }
};

interface AlertsTableProps {
  alerts: AlertInList[];
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Sample ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Date & Time Triggered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <TableRow key={alert.id} className="hover:bg-muted/50">
                <TableCell>
                  <Badge className={`badge-${getStatusVariant(alert.status)}`} variant="outline">
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {/* ✅ Link to the detail page, which we will build next */}
                  <Link href={`/dashboard/alerts/${alert.id}`} className="hover:underline text-indigo-600">
                    {`Parameter '${alert.details.parameter_name}' was ${alert.details.value_entered}`}
                  </Link>
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
              <TableCell colSpan={5} className="h-24 text-center">
                No alerts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}