// src/app/dashboard/alerts/[alertId]/page.tsx

"use client";

import React from "react";
import { useAlertDetail } from "@/context/AlertDetailContext";
import { Loader2 } from "lucide-react";
import AlertHeader from "@/components/alerts/AlertHeader";
import AlertInfoCard from "@/components/alerts/AlertInfoCard";
import AlertActions from "@/components/alerts/AlertActions";
import ResultsTable from "@/components/inventory/records/ResultsTable";

export default function AlertDetailPage() {
  const { alert } = useAlertDetail();

  if (!alert) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <AlertHeader alert={alert} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* We reuse the ResultsTable to show the full test context */}
          <ResultsTable results={alert.test_record_data.results} />
          <AlertInfoCard alert={alert} />
        </div>
        <div className="space-y-6">
          <AlertActions alert={alert} />
        </div>
      </div>
    </>
  );
}
