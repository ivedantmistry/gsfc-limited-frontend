// src/api/lab.ts

import useSWR from "swr";
import api from "@/lib/api";

const LABS_ENDPOINT = "/inventory/labs/";

export interface Lab {
  id: number;
  name: string;
  description: string | null;
}

const fetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Fetches a list of all available labs.
 */
export function useLabs() {
  const { data, error, isLoading } = useSWR<Lab[]>(LABS_ENDPOINT, fetcher);

  return {
    labs: data,
    isLoading,
    error,
  };
}