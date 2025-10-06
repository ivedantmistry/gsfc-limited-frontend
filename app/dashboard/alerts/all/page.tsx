// src/app/dashboard/alerts/all/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAlerts } from "@/lib/api/alerts";
import { History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertsTable from "@/components/alerts/AlertsTable";
import PaginationControls from "@/components/shared/PaginationControls";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format, isValid } from "date-fns";

// --- 1. Import the necessary components for the new layout ---
import { DatePicker } from "@/components/ui/date-picker";
import {
  SearchFilter,
  ClearFiltersButton,
} from "@/components/inventory/records/filters";
import { DatePresetButtons } from "@/components/alerts/filters/DatePresetButtons";
import { AlertStatusFilter } from "@/components/alerts/filters/AlertStatusFilter";

const parseDate = (dateString: string | null): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isValid(date) ? date : undefined;
};

export default function AllAlertsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- (State management and effects remain the same) ---
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");
  const initialSearch = searchParams.get("search") ?? "";
  const initialStatus = searchParams.get("status") ?? "";
  const initialDateAfter = searchParams.get("date_after");
  const initialDateBefore = searchParams.get("date_before");

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [dateAfter, setDateAfter] = useState<Date | undefined>(
    parseDate(initialDateAfter)
  );
  const [dateBefore, setDateBefore] = useState<Date | undefined>(
    parseDate(initialDateBefore)
  );

  // --- 3. Effects to Sync State with URL ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", "1"); // Reset to page 1 on any filter change
    params.set("page_size", String(pageSize));

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (status) params.set("status", status);
    if (dateAfter) params.set("date_after", format(dateAfter, "yyyy-MM-dd"));
    if (dateBefore) params.set("date_before", format(dateBefore, "yyyy-MM-dd"));

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    debouncedSearchTerm,
    status,
    dateAfter,
    dateBefore,
    pathname,
    router,
    pageSize,
  ]);

  // --- 4. Data Fetching with Filters ---
  const { alerts, totalCount, isLoading, error } = useAlerts({
    page,
    pageSize,
    searchTerm: debouncedSearchTerm,
    status: status as any,
    date_after: dateAfter ? format(dateAfter, "yyyy-MM-dd") : undefined,
    date_before: dateBefore ? format(dateBefore, "yyyy-MM-dd") : undefined,
  });

  // --- 5. Helper functions ---
  const clearFilters = () => {
    setSearchTerm("");
    setStatus("");
    setDateAfter(undefined);
    setDateBefore(undefined);
  };

  const areFiltersActive = searchTerm || status || dateAfter || dateBefore;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Past Alerts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A complete history of all alerts, including resolved ones.
          </p>
        </div>
      </div>

      <div className="p-4 border bg-card rounded-lg shadow-sm space-y-4">
        {/* Row 1: Preset Buttons */}
        <DatePresetButtons
          onPresetSelect={({ from, to }) => {
            setDateAfter(from);
            setDateBefore(to);
          }}
        />

        {/* Row 2: Main Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end pt-4 border-t">
          <div className="lg:col-span-2">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          <AlertStatusFilter status={status} setStatus={setStatus} />
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Start Date
            </label>
            <DatePicker
              date={dateAfter}
              setDate={setDateAfter}
              placeholder="From..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              End Date
            </label>
            <DatePicker
              date={dateBefore}
              setDate={setDateBefore}
              placeholder="To..."
            />
          </div>
        </div>

        {/* Render Clear button only if filters are active */}
        {areFiltersActive && (
          <div className="flex justify-end">
            <ClearFiltersButton
              areFiltersActive={areFiltersActive}
              clearFilters={clearFilters}
            />
          </div>
        )}
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
