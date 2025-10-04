// src/api/alerts.ts

import useSWR from "swr";
import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";
import { AlertInList, AlertDetail, AlertStatus } from "@/lib/types/alert.types";

const ALERTS_ENDPOINT = "/alerts/";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Fetches a paginated list of alerts.
 * Supports filtering by status or multiple statuses.
 */
export function useAlerts(params: {
  status?: AlertStatus;
  status__in?: AlertStatus[];
  page?: number;
  pageSize?: number;
}) {
  const urlParams = new URLSearchParams();

  if (params.status) urlParams.append("status", params.status);
  // Handle array of statuses for "in" lookup
  if (params.status__in) {
    urlParams.append("status__in", params.status__in.join(","));
  }
  if (params.page) urlParams.append("page", String(params.page));
  if (params.pageSize) urlParams.append("page_size", String(params.pageSize));

  const url = `${ALERTS_ENDPOINT}?${urlParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<
    PaginatedResponse<AlertInList>
  >(url, fetcher, { keepPreviousData: true });

  return {
    alerts: data?.results,
    totalCount: data?.count,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetches the detailed context for a single alert,
 * including the full test record data.
 */
export function useAlertContext(alertId: number | string | null) {
  const url = alertId ? `${ALERTS_ENDPOINT}${alertId}/context/` : null;

  const { data, error, isLoading, mutate } = useSWR<AlertDetail>(url, fetcher);

  return {
    alert: data,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Updates the status of an alert.
 * @param alertId The ID of the alert to update.
 * @param newStatus The new status ('ACKNOWLEDGED' or 'RESOLVED').
 */
export const updateAlertStatus = async (
  alertId: number,
  newStatus: "ACKNOWLEDGED" | "RESOLVED"
): Promise<AlertInList> => {
  const response = await api.patch(
    `${ALERTS_ENDPOINT}${alertId}/update-status/`,
    {
      status: newStatus,
    }
  );
  return response.data;
};
