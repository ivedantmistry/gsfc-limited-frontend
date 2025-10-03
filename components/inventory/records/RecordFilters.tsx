// src/components/inventory/records/RecordFilters.tsx

"use client";

import React, { useRef } from "react";
import { useLabs } from "@/lib/api/lab";
import { Search, X, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

const STATUS_OPTIONS = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CLOSED",
  "RETEST_ORDERED",
] as const;

const SORT_OPTIONS = [
  { value: "-created_at", label: "Date (Newest First)" },
  { value: "created_at", label: "Date (Oldest First)" },
];

// Define all the props this component will need from the parent page
interface RecordFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateAfter: Date | undefined;
  setDateAfter: (date: Date | undefined) => void;
  dateBefore: Date | undefined;
  setDateBefore: (date: Date | undefined) => void;
  status: string;
  setStatus: (value: string) => void;
  labId: string | null;
  setLabId: (value: string | null) => void;
  ordering: string | null;
  setOrdering: (value: string | null) => void;
  clearFilters: () => void;
  areFiltersActive: boolean;
}

export default function RecordFilters({
  searchTerm,
  setSearchTerm,
  dateAfter,
  setDateAfter,
  dateBefore,
  setDateBefore,
  status,
  setStatus,
  labId,
  setLabId,
  ordering,
  setOrdering,
  clearFilters,
  areFiltersActive,
}: RecordFiltersProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { labs, isLoading: isLoadingLabs } = useLabs();

  // Keyboard shortcut logic remains here
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    // ✅ NEW: Main container with card-like styling
    <div className="p-4 border bg-card rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Search Bar */}
        <div className="relative xl:col-span-2">
          <p className="text-sm font-medium mb-1 text-muted-foreground">
            Search Record
          </p>

          <div className="relative">
            {/* Search Icon */}
            <Search className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            {/* Input Field */}
            <Input
              ref={searchInputRef}
              placeholder="Search products..."
              className="pl-10 pr-20 h-10 w-full rounded-md border border-input bg-white text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Shortcut key display */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-xs text-muted-foreground bg-muted border rounded px-2 py-0.5 h-5">
              <Command className="w-3.5 h-3.5" />{" "}
              {/* Command icon from lucide-react */}
              <span className="font-mono text-[0.7rem]">K</span>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">
            Status
          </p>
          <Select
            value={status || "all"}
            onValueChange={(val) => setStatus(val === "all" ? "" : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lab Filter */}
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">Lab</p>
          <Select
            value={labId ?? "all"}
            onValueChange={(val) => setLabId(val === "all" ? null : val)}
            disabled={isLoadingLabs}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Labs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Labs</SelectItem>
              {labs?.map((lab) => (
                <SelectItem key={lab.id} value={String(lab.id)}>
                  {lab.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">
            Sort By
          </p>
          <Select
            value={ordering ?? "all"}
            onValueChange={(val) => setOrdering(val === "all" ? null : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Default (Newest First)</SelectItem>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Pickers and Clear Button */}
      <div className="flex items-end gap-2 mt-4">
        <div className="grid grid-cols-2 gap-2 flex-grow ">
          <div>
            <p className="text-sm font-medium mb-1 text-muted-foreground">
              Start Date
            </p>
            <DatePicker
              date={dateAfter}
              setDate={setDateAfter}
              placeholder="From..."
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-1 text-muted-foreground">
              End Date
            </p>
            <DatePicker
              date={dateBefore}
              setDate={setDateBefore}
              placeholder="To..."
            />
          </div>
        </div>
        {areFiltersActive && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
