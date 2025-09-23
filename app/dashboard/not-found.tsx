"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-xl border border-gray-200 shadow-sm text-center">
      <Lock className="w-16 h-16 text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
      <p className="text-gray-500 mt-2 max-w-sm">
        You do not have the necessary permissions to view this page. Please
        contact your administrator if you believe this is an error.
      </p>
      <Link href="/dashboard">
        <span className="mt-6 inline-block bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow transition-transform hover:scale-105">
          Return to Dashboard
        </span>
      </Link>
    </div>
  );
}
