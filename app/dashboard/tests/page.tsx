"use client";

import React, { useState, useEffect } from "react";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { AddTestModal } from "../../../components/modals/AddTestModal";
import { Search, Plus } from "lucide-react";

// NOTE: You will need to create a `useTests` hook similar to `useProducts`
// to fetch and display existing test records. For now, we are just setting
// up the UI structure.

export default function TestEntryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // When a new search is performed, reset to page 1
      // setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Permission check for management actions (e.g., adding a new record)
  const canAddTestRecord = useHasPermission("testing.add_testrecord");

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Optionally, you can trigger a re-fetch of the test list here
    // mutate();
  };

  return (
    <>
      <AddTestModal isOpen={isModalOpen} onClose={handleModalClose} />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Quality Control Testing
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create and manage test records for product quality analysis.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 bg-white py-2 pl-9 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* "Enter New Test Data" Button - visible only with permission */}
            {canAddTestRecord && (
              <button
                onClick={() => setIsModalOpen(true)}
                title="Enter New Test Data"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white font-medium px-4 py-2 text-sm hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Enter Data
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/80 rounded-xl border border-slate-200/70 p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-700">
            Test Records
          </h2>
          <p className="mt-2 text-slate-500">
            A table of existing test records will be displayed here.
          </p>
          {/* Placeholder for a future <TestRecordTable /> component */}
        </div>
      </div>
    </>
  );
}