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
  // NOTE: Your VersionViewSet does not currently support PATCH for status.
  // This is a placeholder for when you add that functionality.
  // For now, this would be handled in the Django admin.
  alert("Locking a version via the API is not yet implemented in the backend.");
  // Example of what it would look like:
  // const response = await api.patch<Version>(`${VERSIONS_ENDPOINT}${versionId}/`, {
  //   status: "LOCKED",
  // });
  // return response.data;
};

/**
 * Activates a LOCKED version.
 */
export const activateVersion = async (versionId: number) => {
  // NOTE: Your VersionViewSet does not currently support PATCH for is_active.
  // This is a placeholder for when you add that functionality.
  alert(
    "Activating a version via the API is not yet implemented in the backend."
  );
  // Example of what it would look like:
  // const response = await api.patch<Version>(`${VERSIONS_ENDPOINT}${versionId}/`, {
  //   is_active: true,
  // });
  // return response.data;
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
