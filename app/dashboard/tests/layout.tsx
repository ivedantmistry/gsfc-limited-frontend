"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { AddTestModal } from "../../../components/modals/AddTestModal";
import {
  FilePlus,
  FlaskConical,
  Clock,
  ChevronRight,
  ShieldAlert,
  Beaker,
} from "lucide-react";

// --- MOCK DATA ---
// This would come from a `usePendingTests` hook in a real implementation.
const mockPendingTests = [
  {
    id: 1,
    record_id: "QC-2023-0928-001",
    product_name: "Ammonia (NH3)",
    status: "PENDING",
    assigned_at: "2023-09-28T10:00:00Z",
  },
  {
    id: 2,
    record_id: "QC-2023-0928-002",
    product_name: "Urea (46-0-0)",
    status: "RETEST",
    assigned_at: "2023-09-27T15:30:00Z",
  },
  {
    id: 3,
    record_id: "QC-2023-0927-015",
    product_name: "Sulphuric Acid (98%)",
    status: "PENDING",
    assigned_at: "2023-09-27T11:45:00Z",
  },
];
// --- END MOCK DATA ---

// A component to render a single pending test item
const PendingTestItem = ({ test }: { test: (typeof mockPendingTests)[0] }) => {
  const isRetest = test.status === "RETEST";
  const timeSince = new Date(test.assigned_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/dashboard/records/${test.record_id}`}>
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
              ID: {test.record_id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isRetest && (
            <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
              RETEST REQUIRED
            </span>
          )}
          <span className="flex items-center text-sm text-slate-500">
            <Clock className="w-4 h-4 mr-1.5" />
            {timeSince}
          </span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </span>
    </Link>
  );
};

export default function TestResultEntryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canEnterData = useHasPermission("testing.add_testrecord");

  // In a real app, you would fetch pending tests:
  // const { data: pendingTests, isLoading } = usePendingTests();

  return (
    <>
      <AddTestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Test Result Entry
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a pending test or start a new record from scratch.
          </p>
        </div>

        {/* Section 1: Pending Tests Assigned to User */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Beaker className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-slate-800">
              Your Pending Tests ({mockPendingTests.length})
            </h2>
          </div>
          {mockPendingTests.length > 0 ? (
            <div className="space-y-3">
              {mockPendingTests.map((test) => (
                <PendingTestItem key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white border border-dashed border-slate-300 rounded-lg p-12">
              <h3 className="font-medium text-slate-700">All caught up!</h3>
              <p className="text-sm text-slate-500 mt-1">
                You have no tests currently assigned to you.
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-50 px-2 text-sm font-medium text-slate-500">OR</span>
          </div>
        </div>


        {/* Section 2: Start a New Test Record */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Start an Ad-Hoc Test
          </h2>
          {canEnterData ? (
            <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-slate-200/80">
              <h3 className="text-lg font-semibold text-slate-800">
                Create a New Record
              </h3>
              <p className="text-slate-600 my-3 max-w-2xl mx-auto">
                If the sample is not in your pending list, you can start a new
                test record by finding the product and entering the sample
                details manually.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FilePlus className="w-5 h-5 mr-2" />
                Enter New Test Data
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center bg-yellow-50 border-l-4 border-yellow-400 p-8 rounded-lg">
              <ShieldAlert className="w-12 h-12 text-yellow-500 mb-3" />
              <h3 className="text-lg font-semibold text-yellow-800">
                Permission Required
              </h3>
              <p className="mt-1 text-yellow-700">
                You do not have permission to create new test records.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

