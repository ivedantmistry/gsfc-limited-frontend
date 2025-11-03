// src/app/dashboard/records/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { useDailyRecordStats } from "@/lib/api/userstats";
import { useHasPermission } from "@/context/AuthContext";
import Link from "next/link";
import { PlusCircle, Loader2, ListChecks, Clock, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTestModal from "@/components/modals/create-test-wizard/CreateTestModal";
import TestRecordsTable from "@/components/inventory/records/RecordsTable";
import { StatCard } from "@/components/shared/StatCard";
import PaginationControls from "@/components/shared/PaginationControls";

import {
  FilterContainer,
  SearchFilter,
  StatusFilter,
  LabFilter,
  AnalystFilter,
  SortByFilter,
  ClearFiltersButton,
} from "@/components/inventory/records/filters";

export default function RecentTestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");
  const initialSearch = searchParams.get("search") ?? "";
  const initialStatus = searchParams.get("status") ?? "";
  const initialLabId = searchParams.get("lab");
  const initialOrdering = searchParams.get("ordering");
  const initialAnalystId = searchParams.get("analyst");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const canCreateTest = useHasPermission("inventory.add_testrecord");
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [labId, setLabId] = useState<string | null>(initialLabId);
  const [ordering, setOrdering] = useState<string | null>(initialOrdering);
  const [analystId, setAnalystId] = useState<string | null>(initialAnalystId);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (status) params.set("status", status);
    if (labId) params.set("lab", labId);
    if (ordering) params.set("ordering", ordering);
    if (analystId) params.set("analyst", analystId);

    params.set("page", "1");
    params.set("page_size", String(pageSize));

    router.replace(`${pathname}?${params.toString()}`);
  }, [
    debouncedSearchTerm,
    status,
    labId,
    ordering,
    analystId,
    pathname,
    router,
    pageSize,
  ]);

  const { stats, isLoading: isLoadingStats } = useDailyRecordStats();

  const {
    testRecords,
    totalCount: filteredTotal,
    isLoading: isLoadingTable,
    error,
    mutate: mutateTestRecords,
  } = useTestRecords({
    searchTerm: debouncedSearchTerm,
    status: status
      ? (status as
          | "PENDING"
          | "APPROVED"
          | "REJECTED"
          | "CLOSED"
          | "RETEST_ORDERED")
      : undefined,
    labId: labId,
    // ✅ FIX 1 (Line 96): Convert 'string | null' to 'number | undefined'
    analystId: analystId ? Number(analystId) : undefined,
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
    setAnalystId(null);
  };

  // ✅ FIX 2 (Line 115): Wrap in !!() to force a boolean
  const areFiltersActive = !!(
    searchTerm ||
    status ||
    labId ||
    ordering ||
    analystId
  );
  const canViewAllRecords = useHasPermission(
    "inventory.can_view_all_test_records"
  );
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
          <div className="flex items-center gap-2">
            <Link href="/dashboard/records/all">
              <Button
                variant="outline"
                className="text-indigo-600 bg-white hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-300 shadow-sm transition-colors"
              >
                <History className="mr-2 h-4 w-4" />
                Historical Records
              </Button>
            </Link>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="text-indigo-600 bg-white hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-300 shadow-sm transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Test
            </Button>
          </div>
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

      <FilterContainer>
        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <StatusFilter status={status} setStatus={setStatus} />
        <LabFilter labId={labId} setLabId={setLabId} />

        {canViewAllRecords && (
          <AnalystFilter analystId={analystId} setAnalystId={setAnalystId} />
        )}
        <SortByFilter ordering={ordering} setOrdering={setOrdering} />
        <div className="flex items-center justify-end">
          <ClearFiltersButton
            areFiltersActive={areFiltersActive}
            clearFilters={clearFilters}
          />
        </div>
      </FilterContainer>

      {isLoadingTable && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load records.</div>}

      {testRecords && (
        <>
          <TestRecordsTable records={testRecords} />
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
