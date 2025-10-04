// src/app/dashboard/records/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { useDailyRecordStats } from "@/lib/api/stats";
import { useHasPermission } from "@/hooks/useHasPermission";
import {
  PlusCircle,
  Loader2,
  ListChecks,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTestModal from "@/components/modals/create-test-wizard/CreateTestModal";
import TestRecordsTable from "@/components/inventory/records/TestRecordsTable";
import { StatCard } from "@/components/shared/StatCard";
import PaginationControls from "@/components/shared/PaginationControls";
import RecordFilters from "@/components/inventory/records/RecordFilters"; // ✅ 1. Import the new component

export default function RecentTestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ 2. Read all state from the URL, same as the 'All Records' page
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");
  const initialSearch = searchParams.get("search") ?? "";
  const initialStatus = searchParams.get("status") ?? "";
  const initialLabId = searchParams.get("lab");
  const initialOrdering = searchParams.get("ordering");

  // ✅ 3. Add state for all filters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canCreateTest = useHasPermission("inventory.add_testrecord");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [labId, setLabId] = useState<string | null>(initialLabId);
  const [ordering, setOrdering] = useState<string | null>(initialOrdering);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ 4. Effect to sync all filters and sorting to the URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    // Don't reset page on every filter change on this page
    // params.set("page", "1");

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    else params.delete("search");
    if (status) params.set("status", status);
    else params.delete("status");
    if (labId) params.set("lab", labId);
    else params.delete("lab");
    if (ordering) params.set("ordering", ordering);
    else params.delete("ordering");

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, status, labId, ordering, pathname, router]);

  // Stats hook remains separate and correct
  const { stats, isLoading: isLoadingStats } = useDailyRecordStats();

  // The hook for the table now includes all filter/sort/pagination state
  const {
    testRecords,
    totalCount: filteredTotal,
    isLoading: isLoadingTable,
    error,
    mutate: mutateTestRecords,
  } = useTestRecords({
    // view_type is 'recent' by default
    searchTerm: debouncedSearchTerm,
    status: status as any,
    labId: labId,
    ordering: ordering,
    page: page,
    pageSize: pageSize,
  });

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    mutateTestRecords();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatus("");
    setLabId(null);
    setOrdering(null);
  };

  const areFiltersActive = searchTerm || status || labId || ordering;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Recent Test Records
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            An overview of all test records created today.
          </p>
        </div>
        {canCreateTest && (
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Total Tests"
          value={stats?.total_tests}
          isLoading={isLoadingStats}
          icon={<ListChecks className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Pending Review"
          value={stats?.pending_tests}
          isLoading={isLoadingStats}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* ✅ 5. Render the RecordFilters component */}
      <RecordFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        status={status}
        setStatus={setStatus}
        labId={labId}
        setLabId={setLabId}
        ordering={ordering}
        setOrdering={setOrdering}
        clearFilters={clearFilters}
        areFiltersActive={areFiltersActive}
        dateAfter={undefined}
        setDateAfter={undefined}
        dateBefore={undefined}
        setDateBefore={undefined}
      />

      {isLoadingTable && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load records.</div>}

      {/* ✅ 6. Render the table and pagination */}
      {testRecords && (
        <>
          <TestRecordsTable records={testRecords} />
          {/* Always render pagination if there are results, to show the count */}
          {filteredTotal != null && (
            <PaginationControls
              totalCount={filteredTotal}
              currentPage={page}
              pageSize={pageSize}
            />
          )}
        </>
      )}

      <CreateTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
