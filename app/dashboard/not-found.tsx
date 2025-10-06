"use client";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Compass className="w-12 h-12 text-indigo-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Error 404 - Page Not Found
        </h1>
        <p className="text-slate-600 mt-2 max-w-sm mx-auto">
          Sorry, we couldn’t find the page you were looking for. It might have
          been moved or deleted.
        </p>
        <p className="text-sm text-slate-500 mt-2">
          If you believe this is a mistake, please contact your administrator.
        </p>
      </div>
    </div>
  );
}
