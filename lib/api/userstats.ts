// src/api/stats.ts

import useSWR from "swr";
import api from "@/lib/api";

const STATS_ENDPOINT = "/inventory/stats/daily-records/";

export interface DailyRecordStats {
  total_tests: number;
  pending_tests: number;
  approved_tests: number;
  rejected_tests: number;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Fetches the daily statistics for test records.
 */
export function useDailyRecordStats() {
  const { data, error, isLoading } = useSWR<DailyRecordStats>(STATS_ENDPOINT, fetcher);

  return {
    stats: data,
    isLoading,
    error,
  };
}