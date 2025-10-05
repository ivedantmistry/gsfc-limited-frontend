// lib/api/users.ts
import useSWR from "swr";
import api from "@/lib/api";
import { User, PaginatedResponse } from "@/lib/types"; // Import from your central types file

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// --- TYPES for User Stats ---
export interface UserPerformanceDataPoint {
  date: string; // "YYYY-MM-DD"
  count: number;
}

export interface UserSummaryCounts {
  count_today: number;
  count_week: number;
  count_month: number;
  count_3_months: number;
  count_6_months: number;
  count_year: number;
  count_custom:number;
}

// --- HOOKS ---

/**
 * Fetches a paginated list of system users.
 */
export function useUsers(page = 1, pageSize = 25, searchTerm?: string) {
  const urlParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (searchTerm) urlParams.append("search", searchTerm);

  const url = `/auth/users/?${urlParams.toString()}`;

  // ✅ FIX: Destructure the response from useSWR here
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<User>>(
    url,
    fetcher
  );

  // ✅ And then return a new object with the desired shape
  return {
    users: data?.results, // 'data.results' becomes 'users'
    totalCount: data?.count, // 'data.count' becomes 'totalCount'
    isLoading,
    error,
    mutate,
  };
}
/**
 * Fetches a single system user by their ID.
 */
export function useUser(userId: number | string | null) {
  const url = userId ? `/auth/users/${userId}/` : null;
  return useSWR<User>(url, fetcher);
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
export function useUserSummaryCounts(
  userId: number | null,
  date_after?: string,
  date_before?: string
) {
  const urlParams = new URLSearchParams();
  if (date_after) urlParams.append("date_after", date_after);
  if (date_before) urlParams.append("date_before", date_before);

  const queryString = urlParams.toString();

  const url = userId
    ? `/inventory/stats/users/${userId}/summary-counts/${
        queryString ? "?" + queryString : ""
      }`
    : null;

  return useSWR<UserSummaryCounts>(url, fetcher);
}
