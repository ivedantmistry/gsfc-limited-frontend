// src/app/dashboard/records/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react"; // ✅ 1. Add useEffect and useRef
import { useTestRecords } from "@/lib/api/test";
import { useHasPermission } from "@/hooks/useHasPermission";
import { PlusCircle, Loader2, Search } from "lucide-react"; // ✅ 2. Add Search icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ✅ 3. Import Input
import CreateTestModal from "@/components/modals/create-test-wizard/CreateTestModal";
import TestRecordsTable from "@/components/inventory/records/TestRecordsTable";

export default function RecentTestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canCreateTest = useHasPermission("inventory.add_testrecord");

  // ✅ 4. Add state for search term and a ref for the input
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debouncing effect for search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard shortcut effect to focus search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // ✅ 5. Pass the debounced search term to the API hook
  const {
    testRecords,
    isLoading,
    error,
    mutate: mutateTestRecords,
  } = useTestRecords({ searchTerm: debouncedSearchTerm });

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    mutateTestRecords();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Recent Test Records
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Showing all test records created today.
        </p>
      </div>

      {/* ✅ 6. Add the search input field */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          ref={searchInputRef}
          placeholder="Search products..."
          className="pl-10 pr-20 h-10 rounded-md border border-input bg-background text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-xs text-muted-foreground bg-muted border rounded px-2 py-0.5">
          <span className="font-mono">
            {typeof window !== "undefined" && navigator.platform.includes("Mac")
              ? "⌘"
              : "Ctrl"}
          </span>
          <span className="font-mono">K</span>
        </div>
      </div>

      {/* Table Section */}
      {isLoading && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load records.</div>}
      {testRecords && <TestRecordsTable records={testRecords} />}

      <CreateTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
