// app/dashboard/records/all/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { Loader2 } from "lucide-react";
import { format, isValid } from "date-fns";
import TestRecordsTable from "@/components/inventory/records/RecordsTable";
import PaginationControls from "@/components/shared/PaginationControls";

// ✅ 1. Import all the necessary filter components
import {
  FilterContainer,
  SearchFilter,
  StatusFilter,
  LabFilter,
  AnalystFilter,
  SortByFilter,
  DateRangeFilter,
  ClearFiltersButton,
} from "@/components/inventory/records/filters";

const parseDate = (dateString: string | null): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isValid(date) ? date : undefined;
};

export default function AllRecordsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");
  const initialSearch = searchParams.get("search") ?? "";
  const initialDateAfter = searchParams.get("date_after");
  const initialDateBefore = searchParams.get("date_before");
  const initialStatus = searchParams.get("status") ?? "";
  const initialLabId = searchParams.get("lab");
  const initialOrdering = searchParams.get("ordering");
  const initialAnalystId = searchParams.get("analyst");

  const [status, setStatus] = useState(initialStatus);
  const [labId, setLabId] = useState(initialLabId);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [dateAfter, setDateAfter] = useState<Date | undefined>(
    parseDate(initialDateAfter)
  );
  const [dateBefore, setDateBefore] = useState<Date | undefined>(
    parseDate(initialDateBefore)
  );
  const [ordering, setOrdering] = useState(initialOrdering);
  const [analystId, setAnalystId] = useState<string | null>(initialAnalystId);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(); // Start with fresh params
    params.set("page", "1"); // Always reset to page 1 on filter change

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (dateAfter) params.set("date_after", format(dateAfter, "yyyy-MM-dd"));
    if (dateBefore) params.set("date_before", format(dateBefore, "yyyy-MM-dd"));
    if (status) params.set("status", status);
    if (labId) params.set("lab", labId);
    if (ordering) params.set("ordering", ordering);
    if (analystId) params.set("analyst", analystId);

    // Only push to router if the params have changed
    if (params.toString() !== new URLSearchParams(searchParams).toString()) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [
    debouncedSearchTerm,
    dateAfter,
    dateBefore,
    status,
    labId,
    ordering,
    analystId,
    pathname,
    router,
    searchParams,
  ]);

  // ✅ 2. FIX: Use state variables for the API call, not the initial values from the URL.
  const { testRecords, totalCount, isLoading, error } = useTestRecords({
    view_type: "historical",
    page: page,
    pageSize: pageSize,
    searchTerm: debouncedSearchTerm,
    date_after: dateAfter ? format(dateAfter, "yyyy-MM-dd") : undefined,
    date_before: dateBefore ? format(dateBefore, "yyyy-MM-dd") : undefined,
    status: status as any,
    labId: labId,
    analystId: analystId,
    ordering: ordering,
  });

  const clearFilters = () => {
    setSearchTerm("");
    setDateAfter(undefined);
    setDateBefore(undefined);
    setStatus("");
    setLabId(null);
    setOrdering(null);
    setAnalystId(null);
  };

  // ✅ 3. FIX: Check active state from the current state variables, not the initial ones.
  const areFiltersActive =
    searchTerm ||
    dateAfter ||
    dateBefore ||
    status ||
    labId ||
    ordering ||
    analystId;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          All Test Records
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search, filter, and sort all historical test records.
        </p>
      </div>

      {/* ✅ 4. Replace the old component with the new composable filter layout */}
      <FilterContainer>
        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <StatusFilter status={status} setStatus={setStatus} />
        <LabFilter labId={labId} setLabId={setLabId} />
        <AnalystFilter analystId={analystId} setAnalystId={setAnalystId} />
        <SortByFilter ordering={ordering} setOrdering={setOrdering} />
        <div className="flex items-end gap-2 mt-4 xl:col-span-full">
          <DateRangeFilter
            dateAfter={dateAfter}
            setDateAfter={setDateAfter}
            dateBefore={dateBefore}
            setDateBefore={setDateBefore}
          />
          <ClearFiltersButton
            areFiltersActive={areFiltersActive}
            clearFilters={clearFilters}
          />
        </div>
      </FilterContainer>

      {isLoading && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load records.</div>}
      {testRecords && (
        <>
          <TestRecordsTable records={testRecords} />
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
