// src/lib/api/user.ts

import useSWR from "swr";
import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";

// The shape of a User's group
export interface UserGroup {
  name: string;
}

// Represents a User object received from the API
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  groups: UserGroup[];
  all_permissions: string[];
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Fetches a paginated list of all users.
 * ✅ 1. ADD searchTerm PARAMETER
 */
export function useUsers(page = 1, pageSize = 25, searchTerm?: string) {
  const urlParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  // ✅ 2. ADD SEARCH TERM TO THE URL IF IT EXISTS
  if (searchTerm) {
    urlParams.append("search", searchTerm);
  }

  const url = `/auth/users/?${urlParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<User>>(
    url,
    fetcher,
    { keepPreviousData: true }
  );

  return {
    users: data?.results,
    totalCount: data?.count,
    isLoading,
    error,
    mutate,
  };
}
