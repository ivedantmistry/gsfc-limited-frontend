"use client";

import { Lock } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Lock className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-slate-600 mt-2 max-w-sm mx-auto">
          You don&apos;t have permission to view this page. Please contact
          administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
