// src/api/product.ts

import useSWR from "swr";
import api from "@/lib/api";
import { PaginatedResponse } from "@/lib/types";
import { Product } from "@/lib/types";

const PRODUCTS_ENDPOINT = "/inventory/products/";

const listFetcher = (url: string) => api.get(url).then((res) => res.data);
const singleFetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Fetches a paginated list of all products.
 */
export function useProducts(params: {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}) {
  const urlParams = new URLSearchParams();
  if (params.searchTerm) urlParams.append("search", params.searchTerm);
  if (params.page) urlParams.append("page", params.page.toString());
  if (params.pageSize) urlParams.append("page_size", params.pageSize.toString());

  const url = `${PRODUCTS_ENDPOINT}?${urlParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    url,
    listFetcher,
    { keepPreviousData: true }
  );

  return {
    products: data?.results,
    totalCount: data?.count,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetches a single product by its ID.
 */
export function useProduct(productId: string | number) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    productId ? `${PRODUCTS_ENDPOINT}${productId}/` : null,
    singleFetcher
  );

  return {
    product: data,
    isLoading,
    error,
    mutate,
  };
}

/**
 * ✅ NEW: Fetches a non-paginated list of all products.
 * Ideal for populating searchable dropdowns where all options are needed at once.
 */
export function useAllProducts() {
  // We add a large page_size to simulate fetching all items.
  // Adjust if your backend supports a specific 'all' parameter.
  const url = `${PRODUCTS_ENDPOINT}?page_size=1000`; 

  const { data, error, isLoading } = useSWR<PaginatedResponse<Product>>(
    url,
    (url: string) => api.get(url).then((res) => res.data)
  );

  return {
    products: data?.results,
    isLoading,
    error,
  };
}