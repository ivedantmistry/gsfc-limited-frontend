// app/dashboard/records/all/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { Loader2 } from "lucide-react";
import { format, isValid } from "date-fns";
import TestRecordsTable from "@/components/inventory/records/RecordsTable";
import PaginationControls from "@/components/shared/PaginationControls";
// import RecordFilters from "@/components/inventory/records/RecordFilters";

import {
  FilterContainer,
  SearchFilter,
  StatusFilter,
  LabFilter,
  SortByFilter,
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
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    else params.delete("search");
    if (dateAfter) params.set("date_after", format(dateAfter, "yyyy-MM-dd"));
    else params.delete("date_after");
    if (dateBefore) params.set("date_before", format(dateBefore, "yyyy-MM-dd"));
    else params.delete("date_before");
    if (status) params.set("status", status);
    else params.delete("status");
    if (labId) params.set("lab", labId);
    else params.delete("lab");
    if (ordering) params.set("ordering", ordering);
    else params.delete("ordering");
    if (analystId) params.set("analyst", analystId);
    else params.delete("analyst");

    router.replace(`${pathname}?${params.toString()}`);
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
  ]);

  const { testRecords, totalCount, isLoading, error } = useTestRecords({
    view_type: "historical",
    page: page,
    pageSize: pageSize,
    searchTerm: initialSearch,
    date_after: initialDateAfter,
    date_before: initialDateBefore,
    status: initialStatus as any,
    labId: initialLabId,
    analystId: analystId,
    ordering: initialOrdering,
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

  const areFiltersActive =
    initialSearch ||
    initialDateAfter ||
    initialDateBefore ||
    initialStatus ||
    initialLabId ||
    initialOrdering;

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

      <RecordFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateAfter={dateAfter}
        setDateAfter={setDateAfter}
        dateBefore={dateBefore}
        setDateBefore={setDateBefore}
        status={status}
        setStatus={setStatus}
        labId={labId}
        setLabId={setLabId}
        analystId={analystId}
        setAnalystId={setAnalystId}
        ordering={ordering}
        setOrdering={setOrdering}
        clearFilters={clearFilters}
        areFiltersActive={areFiltersActive}
      />

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
