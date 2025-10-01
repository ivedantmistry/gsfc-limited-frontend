"use client";

import React, { useState, useEffect } from "react";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { AddTestModal } from "../../../components/modals/AddTestModal";
import { TestRecordTable } from "../../../components/inventory/records/TestRecordTable";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { TestRecord } from "@/lib/types/test.types"
/*
 * NOTE: You will need to create a `useTests` data-fetching hook.
 */
// const { tests, totalCount, ... } = useTests({ debouncedSearchTerm, page, pageSize });

const PaginationControls: React.FC<{
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number | undefined;
  nextPageUrl: string | null | undefined;
  prevPageUrl: string | null | undefined;
  itemsLength: number;
}> = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalCount,
  nextPageUrl,
  prevPageUrl,
  itemsLength,
}) => {
  const pageSizes = [10, 25, 50, 75, 100];
  const count = totalCount || 0;
  const startItem = count > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = startItem + itemsLength - 1;

  return (
    <div className="flex items-center justify-between p-4 text-sm text-slate-600 border-t border-slate-200">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="bg-white border border-slate-300 rounded-md p-1.5"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="font-medium">
        {startItem}–{endItem} of {count}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={!prevPageUrl}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!nextPageUrl}
          className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function TestEntryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // --- Placeholder for your data fetching hook ---
  const isLoading = false; // Set to true to test skeleton
  const totalCount = 0;
    const tests: TestRecord[] = []; 
  const error = null;
  const mutate = () => console.log("mutating...");
  // ---------------------------------------------

  const canAddTestRecord = useHasPermission("testing.add_testrecord");
  const canManageTests = useHasPermission("testing.change_testrecord");

  const handleModalClose = () => {
    setIsModalOpen(false);
    mutate();
  };

  return (
    <>
      <AddTestModal isOpen={isModalOpen} onClose={handleModalClose} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Quality Control Testing
            </h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isLoading && totalCount !== undefined && (
              <span className="bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                Total Records: {totalCount}
              </span>
            )}
            {isLoading && (
              <div className="h-7 w-24 bg-slate-200 rounded-full animate-pulse" />
            )}
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 bg-white py-2 pl-9 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {canAddTestRecord && (
              <button
                onClick={() => setIsModalOpen(true)}
                title="Enter New Test Data"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-3 py-2 text-sm hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Enter Data
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/80 rounded-xl border border-slate-200/70">
          <TestRecordTable
            records={tests}
            isLoading={isLoading}
            error={error}
            canManage={canManageTests}
          />
          {totalCount && totalCount > 0 && (
            <PaginationControls
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalCount={totalCount}
              nextPageUrl={null} // Replace with real data
              prevPageUrl={null} // Replace with real data
              itemsLength={tests?.length || 0}
            />
          )}
        </div>
      </div>
    </>
  );
}
