// src/app/dashboard/records/page.tsx

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTestRecords } from "@/lib/api/test";
import { useHasPermission } from "@/hooks/useHasPermission";
import {
  PlusCircle,
  Loader2,
  Search,
  ListChecks,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"; // ✅ 2. Import new icons
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateTestModal from "@/components/modals/create-test-wizard/CreateTestModal";
import TestRecordsTable from "@/components/inventory/records/TestRecordsTable";
import { StatCard } from "@/components/shared/StatCard";

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

  const {
    testRecords,
    totalCount,
    isLoading,
    error,
    mutate: mutateTestRecords,
  } = useTestRecords({ searchTerm: debouncedSearchTerm });

  const stats = useMemo(() => {
    if (!testRecords) {
      return { pending: 0, approved: 0, rejected: 0 };
    }
    return {
      pending: testRecords.filter((r) => r.status === "PENDING").length,
      // approved: testRecords.filter((r) => r.status === "APPROVED").length,
      // rejected: testRecords.filter((r) => r.status === "REJECTED").length,
    };
  }, [testRecords]);
  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    mutateTestRecords();
  };

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

      {/* ✅ 5. Add the Stat Cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Total Tests"
          value={totalCount}
          isLoading={isLoading}
          icon={<ListChecks className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          isLoading={isLoading}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        {/* <StatCard
          title="Approved Today"
          value={stats.approved}
          isLoading={isLoading}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Rejected Today"
          value={stats.rejected}
          isLoading={isLoading}
          icon={<XCircle className="h-4 w-4 text-muted-foreground" />}
        /> */}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search today's records... (Ctrl+K)"
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
