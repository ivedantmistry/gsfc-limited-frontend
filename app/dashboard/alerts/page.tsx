// src/app/dashboard/alerts/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAlerts } from "@/lib/api/alerts";
import { History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertsTable from "@/components/alerts/AlertsTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  SearchFilter,
  ClearFiltersButton,
} from "@/components/inventory/records/filters";

export default function UnresolvedAlertsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- 1. State Management for Pagination and Search ---
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");
  const initialSearch = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  // --- 2. Effects to Sync State with URL ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to page 1 on search
    params.set("page_size", String(pageSize));

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, pathname, router, pageSize]);

  // --- 3. Data Fetching with Search Term ---
  const { alerts, totalCount, isLoading, error } = useAlerts({
    status__in: ["NEW", "ACKNOWLEDGED"],
    page,
    pageSize,
    searchTerm: debouncedSearchTerm,
  });

  // --- 4. Helper functions for the filter ---
  const clearFilters = () => {
    setSearchTerm("");
  };

  const areFiltersActive = !!searchTerm;

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
          <Button
            variant="outline"
            className="text-indigo-600 bg-white hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-300 shadow-sm transition-colors"
          >
            <History className="mr-2 h-4 w-4" />
            View All Historical Alerts
          </Button>
        </Link>
      </div>

      {/* --- 5. Add the Search Filter UI --- */}
      <div className="p-4 border bg-card rounded-lg shadow-sm flex items-center gap-4">
        <div className="flex-grow">
          <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <ClearFiltersButton
          areFiltersActive={areFiltersActive}
          clearFilters={clearFilters}
        />
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
          {totalCount != null && totalCount > 0 && (
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
