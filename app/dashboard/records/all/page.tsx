// src/app/dashboard/records/all/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTestRecords } from "@/lib/api/test";
import { Loader2, Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import TestRecordsTable from "@/components/inventory/records/TestRecordsTable";
import PaginationControls from "@/components/inventory/records/PaginationControls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper to parse dates from URL
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
  const pageSize = Number(searchParams.get("page_size") ?? "10");
  const initialSearch = searchParams.get("search") ?? "";
  const initialDateAfter = searchParams.get("date_after");
  const initialDateBefore = searchParams.get("date_before");

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [dateAfter, setDateAfter] = useState<Date | undefined>(
    parseDate(initialDateAfter)
  );
  const [dateBefore, setDateBefore] = useState<Date | undefined>(
    parseDate(initialDateBefore)
  );

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ FIX: Consolidate all URL-updating logic into a single useEffect
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    else params.delete("search");

    if (dateAfter) params.set("date_after", format(dateAfter, "yyyy-MM-dd"));
    else params.delete("date_after");

    if (dateBefore) params.set("date_before", format(dateBefore, "yyyy-MM-dd"));
    else params.delete("date_before");

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, dateAfter, dateBefore, pathname, router]);

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
    searchTerm: debouncedSearchTerm,
    date_after: initialDateAfter,
    date_before: initialDateBefore,
  });

  const clearFilters = () => {
    setSearchTerm("");
    setDateAfter(undefined);
    setDateBefore(undefined);
  };

  const areFiltersActive =
    initialSearch || initialDateAfter || initialDateBefore;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          All Test Records
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search and filter all historical test records assigned to you.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
       placeholder="Search by Record ID, Product, etc. (Ctrl+K)"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2" align="end">
            <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2">
              <DatePicker
                date={dateAfter}
                setDate={setDateAfter}
                placeholder="Start date"
              />
              <DatePicker
                date={dateBefore}
                setDate={setDateBefore}
                placeholder="End date"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {areFiltersActive && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
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
