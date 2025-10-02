// src/app/dashboard/records/page.tsx

"use client";

import React, { useState } from "react";
import { useTestRecords } from "@/lib/api/test";
import { useHasPermission } from "@/hooks/useHasPermission";
import { Beaker, AlertCircle, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTestModal from "@/components/modals/create-test-wizard/CreateTestModal";
import TestRecordsTable from "@/components/inventory/records/TestRecordsTable";

export default function RecentTestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canCreateTest = useHasPermission("inventory.add_testrecord");

  // ✅ Fetch today's records. The backend automatically filters by date.
  const {
    testRecords,
    isLoading,
    error,
    mutate: mutateTestRecords,
  } = useTestRecords({});

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    mutateTestRecords();
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Recent Test Records
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing all test records created today.
          </p>
        </div>
        {canCreateTest && (
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        )}
      </div>

      {/* Table Section */}
      {isLoading && <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}
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