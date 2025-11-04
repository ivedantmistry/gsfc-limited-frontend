"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { useDailyRecordStats } from "@/lib/api/userstats";
import { useHasPermission } from "@/context/AuthContext";
import Link from "next/link";
import {
  PlusCircle,
  Loader2,
  ListChecks,
  Clock,
  History,
  FlaskConical,
} from "lucide-react";
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
  const canViewAllRecords = useHasPermission(
    "inventory.can_view_all_test_records"
  );

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
    labId,
    analystId: analystId ? Number(analystId) : undefined,
    ordering,
    page,
    pageSize,
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

  const areFiltersActive = !!(
    searchTerm ||
    status ||
    labId ||
    ordering ||
    analystId
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-100">
            <FlaskConical className="h-5 w-5 text-indigo-700" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Recent Test Records
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              An overview of all test records created today.
            </p>
          </div>
        </div>

        {canCreateTest && (
          <div className="flex items-center gap-2">
            <Link href="/dashboard/records/all">
              <Button
                variant="outline"
                className="border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 shadow-sm transition-colors"
              >
                <History className="mr-2 h-4 w-4" />
                Historical Records
              </Button>
            </Link>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Test
            </Button>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Total Tests"
          value={stats?.total_tests}
          isLoading={isLoadingStats}
          icon={<ListChecks className="h-4 w-4 text-indigo-600" />}
        />
        <StatCard
          title="Pending Review"
          value={stats?.pending_tests}
          isLoading={isLoadingStats}
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
      </div>

      {/* Filters */}
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

      {/* Content */}
      {isLoadingTable && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 p-4 border border-red-200 bg-red-50 rounded-md">
          Failed to load records. Please try again.
        </div>
      )}

      {testRecords && (
        <>
          <TestRecordsTable records={testRecords} />
          {filteredTotal != null && filteredTotal > 0 && (
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
