"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTestRecords } from "@/lib/api/test";
import { TestRecord } from "@/lib/types/test.types";
import { useHasPermission } from "@/hooks/useHasPermission";
import { FlaskConical, ChevronRight, Beaker, AlertCircle, PlusCircle } from "lucide-react";
import CreateTestModal from "@/components/modals/create-test-wizard/CreateTestModal";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-12">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
  </div>
);

// A component to render a single pending test item, now using real data
const PendingTestItem = ({ test }: { test: TestRecord }) => {
  // 3. Use the real TestRecord type
  // A test is considered a retest if it has a link to a previous test
  const isRetest = !!test.retest_record_id;

  return (
    // 4. Link to the test record detail page using the numeric ID for the URL
    <Link href={`/dashboard/records/${test.id}`}>
      <span className="flex items-center justify-between p-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/80 transition-all duration-150 shadow-sm">
        <div className="flex items-center">
          <div
            className={`mr-4 p-2.5 rounded-full ${
              isRetest ? "bg-yellow-100" : "bg-blue-100"
            }`}
          >
            <FlaskConical
              className={`w-5 h-5 ${
                isRetest ? "text-yellow-600" : "text-blue-600"
              }`}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{test.product_name}</p>
            <p className="text-sm text-slate-500 font-mono">
              ID: {test.record_id}{" "}
              {/* 5. Use the human-readable record_id for display */}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isRetest && (
            <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
              RETEST
            </span>
          )}
          {/* 6. Time has been removed as requested */}
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </span>
    </Link>
  );
};

export default function TestResultEntryPage() {
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canCreateTest = useHasPermission("inventory.add_testrecord");

  const {
    testRecords: pendingTests,
    isLoading,
    error,
    mutate: mutateTestRecords, // Get mutate function to refresh list later
  } = useTestRecords({ status: "PENDING" });

  const handleCreateSuccess = () => {
    // This function will be called by the modal on success
    setIsModalOpen(false);
    mutateTestRecords(); // Re-fetch the list of pending tests
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="text-center bg-red-50 border border-dashed border-red-300 rounded-lg p-12 text-red-700">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <h3 className="font-medium">Failed to load tests</h3>
          <p className="text-sm text-red-600 mt-1">
            There was an error fetching your assigned tests. Please try again
            later.
          </p>
        </div>
      );
    }

    if (pendingTests && pendingTests.length > 0) {
      return (
        <div className="space-y-3">
          {pendingTests.map((test) => (
            <PendingTestItem key={test.id} test={test} />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center bg-white border border-dashed border-slate-300 rounded-lg p-12">
        <h3 className="font-medium text-slate-700">All caught up!</h3>
        <p className="text-sm text-slate-500 mt-1">
          You have no tests currently assigned to you.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Test Result Entry
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a pending test from your queue or create a new test record.
          </p>
        </div>
        {canCreateTest && (
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        )}
      </div>

      {/* Section 1: Pending Tests Assigned to User */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Beaker className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-800">
            Your Pending Tests ({isLoading ? "..." : pendingTests?.length ?? 0})
          </h2>
        </div>
        {renderContent()}
      </div>

       {/* Render the Modal */}
      <CreateTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
