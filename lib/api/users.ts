// lib/api/users.ts
import useSWR from "swr";
import api from "@/lib/api";
import { User, PaginatedResponse } from "@/lib/types"; // Import from single source of truth

const fetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Fetches a paginated list of system users.
 */
export function useUsers(page = 1, pageSize = 25, searchTerm?: string) {
  const urlParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (searchTerm) {
    urlParams.append("search", searchTerm);
  }
  const url = `/auth/users/?${urlParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<User>>(
    url,
    fetcher
  );

  return {
    users: data?.results,
    totalCount: data?.count,
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
