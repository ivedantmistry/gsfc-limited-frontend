"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button"; // ✅ 1. Import the Button component

export default function NotFound() {
  return (
    // ✅ 2. Use a simple, full-screen background for the page
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md text-center">
        {/* Icon and container are consistent */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Compass className="w-12 h-12 text-indigo-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Error 404 - Page Not Found
        </h1>
        {/* ✅ 3. Updated text to match the dashboard 404 page */}
        <p className="text-slate-600 mt-2 max-w-sm mx-auto">
          Sorry, we couldn’t find the page you were looking for. It might have
          been moved or deleted.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          If you believe this is a mistake, please contact your administrator.
        </p>

        <div className="mt-8">
          <Link href="/dashboard">
            {/* ✅ 4. Use the Button component for a consistent look */}
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
