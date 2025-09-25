"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="bg-white p-12 rounded-2xl border border-gray-200/80 shadow-sm">
          <Lock className="w-12 h-12 text-gray-400 mb-6 mx-auto" />
          <h1 className="text-2xl font-semibold text-gray-800">Access Denied</h1>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            You don't have permission to view this page. Contact an administrator for access.
          </p>
          <Link href="/dashboard">
            <span className="mt-8 inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-colors hover:bg-gray-800">
              Return to Dashboard
            </span>
          </Link>
      </div>
    </div>
  );
}