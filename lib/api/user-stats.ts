// src/lib/api/user-stats.ts
import useSWR from "swr";
import api from "@/lib/api";
import { User } from "@/lib/api/users"; // Assuming User type is in user.ts

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Type for the chart data points
export interface UserPerformanceDataPoint {
  date: string; // "YYYY-MM-DD"
  count: number;
}

// Type for the summary counts
export interface UserSummaryCounts {
  count_today: number;
  count_week: number;
  count_month: number;
  count_3_months: number;
  count_6_months: number;
  count_year: number;
}

/**
 * Fetches time-series data for a user's performance chart.
 */
export function useUserPerformanceChart(
  userId: number | null,
  params: {
    group_by: "day" | "week" | "month" | "year";
    date_after?: string;
    date_before?: string;
  }
) {
  const urlParams = new URLSearchParams({ group_by: params.group_by });
  if (params.date_after) urlParams.append("date_after", params.date_after);
  if (params.date_before) urlParams.append("date_before", params.date_before);

  const url = userId
    ? `/inventory/stats/users/${userId}/performance-chart/?${urlParams.toString()}`
    : null;

  return useSWR<UserPerformanceDataPoint[]>(url, fetcher);
}

/**
 * Fetches summary counts for a user's activity.
 */
export function useUserSummaryCounts(userId: number | null) {
  const url = userId ? `/inventory/stats/users/${userId}/summary-counts/` : null;

  return useSWR<UserSummaryCounts>(url, fetcher);
}

// Hook to fetch a single user's details for the profile page header
export function useUser(userId: number | string | null) {
  const url = userId ? `/auth/users/${userId}/` : null;
  return useSWR<User>(url, fetcher);
}
