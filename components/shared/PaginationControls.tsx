// src/components/records/PaginationControls.tsx

"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export default function PaginationControls({
  totalCount,
  currentPage,
  pageSize,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page_size", newPageSize);
    params.set("page", "1"); // Reset to first page
    router.push(`${pathname}?${params.toString()}`);
  };
 const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
       {totalCount > 0 
            ? `Showing ${startRecord} - ${endRecord} of ${totalCount} records`
            : "No records found"
        }
        
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-[75px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[25, 50, 75, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}