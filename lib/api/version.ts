// src/api/version.ts

import useSWR from "swr";
import api from "@/lib/api";
import { Version, VersionNested } from "@/lib/types";

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
 * ✅ NEW: Fetches a single, detailed version by its ID.
 * This will include its parameters and grades.
 */
export function useVersion(versionId: string | number) {
  const url = versionId ? `${VERSIONS_ENDPOINT}${versionId}/` : null;
  const { data, error, isLoading, mutate } = useSWR<VersionNested>(
    url,
    listFetcher
  );

  return {
    version: data,
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
 * ✅ NEW: Updates a specific field on a version (e.g., the name).
 */
export const updateVersion = async (
  versionId: number,
  data: Partial<Version>
) => {
  const response = await api.patch<Version>(
    `${VERSIONS_ENDPOINT}${versionId}/`,
    data
  );
  return response.data;
};


/**
 * Locks a DRAFT version.
 */
export const lockVersion = async (versionId: number) => {
  // UPDATED: Replaced alert with a real API call
  const response = await api.patch<Version>(
    `${VERSIONS_ENDPOINT}${versionId}/`,
    {
      status: "LOCKED",
    }
  );
  return response.data;
};

/**
 * Activates a LOCKED version.
 */
export const activateVersion = async (versionId: number) => {
  // UPDATED: Replaced alert with a real API call
  const response = await api.patch<Version>(
    `${VERSIONS_ENDPOINT}${versionId}/`,
    {
      is_active: true,
    }
  );
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

/**
 * ✅ NEW: Deletes a DRAFT version.
 */
export const deleteVersion = async (versionId: number) => {
  await api.delete(`${VERSIONS_ENDPOINT}${versionId}/`);
};


/**
 * ✅ NEW: Fetches the single active, nested version for a given product.
 * This is the primary data source for the test creation form.
 */
export function useActiveVersionForProduct(productId: number | null) {
  // The backend filterset allows filtering by product and active status.
  const url = productId
    ? `${VERSIONS_ENDPOINT}?product=${productId}&is_active=true`
    : null;

  const { data, error, isLoading, mutate } = useSWR<VersionNested[]>(
    url,
    listFetcher
  );

  return {
    // The API returns an array, but there should only be one active version.
    activeVersion: data && data.length > 0 ? data[0] : undefined,
    isLoading,
    error,
    mutate,
  };
}