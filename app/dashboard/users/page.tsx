// src/app/dashboard/admin/users/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUsers } from "@/lib/api/users";
import UsersTable from "@/components/users/UsersTable";
import { Command, Loader2, Search } from "lucide-react";
import PaginationControls from "@/components/shared/PaginationControls";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("page_size") ?? "25");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debouncing effect to prevent API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard shortcut (Ctrl+K) to focus search
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

  const { users, totalCount, isLoading, error } = useUsers(
    page,
    pageSize,
    debouncedSearchTerm
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          User Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all users in the system.
        </p>
      </div>

      {/* ✅ 3. ADD THE SEARCH BAR UI */}
      <div className="p-4 border bg-card rounded-lg shadow-sm">
        <div className="relative">
          <p className="text-sm font-medium mb-1 text-muted-foreground">
            Search Users
          </p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search by username, name, or email..."
              className="pl-10 pr-20 h-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-xs text-muted-foreground bg-muted border rounded px-2 py-0.5 h-5">
              <Command className="w-3.5 h-3.5" />
              <span className="font-mono text-[0.7rem]">K</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && <div className="text-red-600">Failed to load users.</div>}

      {users && (
        <>
          <UsersTable users={users} />
          {totalCount != null && (
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
