import useSWR from "swr";
import api from "@/lib/api"; // Your configured Axios instance
import { PaginatedResponse } from "@/lib/types";
import { Product } from "@/lib/types/products";

const PRODUCTS_ENDPOINT = "/inventory/products/";

const fetcher = async (url: string): Promise<PaginatedResponse<Product>> => {
  const response = await api.get(url);
  return response.data;
};

/**
 * Custom hook to fetch products, now with search functionality.
 * @param searchTerm The string to search for in product name or description.
 */
export function useProducts(searchTerm: string) {
  // If a search term exists, append it as a query parameter.
  // Your Django backend is already configured to handle this with SearchFilter.
  const searchUrl = searchTerm
    ? `${PRODUCTS_ENDPOINT}?search=${encodeURIComponent(searchTerm)}`
    : PRODUCTS_ENDPOINT;

  const { data, error, isLoading, mutate } = useSWR(searchUrl, fetcher, {
    // Keep previous data while new data is loading for a smoother experience
    keepPreviousData: true,
  });

  return {
    products: data?.results,
    isLoading,
    error,
    mutate,
  };
}