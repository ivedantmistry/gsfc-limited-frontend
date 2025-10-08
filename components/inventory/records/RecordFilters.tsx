"use client";

import React from "react";
import {
  FilterContainer,
  SearchFilter,
  StatusFilter,
  LabFilter,
  AnalystFilter,
  SortByFilter,
  DateRangeFilter,
  ClearFiltersButton,
} from "./filters";
import { useHasPermission } from "@/context/AuthContext";

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
  analystId: string | null;
  setAnalystId: (value: string | null) => void;
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
  analystId,
  setAnalystId,
  ordering,
  setOrdering,
  clearFilters,
  areFiltersActive,
}: RecordFiltersProps) {
  const canViewAllRecords = useHasPermission(
  "inventory.can_view_all_test_records"
);
  return (
    <FilterContainer>
      <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StatusFilter status={status} setStatus={setStatus} />
      <LabFilter labId={labId} setLabId={setLabId} />

      {canViewAllRecords && (
        <AnalystFilter analystId={analystId} setAnalystId={setAnalystId} />
      )}

      <SortByFilter ordering={ordering} setOrdering={setOrdering} />
      <div className="flex items-end gap-2 mt-4 xl:col-span-full">
        <DateRangeFilter
          dateAfter={dateAfter}
          setDateAfter={setDateAfter}
          dateBefore={dateBefore}
          setDateBefore={setDateBefore}
        />
        <ClearFiltersButton
          areFiltersActive={areFiltersActive}
          clearFilters={clearFilters}
        />
      </div>
    </FilterContainer>
  );
}
