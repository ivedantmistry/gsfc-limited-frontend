// src/api/stats.ts

import useSWR from "swr";
import api from "@/lib/api";
import { QualityTrend } from "@/lib/types";

const STATS_ENDPOINT = "/inventory/stats/";

/**
 * Fetches quality trend data for a given set of parameters.
 *
 * @param params - The query parameters for the API call.
 * @param params.versionId - The ID of the version to fetch data for.
 * @param params.parameterIds - An array of parameter definition IDs.
 * @param params.startDate - The start of the date range (YYYY-MM-DD).
 * @param params.endDate - The end of the date range (YYYY-MM-DD).
 */
export function useQualityTrends(params: {
  versionId: number | null;
  parameterIds: number[];
  startDate: string | null;
  endDate: string | null;
}) {
  const { versionId, parameterIds, startDate, endDate } = params;

  // SWR will not fetch if any of these are null/empty, which is what we want.
  const shouldFetch =
    versionId && parameterIds.length > 0 && startDate && endDate;

  // Construct the URLSearchParams
  const urlParams = new URLSearchParams();
  if (shouldFetch) {
    urlParams.append("version_id", versionId.toString());
    urlParams.append("parameter_ids", parameterIds.join(","));
    urlParams.append("start_date", startDate);
    urlParams.append("end_date", endDate);
  }

  const url = shouldFetch
    ? `${STATS_ENDPOINT}quality-trends/?${urlParams.toString()}`
    : null;

  const { data, error, isLoading } = useSWR<QualityTrend[]>(
    url,
    (url: string) => api.get(url).then((res) => res.data)
  );

  return {
    data: data,
    isLoading,
    error,
  };
}