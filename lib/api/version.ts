// src/api/version.ts

import useSWR from "swr";
import api from "@/lib/api";
import { Version } from "@/lib/types";

const VERSIONS_ENDPOINT = "/inventory/versions/";

const listFetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Fetches a list of versions for a specific product.
 */
export function useVersions(productId: string | number) {
  const url = productId ? `${VERSIONS_ENDPOINT}?product=${productId}` : null;
  const { data, error, isLoading, mutate } = useSWR<Version[]>(
    url,
    listFetcher
  );

  return {
    versions: data,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Creates a new, DRAFT version for a product.
 */
export const createVersion = async (data: {
  product: number;
  version_name: string;
  description?: string;
}) => {
  const response = await api.post<Version>(VERSIONS_ENDPOINT, data);
  return response.data;
};

/**
 * Locks a DRAFT version.
 */
export const lockVersion = async (versionId: number) => {
  // UPDATED: Replaced alert with a real API call
  const response = await api.patch<Version>(`${VERSIONS_ENDPOINT}${versionId}/`, {
    status: "LOCKED",
  });
  return response.data;
};

/**
 * Activates a LOCKED version.
 */
export const activateVersion = async (versionId: number) => {
  // UPDATED: Replaced alert with a real API call
  const response = await api.patch<Version>(`${VERSIONS_ENDPOINT}${versionId}/`, {
    is_active: true,
  });
  return response.data;
};

/**
 * Creates a new DRAFT version from an existing one.
 */
export const createNewVersionFromExisting = async (versionId: number) => {
  const response = await api.post<Version>(
    `${VERSIONS_ENDPOINT}${versionId}/create-new-version/`,
    {}
  );
  return response.data;
};
