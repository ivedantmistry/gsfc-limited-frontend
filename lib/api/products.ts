import useSWR from "swr";
import api from "@/lib/api"; // Your configured Axios instance
import { PaginatedResponse } from "@/lib/types";
import { Product } from "@/lib/types/products";

// The endpoint path is now a private implementation detail of this file.
// The UI component will never see it.
const PRODUCTS_ENDPOINT = "/inventory/products/";

/**
 * This is the private fetcher function. It uses your global `api` instance.
 * SWR will call this with the endpoint path.
 */
const fetcher = async (url: string): Promise<PaginatedResponse<Product>> => {
  const response = await api.get(url);
  return response.data;
};

/**
 * ✅ This is the custom hook your component will use.
 * It handles all the logic: fetching, caching, loading states, and errors.
 * It completely hides the endpoint path and SWR from the UI.
 */
export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR(PRODUCTS_ENDPOINT, fetcher);

  // We return a clean object with everything the component needs
  return {
    products: data?.results,
    isLoading,
    error,
    mutate,
  };
}