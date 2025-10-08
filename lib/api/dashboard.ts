// src/api/dashboard.ts
import useSWR from "swr";
import api from "@/lib/api";
import { ProductHealth } from "@/lib/types/dashboard.types";

const DASHBOARD_ENDPOINT = "/inventory/dashboard/";

export function useProductHealthDashboard(includeOutliers: boolean) { // ✅ Accept the parameter
  // Append the query parameter to the URL
  const url = `${DASHBOARD_ENDPOINT}product-health/?include_outliers=${includeOutliers}`;

  const { data, error, isLoading, mutate } = useSWR<ProductHealth[]>(
    url,
    (url: string) => api.get(url).then((res) => res.data)
  );

  return {
    dashboardData: data,
    isLoading,
    error,
    mutate,
  };
}