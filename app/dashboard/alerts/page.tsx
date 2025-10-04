// src/app/dashboard/alerts/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { useAlerts } from "@/lib/api/alerts";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertsTable from "@/components/alerts/AlertsTable"; // We will create this next
import  PaginationControls  from "@/components/shared/PaginationControls";
import { useSearchParams } from "next/navigation";

export default function UnresolvedAlertsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");

  const {
    alerts,
    totalCount,
    isLoading,
    error,
  } = useAlerts({
    status__in: ["NEW", "ACKNOWLEDGED"],
    page,
    pageSize,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Unresolved Alerts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing all out-of-spec results that require attention.
          </p>
        </div>
        <Link href="/dashboard/alerts/all">
          <Button variant="outline">View All Historical Alerts</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load alerts.</div>}
      
      {alerts && (
        <>
          <AlertsTable alerts={alerts} />
          {totalCount && totalCount > pageSize && (
            <PaginationControls
              totalCount={totalCount}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </div>
  );
}