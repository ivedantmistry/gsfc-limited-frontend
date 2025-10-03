// src/app/dashboard/records/all/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TestRecordsTable from "@/components/inventory/records/TestRecordsTable";
import PaginationControls from "@/components/inventory/records/PaginationControls";

export default function AllRecordsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read state from URL
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "10");
  const initialSearch = searchParams.get("search") ?? "";

  // State for search term
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Effect to update URL when debounced search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset to first page on new search
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    // Use replace to avoid polluting browser history on every keystroke
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, pathname, router]);

  // Keyboard shortcut effect
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

  const { testRecords, totalCount, isLoading, error } = useTestRecords({
    view_type: "historical",
    page: page,
    pageSize: pageSize,
    searchTerm: debouncedSearchTerm, // Pass search term to API hook
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          All Test Records
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search all historical test records assigned to you.
        </p>
      </div>

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
                    {typeof window !== "undefined" &&
                    navigator.platform.includes("Mac")
                      ? "⌘"
                      : "Ctrl"}
                  </span>
                  <span className="font-mono">K</span>
                </div>
              </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load records.</div>}
      {testRecords && (
        <>
          <TestRecordsTable records={testRecords} />
          {totalCount && totalCount > pageSize && (
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
