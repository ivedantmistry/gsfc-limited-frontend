// src/app/dashboard/alerts/[alertId]/layout.tsx

"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useAlertContext } from "@/lib/api/alerts";
import { notFound, useParams } from "next/navigation";
import { Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { AlertDetailContext } from "@/context/AlertDetailContext";

export default function AlertDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const alertId = params.alertId as string;

  const { alert, isLoading, error } = useAlertContext(alertId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !alert) {
    if (error?.response?.status === 404) {
      notFound();
    }
    return (
      <div className="text-center bg-red-50 border ...">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        <h3 className="font-medium">Failed to load alert details</h3>
      </div>
    );
  }

  return (
    <AlertDetailContext.Provider value={{ alert, isLoading, error }}>
      <div className="space-y-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                href="/dashboard/alerts"
                className="text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                Unresolved Alerts
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="ml-1 text-sm font-medium text-slate-500 md:ml-2">
                  {alert.alert_id}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {children}
      </div>
    </AlertDetailContext.Provider>
  );
}
