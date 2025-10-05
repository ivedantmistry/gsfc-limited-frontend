// /app/dashboard/users/[userId]/page.tsx
"use client";

import React from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import UserPerformanceChart from "@/components/users/UserPerformanceChart";

export default function UserProfilePage() {
  const { user } = useUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {user?.first_name} {user?.last_name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Analytics and activity for @{user?.username}
        </p>
      </div>

      {/* The Chart and Stats component will go here */}
      <UserPerformanceChart />

      {/* The powerful search and table will go here later */}
    </div>
  );
}
